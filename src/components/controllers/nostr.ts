import {SimplePool, getEventHash, getSignature, relayInit} from 'nostr-tools'
import { Story } from '../models/story';
import { truncateMarkdownToWords } from './utils';
import { NostrProfile, SMUT_IDS, SMUT_RELAY, STORY_KIND } from '../models/nostrProfile';
import { createHash } from 'crypto';

export function sha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
}

export async function getNostrProfile(nostr: any): Promise<NostrProfile | null> {

    const relays = Object.keys(await nostr.getRelays()) as string[];
    const pubkey = (await nostr.getPublicKey()) as string ;

    const pool = new SimplePool();

    try {
        const event = await pool.get(relays, {
            kinds: [0],
            authors: [pubkey]
        })

        if(!event) throw new Error('No Profile Found')


        await pool.close(relays);

        return eventToNostrProfile(event, relays)
    } catch(e) {
        await pool.close(relays);
        return null;
    }
}

export async function getNostrProfileFromKey(pubkey: string): Promise<NostrProfile | null> {

    const relay = relayInit(SMUT_RELAY);

    try {
        await relay.connect();
        const profile = await relay.get({
            kinds: [0],
            authors: [pubkey]
        })
        await relay.close();

        if(!profile) throw new Error('No Profile Found')

        return {
            pubkey,
            relays: [SMUT_RELAY],
            ...(JSON.parse((profile as any).content))
        } as NostrProfile
    } catch(e) {
        await relay.close();
        return null;
    }
}

export async function postStory(
    title: string,
    story: string, 
    nostr: any
) {

    const relay = relayInit(SMUT_RELAY);
    const relays = Object.keys(await nostr.getRelays()) as string[];
    const pubkey = (await nostr.getPublicKey()) as string ;

    const pool = new SimplePool();
    await relay.connect();

    try {

        const profile = await pool.get(relays, {
            kinds: [0],
            authors: [pubkey]
        })
        await pool.close(relays);

        if(!profile) throw new Error('No Profile Found')

        await relay.publish(profile);

        let event = {
            kind: STORY_KIND,
            pubkey,
            created_at: Math.floor(Date.now() / 1000),
            content: story,
            tags: [
                ['d', title],
                ["title", title],
                ["summary", truncateMarkdownToWords(story, 69)],
                ["published_at", `${Math.floor(Date.now() / 1000)}`],
                ["t", "straight", "bi", "fantasy"],
            ],
            id: '',
            sig: ''
          };
          event.id = getEventHash(event)
          event = await nostr.signEvent(event)

          await relay.publish(event)

          await relay.close();
    } catch (e) {
        console.log(`${e}`)
        await relay.close();
        await pool.close(relays);
    }

}

export async function listStories() {
    const relay = relayInit(SMUT_RELAY);
    await relay.connect();

    const events = await relay.list([{
        kinds: [STORY_KIND],
        // ids: SMUT_IDS,
        limit: 10,

    }])

    console.log("--- STORIES ---")
    console.log(events);

    await relay.close()
}

export async function getStories(): Promise<Story[]> {

    const relay = relayInit(SMUT_RELAY);


    await relay.connect();
    
    try {
        const storyEvents = await relay.list([{
            kinds: [STORY_KIND],
            ids: SMUT_IDS,
            limit: 10,
        }])

        const stories = storyEvents.map(eventToStory)
        const authorIDs = stories
            .map((story) => story.authorID)
            .filter((id, index, self) => self.indexOf(id) === index);

        const authorEvents = await relay.list([{
            kinds: [0],
            authors: authorIDs,
        }])

        const authorProfiles = authorEvents.map((event)=>{return eventToNostrProfile(event)})

        // Map the authorProfiles to their corresponding stories
        for (let story of stories) {
            const authorProfile = authorProfiles.find(profile => profile.pubkey === story.authorID);
            if (authorProfile) {
                story.authorProfile = authorProfile;
            }
        }

          await relay.close();

          return stories
    } catch (e) {
        console.log(`${e}`)
        await relay.close();
        return [];
    }

}

export async function getStoryByID(id: string): Promise<Story | null>  {

    const relay = relayInit(SMUT_RELAY);
    await relay.connect();
    
    try {
          const storyEvent = await relay.get({
            kinds: [STORY_KIND],
            ids: [id]
          })

          const story = eventToStory(storyEvent);

          const authorEvent = await relay.get({
            kinds: [0],
            authors: [story.authorID]
          });

          story.authorProfile = eventToNostrProfile(authorEvent);

          await relay.close();

          return story;
    } catch (e) {
        console.log(`${e}`)
        await relay.close();

        return null;
    }

}

export async function getInvoiceFromProfile(profile: NostrProfile): Promise<any> { // Return type is any for now, but you should adjust based on the expected response structure.
    if (profile.lud16) {
        // profile.lud16 == <username>@<domainname>
        const [username, domain] = profile.lud16.split('@');

        // Decide the protocol based on whether the domain is an onion domain or not
        const protocol = domain.endsWith(".onion") ? "http" : "https";

        const url = `${protocol}://${domain}/.well-known/lnurlp/${username}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch from ${url}. Status: ${response.statusText}`);
            }
            const data = await response.json();

            console.log(data)

    
            return await getInvoiceFromLud06(data, 5000)

        } catch (error) {
            console.error(`Error fetching invoice from profile: ${error}`);
            throw error;  // Or handle the error as needed
        }
    } else if (profile.lud06) {
        // Step 1: Fetch the initial data using the provided lnurl
        const response = await fetch(profile.lud06);
        if (!response.ok) {
            throw new Error(`Failed to fetch from ${profile.lud06}. Status: ${response.statusText}`);
        }
        const data = await response.json();

        if (data.status === "ERROR") {
            throw new Error(data.reason);
        }

        if (data.tag !== "payRequest") {
            throw new Error("Invalid LNURL type.");
        }

        return await getInvoiceFromLud06(data, 5000)
    }
}

interface LnServiceResponse {
    callback: string; // The URL from LN SERVICE which will accept the pay request parameters
    maxSendable: number; // Max millisatoshi amount LN SERVICE is willing to receive
    minSendable: number; // Min millisatoshi amount LN SERVICE is willing to receive
    metadata: string; // Metadata json presented as a raw string
    tag: "payRequest"; // Type of LNURL
}

// export const function getInvoiceFromZap(response: LnServiceResponse, chosenAmount: number): Promise<string> {

//     response.
// const senderPubkey = // The sender's pubkey
// const recipientPubkey = // The recipient's pubkey
// const callback = // The callback received from the recipients lnurl pay endpoint
// const lnurl = // The recipient's lightning address, encoded as a lnurl
// const sats = 21

// const amount = sats * 1000
// const relays = ['wss://nostr-pub.wellorder.net']
// const event = encodeURI(JSON.stringify(await signEvent({
//   kind: 9734,
//   content: "",
//   pubkey: senderPubkey,
//   created_at: Math.round(Date.now() / 1000),
//   tags: [
//     ["relays", ...relays],
//     ["amount", amount.toString()],
//     ["lnurl", lnurl],
//     ["p", recipientPubkey],
//   ],
// })))

// const {pr: invoice} = await fetchJson(`${callback}?amount=${amount}&nostr=${event}&lnurl=${lnurl}`)
// }

export async function getInvoiceFromLud06(response: LnServiceResponse, chosenAmount: number): Promise<string> {

    // Extract required properties
    const { callback, maxSendable, minSendable, metadata } = response;

    // Step 2: Display the payment dialog (a simplified example)
    // const chosenAmount = prompt(`Choose an amount between ${minSendable} and ${maxSendable} millisatoshi:`);
    // if (!chosenAmount || parseInt(chosenAmount) < minSendable || parseInt(chosenAmount) > maxSendable) {
    //     throw new Error("Invalid chosen amount.");
    // }

    // Step 3: Fetch the actual Lightning invoice
    const invoiceResponse = await fetch(`${callback}?amount=${chosenAmount}`);
    if (!invoiceResponse.ok) {
        throw new Error(`Failed to fetch invoice. Status: ${invoiceResponse.statusText}`);
    }
    const invoiceData = await invoiceResponse.json();

    if (invoiceData.status === "ERROR") {
        throw new Error(invoiceData.reason);
    }

    console.log(invoiceData);

    // // Step 4: Verify metadata hash (simplified example, you should use a proper library for this)
    // const computedHash = sha256(Buffer.from(metadata, "utf8").toString()); // Use an appropriate sha256 function/library here
    // const invoiceHash = invoiceData.pr.h; // Assume 'pr' contains an 'h' property that represents the hash
    // if (computedHash !== invoiceHash) {
    //     throw new Error("Metadata hash mismatch.");
    // }

    // Verify the amount
    // if (chosenAmount !== invoiceData.pr.amount) { // Assume 'pr' contains an 'amount' property
    //     throw new Error("Invoice amount mismatch.");
    // }

    // Step 5: Pay the invoice (depends on your Lightning implementation)
    // For this demo, just returning the invoice to the caller
    return invoiceData.pr;
}

export function eventToStory(event: any): Story {
    const story: Story = {
        authorID: event.pubkey,
        storyID: event.id,
        title: '',
        summary: '',
        tags: [],
        story: event.content
    };

    for (let i = 0; i < event.tags.length; i++) {
        const tag = event.tags[i];

        switch (tag[0]) {
            case 'title':
                story.title = tag[1];
                break;
            case 'summary':
                story.summary = tag[1];
                break;
            case 't':
                story.tags.push(...tag.slice(1));  // Spread to push all tags after the 't' identifier
                break;
            default:
                break;
        }
    }

    return story;
}

export function eventToNostrProfile(event: any, relays: string[] = [SMUT_RELAY]): NostrProfile {

    return {
        pubkey: event.pubkey,
        relays: relays,
        ...(JSON.parse((event as any).content))
    } as NostrProfile
}
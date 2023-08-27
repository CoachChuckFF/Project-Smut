import {SimplePool, getEventHash, getSignature, relayInit} from 'nostr-tools'
import { Story } from '../models/story';

export const STORY_KIND = 30023
export const SMUT_RELAY = (process.env.NEXT_PUBLIC_SMUT_RELAY) as string;
export const SMUT_IDS = [
    '49a79b3ac9adedfb82d2b344a43fc64a12528818a5dce17d2ba57391d87880e1'
]

export interface NostrProfile {
    pubkey?: string;
    relays?: string[];
    banner?: string;
    damus_donation_v2?: number;
    website?: string;
    nip05?: string;
    picture?: string;
    lud16?: string;
    display_name?: string;
    about?: string;
    name?: string;
}

export async function getNostrProfile(nostr: any): Promise<NostrProfile | null> {

    console.log(SMUT_RELAY);

    const relays = Object.keys(await nostr.getRelays()) as string[];
    const pubkey = (await nostr.getPublicKey()) as string ;

    const pool = new SimplePool();

    try {
        const profile = await pool.get(relays, {
            kinds: [0],
            authors: [pubkey]
        })

        await pool.close(relays);

        return {
            pubkey,
            relays,
            ...(JSON.parse((profile as any).content))
        } as NostrProfile
    } catch(e) {
        await pool.close(relays);
        return null;
    }
}

export async function postStory(
    title: string,
    summary: string,
    story: string, 
    nostr: any
) {

    const relay = relayInit(SMUT_RELAY);
    const pubkey = (await nostr.getPublicKey()) as string ;

    await relay.connect();

    try {
        let event = {
            kind: STORY_KIND,
            pubkey,
            created_at: Math.floor(Date.now() / 1000),
            content: story,
            tags: [
                ["title", title],
                ["summary", summary],
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
    }

}

export async function getStories(): Promise<Story[]> {

    const relay = relayInit(SMUT_RELAY);


    await relay.connect();
    
    try {
        const events = await relay.list([{
            kinds: [30023],
            ids: SMUT_IDS
        }])

          console.log("EVENTS");
          console.log(events)

          await relay.close();

          return events.map(eventToStory);
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
          const event = await relay.get({
            kinds: [STORY_KIND],
            ids: [id]
          })

          const story = eventToStory(event);

          await relay.close();

          return story;
    } catch (e) {
        console.log(`${e}`)
        await relay.close();

        return null;
    }

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
import {SimplePool} from 'nostr-tools'

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

export async function getNostrProfile(nostr: any): Promise<NostrProfile> {

    const pool = new SimplePool();
    const relays = Object.keys(await nostr.getRelays()) as string[];
    const pubkey = (await nostr.getPublicKey()) as string ;

    const profile = await pool.get(relays, {
        kinds: [0],
        authors: [pubkey]
    })

    return {
        pubkey,
        relays,
        ...(JSON.parse((profile as any).content))
    } as NostrProfile
}
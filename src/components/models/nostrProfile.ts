export const STORY_KIND = 30023
export const SMUT_RELAY = (process.env.NEXT_PUBLIC_SMUT_RELAY) as string;
export const SMUT_IDS = [
    "cf90411096ed1cd2f02ce89e36bddb68af8d6161d5e1c25d6e5e009ab5d37cbd",
    "fde1cf476a3d008d4108211edbaba7dd5b26010fda410c9e21d7c1f1bcaec77c",
    "703336c7634022663e5825ff9ead36e478f933d944b7e81c57042fd4fea35dcc"
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
    lud06?: string;
    display_name?: string;
    about?: string;
    name?: string;
}
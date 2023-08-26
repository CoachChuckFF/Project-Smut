export interface Story {
    authorID: string;
    storyID: string;
    title: string;
    tags: EroticaTags[];
    story: string;
  }
  
  export enum EroticaTags {
    straight = "straight",
    gay = "gay",
    bi = "bi",
    roleplay = "roleplay",
    vacation = "vacation",
    dp = "dp",
    tp = "tp",
    bdsm = "bdsm",
    swap = "swap",
    hotwife = "hotwife",
    fantasy = "fantasy",
  }
  
  export const TEST_STORIES: Story[] = [
    {
        authorID: '1',
        storyID: '1',
        title: 'Whispers in the Wind',
        tags: [EroticaTags.straight, EroticaTags.bdsm],
        story: 'Evelyn stepped out onto her balcony, the chilly wind brushing past her. The city lights in the distance twinkled, mirroring the stars above. **A familiar scent** filled the air, reminding her of a summer long ago when passions ran high and choices were made in the heat of the moment...',
    },
    {
        authorID: '2',
        storyID: '2',
        title: 'Midnight Serenade',
        tags: [EroticaTags.gay],
        story: 'Leo strolled through the park, the soft strumming of a guitar drawing him closer to its source. Seated on a bench under a lamppost was Carlos, his fingers _dancing gracefully_ over the strings. Their eyes met, and in that moment, the world faded away, replaced only by the silent promise of a night to remember...',
    },
    {
        authorID: '3',
        storyID: '3',
        title: 'Masquerade Ball',
        tags: [EroticaTags.bi, EroticaTags.hotwife, EroticaTags.swap, EroticaTags.vacation, EroticaTags.dp, EroticaTags.tp],
        story: 'The grand ballroom was alive with colors and laughter. Masks of all shapes and sizes disguised the attendees, adding to the allure of the night. Isabelle and Alex danced gracefully, their steps in perfect harmony. When Samuel joined them, the trio shared a dance that none would ever forget, leading to a [night of revelations](#)...',
    },
    {
        authorID: '4',
        storyID: '4',
        title: 'Desert Oasis',
        tags: [EroticaTags.vacation, EroticaTags.straight],
        story: 'Amara found herself in the midst of an endless desert. The warm breeze carried tales of forgotten times. A hidden oasis became the backdrop for a rendezvous with a mysterious traveler, whose tales of distant lands _intertwined_ with their shared night under the stars...',
    },
    {
        authorID: '5',
        storyID: '5',
        title: 'Enchanted Forest',
        tags: [EroticaTags.fantasy, EroticaTags.roleplay, EroticaTags.bi],
        story: 'Lost among towering trees and shimmering streams, Lila met an elf with captivating eyes. Their encounter would be one for the legends of the forest, as they explored the **hidden groves** and ancient tales woven into the very fabric of the woods...',
    },
    {
        authorID: '6',
        storyID: '6',
        title: 'Venetian Affair',
        tags: [EroticaTags.swap, EroticaTags.dp, EroticaTags.tp, EroticaTags.vacation],
        story: 'While in Venice, Clara and James found themselves amidst a game of masks and desires. The canals bore witness to secrets unveiled under moonlight, and as the gondolas passed by, their shadows danced on the [water\'s surface](#), hinting at the mysteries of the night...',
    },
    {
        authorID: '7',
        storyID: '7',
        title: 'Castle Secrets',
        tags: [EroticaTags.bdsm, EroticaTags.roleplay, EroticaTags.fantasy],
        story: 'In an ancient castle perched on a cliff, Lord Adrian introduced Lady Serena to hidden rooms and forbidden pleasures. Their bond deepened, challenging the conventions of their time. As they explored each chamber, they unraveled **old legends** and forged new tales of their own...',
    },
    {
        authorID: '8',
        storyID: '8',
        title: 'Tropical Temptation',
        tags: [EroticaTags.hotwife, EroticaTags.vacation, EroticaTags.gay],
        story: 'On a secluded island, Julian watched from a distance as his wife danced with a charismatic stranger. The rhythm of the tides reflected the surge of emotions and new discoveries. The moonlit beach became the stage for confessions and _unexpected encounters_, forever changing the course of their vacation...'
    }
];
  
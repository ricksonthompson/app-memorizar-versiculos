export interface Verse {
    id: string;
    text: string;
    reference: string;
    version: string;
    month: number;
    year: number;
    week: number;
    color?: string; // Optional color for custom lists
}

export interface CustomList {
    id: string;
    name: string;
    verses: Verse[];
    color?: string; // Optional color for the entire list
}

export interface RecitationData {
    date: string; // Format: DD/MM/YYYY
    dayOfWeek: string; // e.g., "Segunda-feira"
    speaker: string;
    collector: string;
    versesRecited: Verse[];
    totalVerses: number;
    extraVerses: Verse[]; // Verses from custom lists
}
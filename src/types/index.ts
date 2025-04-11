// This file defines TypeScript types and interfaces used throughout the application.

export interface Verse {
    id: string; // Gerado automaticamente
    text: string; // Preenchido pelo usuário
    reference: string; // Preenchido pelo usuário
    version: string; // Preenchido pelo usuário
    month: number; // Preenchido pelo usuário
    year: number; // Preenchido pelo usuário
    week: string; // Preenchido pelo usuário (Ex.: "Semana 1 (12/04)")
}

export interface CustomList {
    id: string; // ID único para cada lista
    name: string;
    color: string;
    verses: Verse[];
}

export interface RecitationData {
    date: string;
    speaker: string;
    versesRecited: Verse[];
    totalVerses: number;
}

export interface MonthlyVerses {
    month: number;
    year: number;
    weeks: {
        weekNumber: number;
        verses: Verse[];
    }[];
}
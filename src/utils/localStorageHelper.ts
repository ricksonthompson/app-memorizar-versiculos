import { Verse, CustomList } from '../types';

const LOCAL_STORAGE_KEY = 'verseMemorizationAppData';

export const saveDataToLocalStorage = (data: { verses: Verse[]; customLists: CustomList[] }) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

export const loadDataFromLocalStorage = () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : { verses: [], customLists: [] };
};

export const clearLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export const isLocalStorageAvailable = () => {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};

export const getStoredVerses = (): Verse[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
        const parsedData = JSON.parse(data);
        return parsedData.verses || [];
    }
    return [];
};

export const saveRecitationData = (recitationData: {
    date: string;
    reciterName: string;
    leaderName: string;
    totalVerses: number;
    verses: Verse[];
}) => {
    const data = loadDataFromLocalStorage();
    const updatedData = {
        ...data,
        recitations: [...(data.recitations || []), recitationData],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
};

export const getCustomLists = (): CustomList[] => {
    const data = loadDataFromLocalStorage();
    return data.customLists || [];
};

export const saveCustomList = (customLists: CustomList[]) => {
    const data = loadDataFromLocalStorage();
    const updatedData = { ...data, customLists };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
};

export const saveVerse = (verse: Verse) => {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{"verses": []}');
    data.verses.push(verse);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

export const getVersesByMonth = (year: number, month: number): Verse[] => {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{"verses": []}');
    return data.verses.filter((verse: Verse) => verse.year === year && verse.month === month);
};

export const saveVersesToLocalStorage = (verses: Verse[]) => {
    localStorage.setItem('verses', JSON.stringify(verses));
};

export const deleteVerse = (id: string) => {
    const data = loadDataFromLocalStorage();
    const updatedVerses = data.verses.filter((verse: Verse) => verse.id !== id);
    const updatedData = { ...data, verses: updatedVerses };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
};

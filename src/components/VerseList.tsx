import React, { useState } from 'react';
import { Verse } from '../types';
import { deleteVerse } from '../utils/localStorageHelper';

interface VerseListProps {
    verses: Verse[];
    setVerses: React.Dispatch<React.SetStateAction<Verse[]>>;
    disableDelete?: boolean;
    renderExtra?: (verse: Verse) => React.ReactNode;
}

const VerseList: React.FC<VerseListProps> = ({ verses, setVerses, disableDelete = false, renderExtra }) => {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setLoadingId(id);
        setTimeout(() => {
            deleteVerse(id);
            const updatedVerses = verses.filter((verse) => verse.id !== id);
            setVerses(updatedVerses);
            setLoadingId(null);
        }, 1000);
    };

    const moveVerse = (index: number, direction: 'up' | 'down') => {
        const newVerses = [...verses];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newVerses.length) {
            [newVerses[index], newVerses[targetIndex]] = [newVerses[targetIndex], newVerses[index]];
            setVerses(newVerses);
        }
    };

    return (
        <div>
            {verses.map((verse, index) => (
                <div
                    key={verse.id}
                    className="mb-4 p-4 border rounded shadow-sm bg-white flex items-center justify-between"
                >
                    <div>
                        <h2 className="text-lg font-bold mb-2 flex items-center space-x-2">
                            <span>{verse.reference}</span>
                            <span className="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                {verse.version}
                            </span>
                        </h2>
                        <p className="text-gray-700" style={{ fontFamily: 'Avenir, sans-serif' }}>{verse.text}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* {renderExtra && renderExtra(verse)} */}

                        <div className="flex flex-col space-y-1">
                            <button
                                onClick={() => moveVerse(index, 'up')}
                                className="text-white hover:underline border rounded"
                                disabled={index === 0}
                            >
                                ↑
                            </button>
                            <button
                                onClick={() => moveVerse(index, 'down')}
                                className="text-white hover:underline border rounded"
                                disabled={index === verses.length - 1}
                            >
                                ↓ 
                            </button>
                        </div>

                        {!disableDelete && (
                            <button
                                onClick={() => handleDelete(verse.id)}
                                className={`px-4 py-2 rounded flex items-center justify-center space-x-2 ${
                                    loadingId === verse.id
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                                disabled={loadingId === verse.id}
                            >
                                {loadingId === verse.id ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VerseList;
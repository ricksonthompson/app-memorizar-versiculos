import React, { useState } from 'react';
import { Verse } from '../types';
import { deleteVerse } from '../utils/localStorageHelper';

interface VerseListProps {
    verses: Verse[];
    setVerses: React.Dispatch<React.SetStateAction<Verse[]>>; // Para atualizar a lista de versículos
    disableDelete?: boolean; // Prop para desabilitar o botão de excluir
    renderExtra?: (verse: Verse) => React.ReactNode; // Prop para renderizar elementos extras
}

const VerseList: React.FC<VerseListProps> = ({ verses, setVerses, disableDelete = false, renderExtra }) => {
    const [loadingId, setLoadingId] = useState<string | null>(null); // Estado para controlar o loading por ID

    // Função para excluir um versículo
    const handleDelete = (id: string) => {
        setLoadingId(id); // Ativa o loading para o versículo específico
        setTimeout(() => {
            deleteVerse(id); // Remove o versículo do localStorage
            const updatedVerses = verses.filter((verse) => verse.id !== id);
            setVerses(updatedVerses); // Atualiza o estado
            setLoadingId(null); // Desativa o loading
        }, 1000); // Simula um atraso para o loading
    };

    return (
        <div>
            {verses.map((verse) => (
                <div
                    key={verse.id}
                    className="mb-4 p-4 border rounded shadow-sm bg-white flex items-center justify-between"
                >
                    <div>
                        {/* Título do versículo com a versão como tag */}
                        <h2 className="text-lg font-bold mb-2 flex items-center space-x-2">
                            <span>{verse.reference}</span>
                            <span className="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                {verse.version}
                            </span>
                        </h2>

                        {/* Texto do versículo */}
                        <p className="text-gray-700">{verse.text}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Renderiza elementos extras, se fornecido */}
                        {renderExtra && renderExtra(verse)}

                        {/* Botão de excluir (controlado pela prop disableDelete) */}
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
                                    <span>Excluir</span>
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
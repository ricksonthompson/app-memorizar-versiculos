import React, { useState } from 'react';
import SharedButton from './SharedButton';
import VerseList from './VerseList'; // Importa o componente VerseList
import { Verse } from '../types'; // Certifique-se de que o tipo Verse está definido corretamente

const Recitation = () => {
    const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
    const [reciterName, setReciterName] = useState('');
    const [collectorName, setCollectorName] = useState('');
    const [verses, setVerses] = useState<Verse[]>([]); // Lista de versículos

    const handleCheckboxChange = (verseId: string) => {
        setSelectedVerses((prevSelected) =>
            prevSelected.includes(verseId)
                ? prevSelected.filter((id) => id !== verseId)
                : [...prevSelected, verseId]
        );
    };

    const handleSubmit = () => {
        const totalVerses = selectedVerses.length;
        const message = `Versículos CEB\n\nNo dia ${new Date().toLocaleDateString()}, ${new Date().toLocaleString('pt-BR', { weekday: 'long' })}, confirmo que ${collectorName} recitou o total de ${totalVerses} versículos.\n\nSendo:\nMês\n- Semana X: ${selectedVerses.join(', ')}\n\nVersos Extras (Da lista personalizada):\n${selectedVerses.join(', ')}...`;
        
        // Share via WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Recitar Versículos</h1>
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Nome do Recitador" 
                    value={reciterName} 
                    onChange={(e) => setReciterName(e.target.value)} 
                    className="border p-2 rounded w-full"
                />
                <input 
                    type="text" 
                    placeholder="Nome do Coletor" 
                    value={collectorName} 
                    onChange={(e) => setCollectorName(e.target.value)} 
                    className="border p-2 rounded w-full mt-2"
                />
            </div>

            {/* Listagem dos versículos com checkboxes */}
            <VerseList
                verses={verses}
                setVerses={setVerses}
                disableDelete={true} // Desabilita o botão de excluir
                renderExtra={(verse) => (
                    <input
                        type="checkbox"
                        checked={selectedVerses.includes(verse.id)}
                        onChange={() => handleCheckboxChange(verse.id)}
                        className="ml-2"
                    />
                )}
            />

            <SharedButton onClick={handleSubmit} label="Concluir Coleta" />
        </div>
    );
};

export default Recitation;
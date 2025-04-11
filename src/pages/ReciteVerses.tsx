import React, { useState } from "react";
import { getCustomLists, getVersesByMonth } from "../utils/localStorageHelper";
import { Verse } from "../types";
import VerseList from "../components/VerseList";

const ReciteVerses: React.FC = () => {
  const [customLists] = useState(getCustomLists());
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [monthlyVerses, setMonthlyVerses] = useState<Verse[]>([]);
  const [selectedVerses, setSelectedVerses] = useState<Verse[]>([]);

  const handleSelectList = (listName: string) => {
    setSelectedLists((prev) =>
      prev.includes(listName)
        ? prev.filter((name) => name !== listName)
        : [...prev, listName]
    );
  };

  const handleLoadMonthlyVerses = () => {
    if (month !== null) {
      const verses = getVersesByMonth(year, month);
      setMonthlyVerses(verses);
    }
  };

  const handleAddToRecitation = (verses: Verse[]) => {
    setSelectedVerses((prev) => [...prev, ...verses]);
  };

  const handleCheckboxChange = (verseId: string) => {
    setSelectedVerses((prev) =>
      prev.some((verse) => verse.id === verseId)
        ? prev.filter((verse) => verse.id !== verseId)
        : [...prev, monthlyVerses.find((verse) => verse.id === verseId)!]
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recitar Versículos</h1>

      {/* Adicionar Listas Personalizadas */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">
          Adicionar Listas Personalizadas
        </h2>
        <ul className="mb-4">
          {customLists.map((list) => (
            <li key={list.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedLists.includes(list.name)}
                onChange={() => handleSelectList(list.name)}
              />
              <span>{list.name}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            const selected = customLists
              .filter((list) => selectedLists.includes(list.name))
              .flatMap((list) => list.verses);
            handleAddToRecitation(selected);
          }}
          className="bg-green-500 text-white p-2 rounded"
        >
          Adicionar à Recitação
        </button>
      </div>

      {/* Adicionar Listas por Mês e Ano */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">
          Adicionar Listas por Mês e Ano
        </h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border p-2 w-24"
            placeholder="Ano"
          />
          <select
            value={month || ""}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border p-2"
          >
            <option value="">Selecione o Mês</option>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <button
            onClick={handleLoadMonthlyVerses}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Carregar Versículos
          </button>
        </div>
        <VerseList
          verses={monthlyVerses}
          setVerses={setMonthlyVerses}
          disableDelete={true}
          renderExtra={(verse) => (
            <input
              type="checkbox"
              checked={selectedVerses.some((v) => v.id === verse.id)}
              onChange={() => handleCheckboxChange(verse.id)}
              className="ml-2"
            />
          )}
        />
      </div>

      {/* Exibir Versículos Selecionados */}
      <div>
        <h2 className="text-lg font-bold mb-2">Versículos para Recitação</h2>
        <VerseList
          verses={selectedVerses}
          setVerses={setSelectedVerses}
          disableDelete={true}
        />
      </div>
    </div>
  );
};

export default ReciteVerses;
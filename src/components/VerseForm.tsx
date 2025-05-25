import React, { useState } from "react";

const VerseForm = ({
  onAddVerse,
}: {
  onAddVerse: (verse: {
    text: string;
    reference: string;
    version: string;
    month: string;
    year: string;
    week: string;
  }) => void;
}) => {
  const [verseText, setVerseText] = useState("");
  const [reference, setReference] = useState("");
  const [version, setVersion] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [week, setWeek] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newVerse = {
      text: verseText,
      reference,
      version,
      month,
      year,
      week,
    };
    onAddVerse(newVerse);
    setVerseText("");
    setReference("");
    setVersion("");
    setMonth("");
    setYear("");
    setWeek("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Adicionar Verso</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Versículo
        </label>
        <textarea
          value={verseText}
          onChange={(e) => setVerseText(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Referência
        </label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Versão
        </label>
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Mês</label>
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Ano</label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Semana
        </label>
        <input
          type="text"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Adicionar Versículo
      </button>
    </form>
  );
};

export default VerseForm;

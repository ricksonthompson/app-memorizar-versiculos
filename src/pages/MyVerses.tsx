import React, { useEffect, useState } from "react";
import { getVersesByMonth, saveVerse } from "../utils/localStorageHelper";
import VerseList from "../components/VerseList";
import { Verse } from "../types";

const MyVerses: React.FC = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-indexado
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [newVerseText, setNewVerseText] = useState("");
  const [newBook, setNewBook] = useState("");
  const [newChapter, setNewChapter] = useState("");
  const [newVerseNumber, setNewVerseNumber] = useState("");
  const [newVersion, setNewVersion] = useState("");
  const [newWeek, setNewWeek] = useState("");
  const [isManualInputVisible, setIsManualInputVisible] = useState(false);
  const [isImportInputVisible, setIsImportInputVisible] = useState(false); // Novo estado para controlar visibilidade
  const [importedVerse, setImportedVerse] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading

  useEffect(() => {
    const fetchedVerses = getVersesByMonth(selectedYear, selectedMonth);
    setVerses(fetchedVerses);
  }, [selectedMonth, selectedYear]);

  const handleAddVerse = () => {
    if (
      !newVerseText ||
      !newBook ||
      !newChapter ||
      !newVerseNumber ||
      !newVersion ||
      !newWeek
    )
      return;

    setIsLoading(true); // Ativa o loading

    const reference = `${newBook} ${newChapter}:${newVerseNumber}`; // Concatena o livro, capítulo e versículo

    const verse: Verse = {
      id: Date.now().toString(),
      text: newVerseText,
      reference,
      version: newVersion,
      month: selectedMonth,
      year: selectedYear,
      week: newWeek,
    };

    setTimeout(() => {
      saveVerse(verse);
      setVerses((prev) => [...prev, verse]);
      setNewVerseText("");
      setNewBook("");
      setNewChapter("");
      setNewVerseNumber("");
      setNewVersion("");
      setNewWeek("");
      setIsManualInputVisible(false); // Oculta os inputs após salvar
      setIsLoading(false); // Desativa o loading
    }, 1000); // Simula um atraso para o loading
  };

  const handleImportVerse = () => {
    if (!importedVerse) return;

    setIsLoading(true); // Ativa o loading

    // Quebra o texto colado em linhas
    const lines = importedVerse.split("\n").map((line) => line.trim());

    let text = "";
    let reference = "";

    // Itera pelas linhas para encontrar o texto e a referência
    for (const line of lines) {
      // Remove caracteres desnecessários (como aspas e símbolos invisíveis), mas preserva acentos e caracteres Unicode
      const sanitizedLine = line.replace(
        /[\u200E\u200F\u202A-\u202E“”"']/g,
        ""
      );

      // Detecta a linha com a referência (números:números)
      if (/\d+:\d+/.test(sanitizedLine)) {
        reference = sanitizedLine; // Define a referência
        break; // Para o loop ao encontrar a referência
      }

      // Se ainda não encontrou a referência, acumula no texto
      text += (text ? " " : "") + sanitizedLine;
    }

    // Valida se encontrou texto e referência
    if (text && reference) {
      const parts = reference.split(" ");
      const book = parts[0];
      const chapterAndVerse = parts[1];
      const version = parts[2] || "NTLH"; // Usa a versão encontrada ou uma padrão

      const verse: Verse = {
        id: Date.now().toString(),
        text,
        reference: `${book} ${chapterAndVerse} ${version}`.trim(), // Garante que a versão não seja duplicada
        version,
        month: selectedMonth,
        year: selectedYear,
        week: newWeek || "1", // Define uma semana padrão se não preenchida
      };

      if (verse.reference.split(" ").includes(version)) {
        verse.reference = verse.reference.split(version)[0].trim();
      }

      setTimeout(() => {
        saveVerse(verse);
        setVerses((prev) => [...prev, verse]);
        setImportedVerse("");
        setIsImportInputVisible(false); // Oculta o campo de importação após salvar
        setIsLoading(false); // Desativa o loading
        alert("Versículo importado com sucesso!");
      }, 1000); // Simula um atraso para o loading
    } else {
      setIsLoading(false); // Desativa o loading
      alert(
        "Conteúdo inválido. Certifique-se de colar o texto no formato correto."
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Versículos</h1>
      <div className="mb-4">
        <label htmlFor="month" className="mr-2">
          Mês:
        </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded p-2"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <label htmlFor="year" className="ml-4 mr-2">
          Ano:
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded p-2"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <option key={index} value={new Date().getFullYear() - index}>
              {new Date().getFullYear() - index}
            </option>
          ))}
        </select>
      </div>

      {/* Botões de Ação */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setIsManualInputVisible(!isManualInputVisible)}
          className="bg-indigo-500 text-white p-2 rounded flex items-center space-x-2 hover:bg-indigo-600"
        >
          <span>Inserir</span>
          <span className="text-xl">+</span>
        </button>
        <button
          onClick={() => setIsImportInputVisible(!isImportInputVisible)}
          className="bg-blue-500 text-white p-2 rounded flex items-center space-x-2 hover:bg-blue-600"
        >
          <img
            src="https://www.bible.com/assets/icons/bible/200/en.png"
            alt="Bible App"
            className="w-6 h-6"
          />
          <span>Importar do App da Bible</span>
        </button>
      </div>

      {/* Inputs de Cadastro Manual */}
      {isManualInputVisible && (
        <div className="mb-6 space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Livro"
              value={newBook}
              onChange={(e) => setNewBook(e.target.value)}
              className="border p-2 flex-1"
            />
            <input
              type="number"
              placeholder="Capítulo"
              value={newChapter}
              onChange={(e) => setNewChapter(e.target.value)}
              className="border p-2 w-24"
            />
            <input
              type="number"
              placeholder="Versículo"
              value={newVerseNumber}
              onChange={(e) => setNewVerseNumber(e.target.value)}
              className="border p-2 w-24"
            />
          </div>
          <textarea
            placeholder="Texto do Versículo"
            value={newVerseText}
            onChange={(e) => setNewVerseText(e.target.value)}
            className="border p-2 w-full h-24"
          />
          <select
            value={newVersion}
            onChange={(e) => setNewVersion(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Selecione a Versão</option>
            {["NTLH", "ARA", "NVI", "NVT", "ARC"].map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Semana (Ex.: Semana 1 (12/04))"
            value={newWeek}
            onChange={(e) => setNewWeek(e.target.value)}
            className="border p-2 w-full"
          />
          <button
            onClick={handleAddVerse}
            className={`bg-green-500 text-white p-2 rounded mt-2 flex items-center justify-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
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
              "Salvar Versículo"
            )}
          </button>
        </div>
      )}

      {/* Input para Importar Versículo */}
      {isImportInputVisible && (
        <div className="mb-6">
          <textarea
            placeholder="Cole aqui o versículo copiado do App da Bible"
            value={importedVerse}
            onChange={(e) => setImportedVerse(e.target.value)}
            className="border p-2 w-full h-24"
          />
          <button
            onClick={handleImportVerse}
            className={`bg-blue-500 text-white p-2 rounded mt-2 flex items-center justify-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
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
              "Importar Versículo"
            )}
          </button>
        </div>
      )}

      <VerseList verses={verses} setVerses={setVerses} />
    </div>
  );
};

export default MyVerses;

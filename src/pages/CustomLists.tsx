import React, { useState } from "react";
import VerseList from "../components/VerseList";
import { saveCustomList, getCustomLists } from "../utils/localStorageHelper";
import { CustomList, Verse } from "../types";

const CustomLists: React.FC = () => {
  const [customLists, setCustomLists] = useState<CustomList[]>(
    getCustomLists()
  );
  const [expandedLists, setExpandedLists] = useState<string[]>([]);
  const [newListName, setNewListName] = useState("");
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [manualInputsVisible, setManualInputsVisible] = useState<string | null>(
    null
  );
  const [importInputsVisible, setImportInputsVisible] = useState<string | null>(
    null
  );
  const [newVerse, setNewVerse] = useState({
    text: "",
    reference: "",
    version: "NTLH",
  });
  const [importedVerse, setImportedVerse] = useState("");

  const toggleExpandList = (listId: string) => {
    setExpandedLists((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    );
  };

  // Função para salvar uma nova lista personalizada
  const handleSaveList = () => {
    if (!newListName) return;

    const newList: CustomList = {
      id: Date.now().toString(), // Gera um ID único
      name: newListName,
      verses: [],
      color: "#FFFFFF", // Define uma cor padrão ou permita que o usuário escolha
    };

    const updatedLists = [newList, ...customLists];
    saveCustomList(updatedLists); // Salva no localStorage
    setCustomLists(updatedLists); // Atualiza o estado
    setNewListName("");
    setIsCreatingNewList(false);
  };

  // Função para adicionar um versículo manualmente
  const handleAddVerseToList = (listId: string) => {
    const verse: Verse = {
      id: Date.now().toString(),
      text: newVerse.text,
      reference: newVerse.reference,
      version: newVerse.version,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      week: "Sem Semana", // Valor default
    };

    const updatedLists = customLists.map((list) => {
      if (list.id === listId) {
        return { ...list, verses: [...list.verses, verse] };
      }
      return list;
    });

    saveCustomList(updatedLists);
    setCustomLists(updatedLists);
    setNewVerse({ text: "", reference: "", version: "NTLH" }); // Limpa os inputs
    setManualInputsVisible(null); // Oculta os inputs
  };

  const handleImportVerseToList = (listId: string, listName: string) => {
    if (!importedVerse || importedVerse.trim() === "") {
      alert("Por favor, cole um versículo válido.");
      return;
    }

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

    if (text && reference) {
      const parts = reference.split(" ");
      const book = parts[0];
      const chapterAndVerse = parts[1];
      const version = parts[2] || "NTLH";

      const verse: Verse = {
        id: Date.now().toString(),
        text,
        reference: `${book} ${chapterAndVerse} ${version}`.trim(), // Garante que a versão não seja duplicada
        version,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        week: listName, // Valor default
      };

      // Remove a versão duplicada na referência, se necessário
      if (verse.reference.split(" ").includes(verse.version)) {
        verse.reference = verse.reference.split(verse.version)[0].trim();
      }

      // Atualiza a lista correspondente
      const updatedLists = customLists.map((list) => {
        if (list.id === listId) {
          return { ...list, verses: [...list.verses, verse] };
        }
        return list;
      });

      saveCustomList(updatedLists); // Salva no localStorage
      setCustomLists(updatedLists); // Atualiza o estado
      setImportedVerse(""); // Limpa o campo de importação
      setImportInputsVisible(null); // Oculta os inputs
    } else {
      alert(
        "Não foi possível identificar o texto ou a referência do versículo."
      );
    }
  };

  const handleDeleteList = (listId: string) => {
    const updatedLists = customLists.filter((list) => list.id !== listId);
    saveCustomList(updatedLists); // Atualiza o localStorage
    setCustomLists(updatedLists); // Atualiza o estado
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Listas Personalizadas</h1>
      <div className="flex items-center border border-blue-500 rounded p-4 mb-4 bg-transparent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
        <p className="text-gray-700">
          Uma lista personalizada é um bloco de versículos para facilitar a
          memorização.
          <br /> Exemplo: Salmos 119:1-10, Salmos 119:11-20.
        </p>
      </div>

      {/* Botão para criar nova lista */}
      {!isCreatingNewList && (
        <button
          onClick={() => setIsCreatingNewList(true)}
          className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 mb-4"
        >
          Criar Nova Lista
        </button>
      )}

      {/* Input para o nome da nova lista */}
      {isCreatingNewList && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Nome da Lista"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handleSaveList}
            className="bg-green-500 text-white p-2 rounded"
          >
            Salvar Lista
          </button>
        </div>
      )}

      {/* Listagem das listas personalizadas */}
      <div className="mt-8">
        {customLists.length === 0 ? (
          <p className="text-gray-500">Nenhuma lista personalizada criada.</p>
        ) : (
          <ul className="space-y-4">
            {customLists.map((list) => (
              <li
                key={list.id}
                className="p-4 border rounded shadow-sm bg-white"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">{list.name}</h3>
                  <div className="flex items-center space-x-2">
                    {/* Botão de expandir/recolher */}
                    <button
                      onClick={() => toggleExpandList(list.id)}
                      className="text-white hover:text-gray-700"
                    >
                      {expandedLists.includes(list.id) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Botão de excluir lista */}
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="text-white hover:text-gray-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {expandedLists.includes(list.id) && (
                  <>
                    {/* Botões para adicionar versículos */}
                    <div className="flex space-x-4 mb-4">
                      <button
                        onClick={() =>
                          setManualInputsVisible(
                            manualInputsVisible === list.id ? null : list.id
                          )
                        }
                        className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
                      >
                        Inserir +
                      </button>
                      <button
                        onClick={() =>
                          setImportInputsVisible(
                            importInputsVisible === list.id ? null : list.id
                          )
                        }
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex"
                      >
                        <img
                          src="https://www.bible.com/assets/icons/bible/200/en.png"
                          alt="Bible App"
                          className="w-6 h-6"
                        />
                        <span>Importar</span>
                      </button>
                    </div>

                    {/* Inputs para adicionar versículo manualmente */}
                    {manualInputsVisible === list.id && (
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Texto do Versículo"
                          value={newVerse.text}
                          onChange={(e) =>
                            setNewVerse((prev) => ({
                              ...prev,
                              text: e.target.value,
                            }))
                          }
                          className="border p-2 w-full mb-2"
                        />
                        <input
                          type="text"
                          placeholder="Referência (Ex.: João 3:16)"
                          value={newVerse.reference}
                          onChange={(e) =>
                            setNewVerse((prev) => ({
                              ...prev,
                              reference: e.target.value,
                            }))
                          }
                          className="border p-2 w-full mb-2"
                        />
                        <select
                          value={newVerse.version}
                          onChange={(e) =>
                            setNewVerse((prev) => ({
                              ...prev,
                              version: e.target.value,
                            }))
                          }
                          className="border p-2 w-full mb-2"
                        >
                          <option value="NTLH">NTLH</option>
                          <option value="ARA">ARA</option>
                          <option value="NVI">NVI</option>
                          <option value="NVT">NVT</option>
                          <option value="ARC">ARC</option>
                        </select>
                        <button
                          onClick={() => handleAddVerseToList(list.id)}
                          className="bg-green-500 text-white p-2 rounded"
                        >
                          Salvar Versículo
                        </button>
                      </div>
                    )}

                    {/* Inputs para importar versículo */}
                    {importInputsVisible === list.id && (
                      <div className="mb-4">
                        <textarea
                          placeholder="Cole aqui o versículo copiado do App da Bible"
                          value={importedVerse}
                          onChange={(e) => setImportedVerse(e.target.value)}
                          className="border p-2 w-full h-24 mb-2"
                        />
                        <button
                          onClick={() =>
                            handleImportVerseToList(list.id, list.name)
                          }
                          className="bg-blue-500 text-white p-2 rounded"
                        >
                          Importar Versículo
                        </button>
                      </div>
                    )}

                    <VerseList
                      verses={list.verses}
                      setVerses={(updatedVerses) => {
                        const updatedLists = customLists.map((l) =>
                          l.id === list.id
                            ? {
                                ...l,
                                verses: Array.isArray(updatedVerses)
                                  ? updatedVerses
                                  : updatedVerses([]), // Garante que updatedVerses seja um array
                              }
                            : l
                        );
                        saveCustomList(updatedLists);
                        setCustomLists(updatedLists);
                      }}
                    />
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomLists;

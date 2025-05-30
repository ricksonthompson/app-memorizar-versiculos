import React, { useState, useEffect } from "react";
import VerseList from "../components/VerseList";
import {
  saveCustomList,
  getCustomLists,
  getStoredVerses,
} from "../utils/localStorageHelper";
import { CustomList, Verse } from "../types";
import { v4 as uuidv4 } from "uuid";

// Hook personalizado para gerenciar a lógica do componente
const useCustomLists = () => {
  // Estados
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  const [expandedLists, setExpandedLists] = useState<Record<string, boolean>>(
    {}
  );
  const [editableTotals, setEditableTotals] = useState<Record<string, string>>(
    {}
  );
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);

  // Estados para adição de versículos
  const [manualInputsVisible, setManualInputsVisible] = useState<
    Record<string, boolean>
  >({});
  const [importInputsVisible, setImportInputsVisible] = useState<
    Record<string, boolean>
  >({});
  const [newVerse, setNewVerse] = useState<{
    text: string;
    reference: string;
    version: string;
  }>({
    text: "",
    reference: "",
    version: "",
  });
  const [importedVerse, setImportedVerse] = useState<string>("");

  // Carregar listas do localStorage
  useEffect(() => {
    const fetchedLists = getCustomLists();
    setCustomLists(fetchedLists);

    // Inicializar estados para cada lista
    const initialExpandedState: Record<string, boolean> = {};
    const initialTotals: Record<string, string> = {};

    fetchedLists.forEach((list) => {
      initialExpandedState[list.id] = false;
      initialTotals[list.id] = list.verses.length.toString();
    });

    setExpandedLists(initialExpandedState);
    setEditableTotals(initialTotals);
  }, []);

  // Funções de gerenciamento de listas
  const handleSaveList = () => {
    if (newListName.trim() === "") return;

    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const newList: CustomList = {
      id: uuidv4(),
      name: newListName,
      color: randomColor,
      verses: [],
    };

    const updatedLists = [...customLists, newList];
    setCustomLists(updatedLists);
    saveCustomList(updatedLists);

    // Resetar estados
    setNewListName("");
    setIsCreatingNewList(false);

    // Inicializar estados para a nova lista
    setExpandedLists((prev) => ({
      ...prev,
      [newList.id]: false,
    }));
    setEditableTotals((prev) => ({
      ...prev,
      [newList.id]: "0",
    }));
  };

  const handleEditListName = (listId: string, newName: string) => {
    if (newName.trim() === "") return;

    const updatedLists = customLists.map((list) =>
      list.id === listId ? { ...list, name: newName } : list
    );

    setCustomLists(updatedLists);
    saveCustomList(updatedLists);
    setEditingListId(null);
  };

  const handleDeleteList = (listId: string) => {
    const updatedLists = customLists.filter((list) => list.id !== listId);
    setCustomLists(updatedLists);
    saveCustomList(updatedLists);
  };

  const toggleExpandList = (listId: string) => {
    setExpandedLists((prev) => ({
      ...prev,
      [listId]: !prev[listId],
    }));
  };

  // Funções para gerenciamento de versículos
  const handleAddVerseToList = (listId: string) => {
    if (
      newVerse.text.trim() === "" ||
      newVerse.reference.trim() === "" ||
      newVerse.version.trim() === ""
    )
      return;

    const updatedLists = customLists.map((list) => {
      if (list.id === listId) {
        const newVerseWithId: Verse = {
          id: uuidv4(),
          text: newVerse.text,
          reference: newVerse.reference,
          version: newVerse.version,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          week: `Semana ${Math.ceil(
            new Date().getDate() / 7
          )} (${new Date().toLocaleDateString()})`,
        };

        return {
          ...list,
          verses: [...list.verses, newVerseWithId],
        };
      }
      return list;
    });

    setCustomLists(updatedLists);
    saveCustomList(updatedLists);

    // Atualizar o total editável
    setEditableTotals((prev) => {
      const list = updatedLists.find((l) => l.id === listId);
      return {
        ...prev,
        [listId]: list ? list.verses.length.toString() : prev[listId],
      };
    });

    // Resetar o formulário
    setNewVerse({
      text: "",
      reference: "",
      version: "",
    });
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
        /[\u200E\u200F\u202A-\u202E"""']/g,
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
      setImportInputsVisible({}); // Oculta os inputs
    } else {
      alert(
        "Não foi possível identificar o texto ou a referência do versículo."
      );
    }
  };

  const handleTotalChange = (listId: string, value: string) => {
    setEditableTotals((prev) => ({
      ...prev,
      [listId]: value,
    }));
  };

  return {
    // Estados
    customLists,
    expandedLists,
    editableTotals,
    editingListId,
    newListName,
    isCreatingNewList,
    manualInputsVisible,
    importInputsVisible,
    newVerse,
    importedVerse,

    // Setters
    setExpandedLists,
    setEditableTotals,
    setEditingListId,
    setNewListName,
    setIsCreatingNewList,
    setManualInputsVisible,
    setImportInputsVisible,
    setNewVerse,
    setImportedVerse,
    setCustomLists,

    // Handlers
    handleSaveList,
    handleAddVerseToList,
    handleImportVerseToList,
    handleDeleteList,
    handleEditListName,
    handleTotalChange,
    toggleExpandList,
  };
};

// Componente para o painel informativo
const InfoPanel: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
      <h2 className="text-lg font-semibold text-blue-700 mb-2">
        Como funciona?
      </h2>
      <ul className="list-disc pl-5 text-sm text-blue-600 space-y-1">
        <li>
          Crie listas para organizar versículos por temas, livros ou categorias
        </li>
        <li>Adicione versículos diretamente ou importe-os da sua biblioteca</li>
        <li>
          Você pode reorganizar a ordem dos versículos dentro de cada lista
        </li>
        <li>
          As listas são salvas automaticamente e ficam disponíveis offline
        </li>
      </ul>
    </div>
  );
};

// Componente para o formulário de nova lista
interface NewListFormProps {
  newListName: string;
  setNewListName: React.Dispatch<React.SetStateAction<string>>;
  handleSaveList: () => void;
}

const NewListForm: React.FC<NewListFormProps> = ({
  newListName,
  setNewListName,
  handleSaveList,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveList();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-100 rounded">
      <div className="flex flex-col space-y-2">
        <label htmlFor="newListName" className="text-sm font-medium">
          Nome da Nova Lista
        </label>
        <input
          id="newListName"
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="p-2 border rounded"
          placeholder="Digite o nome da lista"
          required
        />
      </div>
      <div className="flex space-x-2 mt-2">
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={() => setNewListName("")}
          className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
        >
          Limpar
        </button>
      </div>
    </form>
  );
};

// Componente para o cabeçalho de cada lista
interface ListHeaderProps {
  list: CustomList;
  isExpanded: boolean;
  editingListId: string | null;
  toggleExpandList: (listId: string) => void;
  setEditingListId: (id: string | null) => void;
  handleEditListName: (listId: string, newName: string) => void;
  handleDeleteList: (listId: string) => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({
  list,
  isExpanded,
  editingListId,
  toggleExpandList,
  setEditingListId,
  handleEditListName,
  handleDeleteList,
}) => {
  const [editName, setEditName] = useState(list.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEditListName(list.id, editName);
  };

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: list.color }}
        />

        {editingListId === list.id ? (
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border rounded p-1 text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="bg-green-500 text-white text-xs p-1 rounded hover:bg-green-600"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => setEditingListId(null)}
              className="bg-gray-300 text-gray-700 text-xs p-1 rounded hover:bg-gray-400"
            >
              ×
            </button>
          </form>
        ) : (
          <>
            <h3 className="font-semibold">{list.name}</h3>
            <button
              onClick={() => setEditingListId(list.id)}
              className="text-xs bg-gray-200 rounded px-2 py-1 mr-5 hover:bg-gray-300"
              title="Editar nome"
            >
              ✎
            </button>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
          {getTotalVerses(list)}
        </span>

        <button
          onClick={() => toggleExpandList(list.id)}
          className="text-white hover:underline px-2 py-1 rounded hover:bg-green-400"
        >
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          )}
        </button>

        <button
          onClick={() => handleDeleteList(list.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          X
        </button>
      </div>
    </div>
  );
};

// Componente para exibir cada item da lista
interface ListItemProps {
  list: CustomList;
  expandedLists: Record<string, boolean>;
  editableTotals: Record<string, string>;
  editingListId: string | null;
  manualInputsVisible: Record<string, boolean>;
  importInputsVisible: Record<string, boolean>;
  newVerse: { text: string; reference: string; version: string };
  importedVerse: string;
  setEditingListId: (id: string | null) => void;
  setCustomLists: React.Dispatch<React.SetStateAction<CustomList[]>>;
  setManualInputsVisible: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  setImportInputsVisible: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  setNewVerse: React.Dispatch<
    React.SetStateAction<{ text: string; reference: string; version: string }>
  >;
  setImportedVerse: React.Dispatch<React.SetStateAction<string>>;
  handleTotalChange: (listId: string, value: string) => void;
  handleEditListName: (listId: string, newName: string) => void;
  handleDeleteList: (listId: string) => void;
  toggleExpandList: (listId: string) => void;
  handleAddVerseToList: (listId: string) => void;
  handleImportVerseToList: (listId: string, listName: string) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  list,
  expandedLists,
  editableTotals,
  editingListId,
  manualInputsVisible,
  importInputsVisible,
  newVerse,
  importedVerse,
  setEditingListId,
  setCustomLists,
  setManualInputsVisible,
  setImportInputsVisible,
  setNewVerse,
  setImportedVerse,
  handleTotalChange,
  handleEditListName,
  handleDeleteList,
  toggleExpandList,
  handleAddVerseToList,
  handleImportVerseToList,
}) => {
  const isExpanded = expandedLists[list.id] || false;
  const allVerses = getStoredVerses();

  const toggleManualInputs = () => {
    setManualInputsVisible((prev) => ({
      ...prev,
      [list.id]: !prev[list.id],
    }));
  };

  const toggleImportInputs = () => {
    setImportInputsVisible((prev) => ({
      ...prev,
      [list.id]: !prev[list.id],
    }));
  };

  const handleVerseListChange = (
    newVerses: Verse[] | ((prevState: Verse[]) => Verse[])
  ) => {
    setCustomLists((prevLists) =>
      prevLists.map((l) =>
        l.id === list.id
          ? {
              ...l,
              verses:
                typeof newVerses === "function"
                  ? newVerses(l.verses)
                  : newVerses,
            }
          : l
      )
    );
  };

  return (
    <li className="border rounded shadow-sm overflow-hidden">
      <div
        className="bg-gray-100"
        style={{ borderLeft: `4px solid ${list.color}` }}
      >
        <ListHeader
          list={list}
          isExpanded={isExpanded}
          editingListId={editingListId}
          toggleExpandList={toggleExpandList}
          setEditingListId={setEditingListId}
          handleEditListName={handleEditListName}
          handleDeleteList={handleDeleteList}
        />
      </div>

      {isExpanded && (
        <div className="p-4">
          {/* Opções para adicionar versículos à lista */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={toggleManualInputs}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {manualInputsVisible[list.id] ? "Cancelar" : "Adicionar Verso"}
            </button>

            <button
              onClick={toggleImportInputs}
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
            >
              {importInputsVisible[list.id] ? "Cancelar" : "Importar"}
            </button>
          </div>

          {/* Formulário para adicionar manualmente novos versículos */}
          {manualInputsVisible[list.id] && (
            <div className="mb-4 p-4 bg-gray-50 border rounded">
              <h4 className="text-md font-medium mb-2">Adicionar Verso</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">Texto</label>
                  <textarea
                    value={newVerse.text}
                    onChange={(e) =>
                      setNewVerse((prev) => ({ ...prev, text: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Referência</label>
                    <input
                      type="text"
                      value={newVerse.reference}
                      onChange={(e) =>
                        setNewVerse((prev) => ({
                          ...prev,
                          reference: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded"
                      placeholder="Ex: João 3:16"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Versão</label>
                    <input
                      type="text"
                      value={newVerse.version}
                      onChange={(e) =>
                        setNewVerse((prev) => ({
                          ...prev,
                          version: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded"
                      placeholder="Ex: NVI"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleAddVerseToList(list.id)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}

          {/* Formulário para importar versículos existentes */}
          {importInputsVisible[list.id] && (
            <div className="mb-4 p-4 bg-gray-50 border rounded">
              <h4 className="text-md font-medium mb-2">
                Importar Versículo do App da Bíblia
              </h4>
              <div className="space-y-2">
                <label className="block text-sm mb-1">
                  Cole o texto do versículo abaixo
                </label>
                <textarea
                  value={importedVerse}
                  onChange={(e) => setImportedVerse(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={5}
                  placeholder="Cole aqui o texto do versículo copiado do aplicativo da Bíblia"
                />
                <p className="text-xs text-gray-500">
                  Dica: Copie o versículo completo do app da Bíblia incluindo a
                  referência.
                </p>
                <button
                  onClick={() => handleImportVerseToList(list.id, list.name)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  disabled={!importedVerse.trim()}
                >
                  Importar
                </button>
              </div>
            </div>
          )}

          {/* Lista de versículos */}
          {list.verses.length > 0 ? (
            <VerseList
              verses={list.verses}
              setVerses={handleVerseListChange}
              renderExtra={(verse) => (
                <span className="text-xs text-gray-500">{verse.week}</span>
              )}
            />
          ) : (
            <p className="text-gray-500 italic">
              Esta lista ainda não possui versículos.
            </p>
          )}
        </div>
      )}
    </li>
  );
};

// Componente de pódio para mostrar o total de versos
const TotalVersesPodium: React.FC<{ total: number }> = ({ total }) => (
  <div className="flex justify-center mb-8">
    <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-50 rounded-xl shadow-lg px-8 py-6 flex flex-col items-center border-2 border-yellow-300">
      <div className="mb-2">
        <svg
          className="w-12 h-12 text-yellow-500 drop-shadow"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2c.55 0 1 .45 1 1v2.09c3.39.49 6 3.39 6 6.91 0 2.93-2.07 5.38-4.92 5.91l.92 2.09h2c.55 0 1 .45 1 1s-.45 1-1 1h-2.5c-.41 0-.77-.25-.93-.62l-1.07-2.43c-.16-.37-.52-.62-.93-.62s-.77.25-.93.62l-1.07 2.43c-.16.37-.52.62-.93.62H6c-.55 0-1-.45-1-1s.45-1 1-1h2l.92-2.09C7.07 15.38 5 12.93 5 10c0-3.52 2.61-6.42 6-6.91V3c0-.55.45-1 1-1zm0 4C9.24 6 7 8.24 7 11c0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
        </svg>
      </div>
      <div className="text-3xl font-extrabold text-yellow-700 flex items-center">
        {total}
        <span className="ml-2 text-lg font-semibold text-yellow-600">versos</span>
      </div>
      <div className="text-sm text-yellow-700 mt-1 font-medium">
        Total de versos em todas as listas
      </div>
    </div>
  </div>
);

// Componente principal CustomLists
const CustomLists: React.FC = () => {
  const {
    customLists,
    expandedLists,
    editableTotals,
    editingListId,
    newListName,
    isCreatingNewList,
    manualInputsVisible,
    importInputsVisible,
    newVerse,
    importedVerse,
    setExpandedLists,
    setEditableTotals,
    setEditingListId,
    setNewListName,
    setIsCreatingNewList,
    setManualInputsVisible,
    setImportInputsVisible,
    setNewVerse,
    setImportedVerse,
    setCustomLists,
    handleSaveList,
    handleAddVerseToList,
    handleImportVerseToList,
    handleDeleteList,
    handleEditListName,
    handleTotalChange,
    toggleExpandList,
  } = useCustomLists();

  // Soma total de versos de todas as listas
  const totalVersesAllLists = customLists.reduce(
    (sum, list) => sum + getTotalVerses(list),
    0
  );

  return (
    <div className="bg-background min-h-screen text-text px-4 py-6">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Listas Personalizadas
        </h2>
        <InfoPanel />

        {/* Pódio de total de versos */}
        {customLists.length > 0 && totalVersesAllLists > 0 && (
          <TotalVersesPodium total={totalVersesAllLists} />
        )}

        {/* Formulário para criar nova lista */}
        {!isCreatingNewList ? (
          <button
            onClick={() => setIsCreatingNewList(true)}
            className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 mb-4"
          >
            Criar Nova Lista
          </button>
        ) : (
          <NewListForm
            newListName={newListName}
            setNewListName={setNewListName}
            handleSaveList={handleSaveList}
          />
        )}

        {/* Listagem das listas personalizadas */}
        <div className="mt-8">
          {customLists.length === 0 ? (
            <p className="text-gray-500">Nenhuma lista personalizada criada.</p>
          ) : (
            <ul className="space-y-4">
              {customLists
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
                .map((list) => (
                  <ListItem
                    key={list.id}
                    list={list}
                    expandedLists={expandedLists}
                    editableTotals={editableTotals}
                    editingListId={editingListId}
                    manualInputsVisible={manualInputsVisible}
                    importInputsVisible={importInputsVisible}
                    newVerse={newVerse}
                    importedVerse={importedVerse}
                    setEditingListId={setEditingListId}
                    setCustomLists={setCustomLists}
                    setManualInputsVisible={setManualInputsVisible}
                    setImportInputsVisible={setImportInputsVisible}
                    setNewVerse={setNewVerse}
                    setImportedVerse={setImportedVerse}
                    handleTotalChange={handleTotalChange}
                    handleEditListName={handleEditListName}
                    handleDeleteList={handleDeleteList}
                    toggleExpandList={toggleExpandList}
                    handleAddVerseToList={handleAddVerseToList}
                    handleImportVerseToList={handleImportVerseToList}
                  />
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomLists;

// Função utilitária para contar versos em uma referência
function countVersesInReference(reference: string): number {
  // Extrai apenas a parte dos versículos (após o ':')
  // Exemplo: "Efésios 5:1-2,4,6-8" => "1-2,4,6-8"
  const match = reference.match(/:(.*?)(?:\s|$)/);
  if (!match) return 1;
  const versesPart = match[1].trim();

  let total = 0;
  versesPart.split(',').forEach((part) => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        total += end - start + 1;
      } else {
        total += 1;
      }
    } else if (!isNaN(Number(part))) {
      total += 1;
    }
  });
  return total || 1;
}

// Função para contar o total de versos reais em uma lista
function getTotalVerses(list: CustomList): number {
  return list.verses.reduce((sum, verse) => sum + countVersesInReference(verse.reference), 0);
}

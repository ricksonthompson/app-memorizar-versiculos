import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomList, Verse } from "../types";
import {
  saveCustomList,
  getCustomLists,
  getStoredVerses,
} from "../utils/localStorageHelper";

export function useCustomLists() {
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

  const handleImportVerseToList = (listId: string) => {
    if (!importedVerse) return;

    // Encontrar o versículo pelo ID
    const allVerses = getStoredVerses();
    const verse = allVerses.find((v) => v.id === importedVerse);

    if (!verse) return;

    // Adicionar à lista
    const updatedLists = customLists.map((list) => {
      if (list.id === listId) {
        // Verificar se o versículo já existe na lista
        const verseExists = list.verses.some((v) => v.id === verse.id);

        if (verseExists) return list;

        return {
          ...list,
          verses: [...list.verses, verse],
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
    setImportedVerse("");
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
}

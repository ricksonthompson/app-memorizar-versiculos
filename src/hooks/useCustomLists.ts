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
  const [expandedLists, setExpandedLists] = useState<string[]>([]); // Mudou para array de strings
  const [editableTotals, setEditableTotals] = useState<Record<string, string>>(
    {}
  );
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);

  // Estados para adição de versículos
  const [manualInputsVisible, setManualInputsVisible] = useState<string | null>(
    null
  ); // Mudou para string | null
  const [importInputsVisible, setImportInputsVisible] = useState<string | null>(
    null
  ); // Mudou para string | null
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

    // Inicializar totais editáveis
    const initialTotals: Record<string, string> = {};
    fetchedLists.forEach((list) => {
      initialTotals[list.id] = list.verses.length.toString();
    });

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

    // Inicializar totais para a nova lista
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

    // Remover da lista de expandidos se estiver lá
    if (expandedLists.includes(listId)) {
      setExpandedLists(expandedLists.filter((id) => id !== listId));
    }

    // Resetar inputs se estiverem visíveis
    if (manualInputsVisible === listId) {
      setManualInputsVisible(null);
    }

    if (importInputsVisible === listId) {
      setImportInputsVisible(null);
    }
  };

  const toggleExpandList = (listId: string) => {
    setExpandedLists((prev) => {
      if (prev.includes(listId)) {
        return prev.filter((id) => id !== listId);
      } else {
        return [...prev, listId];
      }
    });

    // Fechar inputs quando fechar a lista
    if (expandedLists.includes(listId)) {
      if (manualInputsVisible === listId) {
        setManualInputsVisible(null);
      }

      if (importInputsVisible === listId) {
        setImportInputsVisible(null);
      }
    }
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

    // Fechar o painel de inserção manual
    setManualInputsVisible(null);
  };

  const handleImportVerseToList = (listId: string, listName: string) => {
    // Verificar primeiro se é texto colado (não um ID)
    if (importedVerse && !/^[0-9]+$/.test(importedVerse)) {
      // É um texto colado - processar o versículo
      if (importedVerse.trim() === "") {
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
          week: listName, // Usar o nome da lista como identificação da semana
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
    } else {
      // É um ID selecionado do dropdown - processo original
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
      setImportInputsVisible(null);
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
}

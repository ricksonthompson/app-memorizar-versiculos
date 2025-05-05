import React from "react";
import { CustomList, Verse } from "../../types";
import VerseList from "../VerseList";
import ListHeader from "./ListHeader";
import { getStoredVerses } from "../../utils/localStorageHelper";

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
  handleImportVerseToList: (listId: string) => void;
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
              {manualInputsVisible[list.id]
                ? "Cancelar"
                : "Adicionar Novo Versículo"}
            </button>

            <button
              onClick={toggleImportInputs}
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
            >
              {importInputsVisible[list.id] ? "Cancelar" : "Importar Versículo"}
            </button>
          </div>

          {/* Formulário para adicionar manualmente novos versículos */}
          {manualInputsVisible[list.id] && (
            <div className="mb-4 p-4 bg-gray-50 border rounded">
              <h4 className="text-md font-medium mb-2">
                Adicionar Novo Versículo
              </h4>
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
                Importar Versículo Existente
              </h4>
              <div className="space-y-2">
                <label className="block text-sm mb-1">
                  Selecione um versículo
                </label>
                <select
                  value={importedVerse}
                  onChange={(e) => setImportedVerse(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Selecione um versículo --</option>
                  {allVerses.map((verse) => (
                    <option key={verse.id} value={verse.id}>
                      {verse.reference} ({verse.version})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleImportVerseToList(list.id)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  disabled={!importedVerse}
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

export default ListItem;

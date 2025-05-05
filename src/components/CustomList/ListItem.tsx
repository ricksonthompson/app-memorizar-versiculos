import React from "react";
import { CustomList, Verse } from "../../types";
import VerseList from "../VerseList";
import ListHeader from "./ListHeader";
import { getStoredVerses } from "../../utils/localStorageHelper";

interface ListItemProps {
  list: CustomList;
  expandedLists: string[];
  editableTotals: Record<string, string>;
  editingListId: string | null;
  manualInputsVisible: string | null;
  importInputsVisible: string | null;
  newVerse: { text: string; reference: string; version: string };
  importedVerse: string;
  setEditingListId: (id: string | null) => void;
  setCustomLists: React.Dispatch<React.SetStateAction<CustomList[]>>;
  setManualInputsVisible: React.Dispatch<React.SetStateAction<string | null>>;
  setImportInputsVisible: React.Dispatch<React.SetStateAction<string | null>>;
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
  const allVerses = getStoredVerses();

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
          isExpanded={expandedLists.includes(list.id)}
          editingListId={editingListId}
          toggleExpandList={toggleExpandList}
          setEditingListId={setEditingListId}
          handleEditListName={handleEditListName}
          handleDeleteList={handleDeleteList}
        />
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
                onClick={() => handleImportVerseToList(list.id, list.name)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Importar Versículo
              </button>
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
        </>
      )}
    </li>
  );
};

export default ListItem;

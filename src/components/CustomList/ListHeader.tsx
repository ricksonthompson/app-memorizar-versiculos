import React, { useState } from "react";
import { CustomList } from "../../types";

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
              className="text-xs bg-gray-200 rounded px-1 hover:bg-gray-300"
              title="Editar nome"
            >
              ✎
            </button>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
          {list.verses.length} versículos
        </span>

        <button
          onClick={() => toggleExpandList(list.id)}
          className="hover:underline"
        >
          {isExpanded ? "Recolher" : "Expandir"}
        </button>

        <button
          onClick={() => handleDeleteList(list.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default ListHeader;

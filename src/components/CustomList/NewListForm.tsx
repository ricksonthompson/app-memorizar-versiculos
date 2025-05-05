import React from "react";

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

export default NewListForm;

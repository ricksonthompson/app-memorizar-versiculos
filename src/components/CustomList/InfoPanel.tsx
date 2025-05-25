import React from "react";

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

export default InfoPanel;

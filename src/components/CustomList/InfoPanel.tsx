import React from "react";

const InfoPanel: React.FC = () => {
  return (
    <div className="bg-accent-light text-accent-dark p-2 rounded">
      <h2 className="text-lg font-semibold mb-2">Como funciona?</h2>
      <ul className="list-disc pl-5 text-sm space-y-1">
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

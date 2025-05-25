import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="bg-background min-h-screen text-text px-4 py-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Bem-vindo ao Memorizei App de Versículos
        </h1>
        <p className="text-lg text-center text-gray-600 mb-4">
          Organize seus versículos e prepare-se para recitá-los com facilidade!
        </p>
        <div className="flex flex-col space-y-4">
          {/* <Link to="/meus-versiculos" className="bg-[#0A9B71] text-black py-2 px-4 rounded hover:bg-[#9F2B29] transition duration-300">
                    Meus Versículos
                </Link> */}
          <button className="bg-[#0A9B71] text-black py-2 px-4 rounded hover:bg-[#9F2B29] transition duration-300">
            <Link to="/listas-personalizadas">
              Ir para Listas Personalizadas
            </Link>
          </button>
          {/* <Link to="/recitar-versiculos" className="bg-[#0A9B71] text-black py-2 px-4 rounded hover:bg-[#9F2B29] transition duration-300">
                    Recitar Versículos
                </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Home;

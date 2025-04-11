import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Bem-vindo ao App de Memorização de Versículos</h1>
            <p className="text-lg text-center text-gray-600 mb-4">Organize seus versículos e prepare-se para recitá-los com facilidade!</p>
            <div className="flex flex-col space-y-4">
                <Link to="/meus-versiculos" className="bg-[#0A9B71] text-black py-2 px-4 rounded hover:bg-[#9F2B29] transition duration-300">
                    Meus Versículos
                </Link>
                <Link to="/listas-personalizadas" className="bg-[#0A9B71] text-black py-2 px-4 rounded hover:bg-[#9F2B29] transition duration-300">
                    Listas Personalizadas
                </Link>
                <Link to="/recitar-versiculos" className="bg-[#0A9B71] text-black py-2 px-4 rounded hover:bg-[#9F2B29] transition duration-300">
                    Recitar Versículos
                </Link>
            </div>
        </div>
    );
};

export default Home;
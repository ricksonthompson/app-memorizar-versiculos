import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-background text-secondary-dark p-4 w-full shadow-lg border-b border-secondary/10">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo e Título */}
        <div className="flex items-center space-x-4">
          <img
            src="https://www.freeiconspng.com/thumbs/bible-icon/bible-icon-6.png"
            alt="Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-secondary-dark">
            Memorizei App
          </h1>
        </div>

        {/* Navegação */}
        {/* <nav>
                    <ul className="flex space-x-4"> */}
        {/* <li>
                            <Link
                                to="/"
                                className="bg-accent text-[#0A9B71] px-4 py-2 rounded hover:bg-[#0A9B71] hover:text-white transition"
                            >
                                Home
                            </Link>
                        </li> */}
        {/* <li>
                            <Link
                                to="/meus-versiculos"
                                className="bg-accent text-[#0A9B71] px-4 py-2 rounded hover:bg-[#0A9B71] hover:text-white transition"
                            >
                                Meus Versículos
                            </Link>
                        </li> */}
        {/* <li>
                            <Link
                                to="/listas-personalizadas"
                                className="bg-accent text-[#0A9B71] px-4 py-2 rounded hover:bg-[#0A9B71] hover:text-white transition"
                            >
                                Listas Personalizadas
                            </Link>
                        </li> */}
        {/* <li>
                            <Link
                                to="/recitar-versiculos"
                                className="bg-accent text-[#0A9B71] px-4 py-2 rounded hover:bg-[#0A9B71] hover:text-white transition"
                            >
                                Recitar Versículos
                            </Link>
                        </li> */}
        {/* </ul>
                </nav> */}
      </div>
    </header>
  );
};

export default Header;

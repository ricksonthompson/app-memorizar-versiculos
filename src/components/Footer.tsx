import React from "react";
import DataTransferPanel from "./DataTransferPanel";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14191A] text-white py-4 text-center flex flex-col items-center gap-2">
      <DataTransferPanel />
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Versículo Memorization App. Todos os
        direitos reservados.
      </p>
      <span className="text-xs opacity-70 mt-2">
        © {new Date().getFullYear()} Memorizei
      </span>
    </footer>
  );
};

export default Footer;

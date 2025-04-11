import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#14191A] text-white py-4 text-center">
            <p className="text-sm">
                &copy; {new Date().getFullYear()} Versículo Memorization App. Todos os direitos reservados.
            </p>
        </footer>
    );
};

export default Footer;
import React from 'react';

interface SharedButtonProps {
    onClick: () => void;
    label: string;
}

const SharedButton: React.FC<SharedButtonProps> = ({ onClick, label }) => {
    return (
        <button
            onClick={onClick}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
            {label}
        </button>
    );
};

export default SharedButton;
import React from 'react';
import { Verse } from '../types';

interface CustomListProps {
  name: string;
  color: string;
  verses: Verse[];
}

const CustomList: React.FC<CustomListProps> = ({ name, color, verses }) => {
  return (
    <div className="p-4 mb-4 border rounded" style={{ backgroundColor: color }}>
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <ul>
        {verses.map((verse, index) => (
          <li key={index} className="mb-1">
            <span>
              {verse.text} - {verse.reference} ({verse.version})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomList;
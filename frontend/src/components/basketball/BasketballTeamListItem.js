import React from 'react';
import { Link } from 'react-router-dom';

const BasketballTeamListItem = ({ team }) => {
  const { id, name, coach, arena, logoUrl } = team;

  return (
    <div className="bg-orange-800/60 backdrop-blur-md shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-orange-500/30 hover:scale-105">
      <div className="p-5 space-y-3">
        <div className="flex items-center space-x-4">
          <img src={logoUrl || 'https://via.placeholder.com/60/f97316/FFFFFF?Text=Team'} alt={`${name} logo`} className="w-16 h-16 object-contain rounded-full bg-white p-1 shadow-md" />
          <div>
            <h3 className="text-xl font-semibold text-orange-300 group-hover:text-orange-200 transition-colors">{name}</h3>
            {coach && <p className="text-xs text-orange-200">Coach: {coach}</p>}
            {arena && <p className="text-xs text-orange-200">Arena: {arena}</p>}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/basketball/team/${id}`}
            className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BasketballTeamListItem; 
import React from 'react';
import { Link } from 'react-router-dom';

const FootballTeamListItem = ({ team }) => {
  const { id, name, manager, stadium, logo } = team;

  return (
    <div className="bg-slate-800/60 backdrop-blur-md shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-teal-500/30 hover:scale-105">
      <div className="p-5 space-y-3">
        <div className="flex items-center space-x-4">
          <img src={logo || 'https://via.placeholder.com/60/0d9488/FFFFFF?Text=Team'} alt={`${name} logo`} className="w-16 h-16 object-contain rounded-full bg-white p-1 shadow-md" />
          <div>
            <h3 className="text-xl font-semibold text-teal-300 group-hover:text-teal-200 transition-colors">{name}</h3>
            {manager && <p className="text-xs text-slate-400">Manager: {manager}</p>}
            {stadium && <p className="text-xs text-slate-400">Stadium: {stadium}</p>}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/football/team/${id}`}
            className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FootballTeamListItem; 
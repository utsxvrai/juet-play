import React from 'react';
import { Link } from 'react-router-dom';

const FootballTeamListItem = ({ team }) => {
  const { id, name, manager, stadium, logo } = team;

  return (
    <div 
      key={id} 
      className="group bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-teal-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-center"
    >
      <img 
        src={logo} 
        alt={`${name} logo`} 
        className="w-20 h-20 object-contain mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
      />
      <h2 className="text-2xl font-semibold text-teal-400 mb-2 truncate" title={name}>{name}</h2>
      <div className="text-slate-300 text-sm space-y-1 mb-4">
        <p className="truncate" title={`Manager: ${manager}`}>Manager: {manager}</p>
        <p className="truncate" title={`Stadium: ${stadium}`}>Stadium: {stadium}</p>
      </div>
      <Link 
        to={`/football/team/${id}/details`}
        className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 active:scale-95"
      >
        View Details
      </Link>
    </div>
  );
};

export default FootballTeamListItem; 
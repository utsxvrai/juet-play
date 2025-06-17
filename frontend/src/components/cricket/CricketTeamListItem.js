import React from 'react';
import { Link } from 'react-router-dom';

const CricketTeamListItem = ({ team }) => {
  const { id, name, captain, coach, logo } = team;

  return (
    <div className="bg-slate-800/60 backdrop-blur-md shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-emerald-500/30 hover:scale-105">
      <div className="p-5 space-y-3">
        <div className="flex items-center space-x-4">
          <img src={logo || 'https://via.placeholder.com/60/10b981/FFFFFF?Text=Team'} alt={`${name} logo`} className="w-16 h-16 object-contain rounded-full bg-white p-1 shadow-md" />
          <div>
            <h3 className="text-xl font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors">{name}</h3>
            {captain && <p className="text-xs text-slate-400">Captain: {captain}</p>}
            {coach && <p className="text-xs text-slate-400">Coach: {coach}</p>}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/cricket/team/${id}`}
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CricketTeamListItem; 
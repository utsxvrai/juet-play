import React from 'react';
import { Link } from 'react-router-dom';

const VolleyballTeamListItem = ({ team }) => {
  const { id, name, coach, country, logo } = team;

  return (
    <div className="bg-slate-800/60 backdrop-blur-md shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-105">
      <div className="p-5 space-y-3">
        <div className="flex items-center space-x-4">
          <img src={logo || 'https://via.placeholder.com/60/663399/FFFFFF?Text=Team'} alt={`${name} logo`} className="w-16 h-16 object-contain rounded-full bg-white p-1 shadow-md" />
          <div>
            <h3 className="text-xl font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors">{name}</h3>
            {coach && <p className="text-xs text-slate-400">Coach: {coach}</p>}
            {country && <p className="text-xs text-slate-400">Country: {country}</p>}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/volleyball/team/${id}`}
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VolleyballTeamListItem; 
import React from 'react';
import { Link } from 'react-router-dom';

const FootballTeamCard = ({ team }) => {
  if (!team) return null;
  const { _id, name, coach, country, wins, losses, draws } = team;

  const totalMatches = (wins || 0) + (losses || 0) + (draws || 0);
  const winPercentage = totalMatches > 0 ? ((wins || 0) / totalMatches * 100).toFixed(1) : 0;

  return (
    <div className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-green-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 border-green-400">
      <h3 className="text-2xl font-bold text-green-300 mb-2">{name}</h3>
      <div className="text-slate-200 mb-2">Coach: {coach}</div>
      <div className="text-slate-200 mb-4">Country: {country}</div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <span className="text-green-400 font-semibold block text-lg">{wins || 0}</span>
          <span className="text-slate-400 text-sm">Wins</span>
        </div>
        <div className="text-center">
          <span className="text-yellow-400 font-semibold block text-lg">{draws || 0}</span>
          <span className="text-slate-400 text-sm">Draws</span>
        </div>
        <div className="text-center">
          <span className="text-red-400 font-semibold block text-lg">{losses || 0}</span>
          <span className="text-slate-400 text-sm">Losses</span>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <span className="text-blue-400 font-semibold">Win Rate: {winPercentage}%</span>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Link 
          to={`/football/teams/${_id}`}
          className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default FootballTeamCard; 
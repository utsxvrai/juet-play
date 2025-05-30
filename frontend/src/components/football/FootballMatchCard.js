import React from 'react';
import { Link } from 'react-router-dom';

const FootballMatchCard = ({ match }) => {
  const { id, status, league, teamA, teamB, time, summary } = match;

  const statusColor = status === 'LIVE' ? 'bg-red-500' : (status === 'HALF-TIME' ? 'bg-orange-500' : 'bg-yellow-500 text-slate-900');
  const borderColor = status === 'LIVE' ? 'border-red-500' : (status === 'HALF-TIME' ? 'border-orange-500' : 'border-yellow-500');

  return (
    <div 
      key={id} 
      className={`bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-teal-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 ${borderColor}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold tracking-wider ${statusColor}`}>{status}</span>
        <span className="text-xs text-slate-400 truncate" title={league}>{league}</span>
      </div>
      <div className="mb-4 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            <img src={teamA.logo} alt={teamA.name} className="w-8 h-8 mr-2 border-2 border-slate-600 flex-shrink-0 object-contain"/> 
            <span className="text-xl font-semibold text-slate-200 truncate" title={teamA.name}>{teamA.name}</span>
          </div>
          {teamA.score !== null && <span className="text-3xl font-bold text-teal-400 ml-2 whitespace-nowrap">{teamA.score}</span>}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            <img src={teamB.logo} alt={teamB.name} className="w-8 h-8 mr-2 border-2 border-slate-600 flex-shrink-0 object-contain"/> 
            <span className="text-xl font-semibold text-slate-200 truncate" title={teamB.name}>{teamB.name}</span>
          </div>
          <div className="flex items-baseline ml-2">
            {teamB.score !== null && <span className="text-3xl font-bold text-teal-400 whitespace-nowrap">{teamB.score}</span>}
            {time && <span className="text-sm text-slate-400 ml-2 whitespace-nowrap">({time}')</span>}
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-400 mb-4 h-10 overflow-hidden" title={summary}>{summary}</p>
      <Link 
        to={`/football/match/${id}`}
        className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 active:scale-95"
      >
        Match Details
      </Link>
    </div>
  );
};

export default FootballMatchCard; 
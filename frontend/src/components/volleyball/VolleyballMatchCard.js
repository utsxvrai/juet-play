import React from 'react';
import { Link } from 'react-router-dom';

const VolleyballMatchCard = ({ match }) => {
  const { id, status, tournament, teamA, teamB, currentSet, summary } = match;

  const statusColor = status === 'LIVE' ? 'bg-red-500' : 'bg-yellow-500 text-slate-900';
  const borderColor = status === 'LIVE' ? 'border-red-500' : 'border-yellow-500';

  return (
    <div 
      key={id} 
      className={`bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-indigo-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 ${borderColor}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold tracking-wider ${statusColor}`}>{status}</span>
        <span className="text-xs text-slate-400 truncate" title={tournament}>{tournament}</span>
      </div>
      <div className="mb-4 space-y-2">
        {/* Team A */}
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            <img src={teamA.logo} alt={teamA.name} className="w-8 h-8 rounded-full mr-2 border-2 border-slate-600 flex-shrink-0 object-contain"/> 
            <span className="text-xl font-semibold text-slate-200 truncate" title={teamA.name}>{teamA.name}</span>
          </div>
          <div className="flex items-center">
            {teamA.setsWon !== undefined && <span className="text-2xl font-bold text-indigo-400">{teamA.setsWon}</span>}
            {teamA.currentSetScore !== undefined && <span className="text-lg text-slate-300 ml-2">( {teamA.currentSetScore} )</span>}
          </div>
        </div>
        {/* Team B */}
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            <img src={teamB.logo} alt={teamB.name} className="w-8 h-8 rounded-full mr-2 border-2 border-slate-600 flex-shrink-0 object-contain"/> 
            <span className="text-xl font-semibold text-slate-200 truncate" title={teamB.name}>{teamB.name}</span>
          </div>
          <div className="flex items-center">
            {teamB.setsWon !== undefined && <span className="text-2xl font-bold text-indigo-400">{teamB.setsWon}</span>}
            {teamB.currentSetScore !== undefined && <span className="text-lg text-slate-300 ml-2">( {teamB.currentSetScore} )</span>}
          </div>
        </div>
      </div>
      {currentSet && <p className="text-sm font-medium text-indigo-300 mb-1">Set {currentSet}</p>}
      <p className="text-sm text-slate-400 mb-4 h-10 overflow-hidden" title={summary}>{summary}</p>
      <Link 
        to={`/volleyball/match/${id}`}
        className="block w-full text-center bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 active:scale-95"
      >
        Match Details
      </Link>
    </div>
  );
};

export default VolleyballMatchCard; 
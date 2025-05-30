import React from 'react';
import { Link } from 'react-router-dom';

const BasketballMatchCard = ({ match }) => {
  const { id, status, league, teamA, teamB, quarter, timeRemaining, summary } = match;

  let statusText = status.toUpperCase();
  let statusColor = 'bg-yellow-500 text-slate-900';
  let borderColor = 'border-yellow-500';

  if (status === 'LIVE') {
    statusColor = 'bg-red-500';
    borderColor = 'border-red-500';
  } else if (status === 'HALF-TIME') {
    statusColor = 'bg-orange-500';
    borderColor = 'border-orange-500';
  } else if (status === 'ENDED') {
    statusColor = 'bg-slate-600';
    borderColor = 'border-slate-600';
  }

  return (
    <div 
      key={id} 
      className={`bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-orange-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 ${borderColor}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold tracking-wider ${statusColor}`}>{statusText}</span>
        <span className="text-xs text-slate-400 truncate" title={league}>{league}</span>
      </div>
      <div className="mb-4 space-y-2">
        {/* Team A */}
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            <img src={teamA.logo} alt={teamA.name} className="w-8 h-8 mr-2 border-2 border-slate-600 flex-shrink-0 object-contain"/> 
            <span className="text-xl font-semibold text-slate-200 truncate" title={teamA.name}>{teamA.name}</span>
          </div>
          {teamA.score !== null && <span className="text-3xl font-bold text-orange-400 ml-2 whitespace-nowrap">{teamA.score}</span>}
        </div>
        {/* Team B */}
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            <img src={teamB.logo} alt={teamB.name} className="w-8 h-8 mr-2 border-2 border-slate-600 flex-shrink-0 object-contain"/> 
            <span className="text-xl font-semibold text-slate-200 truncate" title={teamB.name}>{teamB.name}</span>
          </div>
          {teamB.score !== null && <span className="text-3xl font-bold text-orange-400 ml-2 whitespace-nowrap">{teamB.score}</span>}
        </div>
      </div>
      {quarter && timeRemaining && status !== 'ENDED' && (
        <p className="text-sm font-medium text-orange-300 mb-1">
          Q{quarter} - {timeRemaining}
        </p>
      )}
      <p className="text-sm text-slate-400 mb-4 h-10 overflow-hidden" title={summary}>{summary}</p>
      <Link 
        to={`/basketball/match/${id}`}
        className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 active:scale-95"
      >
        Game Details
      </Link>
    </div>
  );
};

export default BasketballMatchCard; 
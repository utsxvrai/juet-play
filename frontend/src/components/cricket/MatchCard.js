import React from 'react';
import { Link } from 'react-router-dom';

const MatchCard = ({ match }) => {
  const { id, status, series, teamA, teamB, overs, summary } = match;

  const statusColor = status === 'LIVE' ? 'bg-red-500' : 'bg-yellow-500 text-slate-900';
  const borderColor = status === 'LIVE' ? 'border-red-500' : 'border-yellow-500';

  // Helper to render logo or fallback
  const renderTeamLogo = (logo, name) => {
    if (logo && logo.trim() !== '') {
      return <img src={logo} alt={name} className="w-8 h-8 rounded-full mr-2 border-2 border-slate-600 flex-shrink-0" />;
    } else {
      return (
        <span className="w-8 h-8 mr-2 rounded-full bg-slate-600 text-white flex items-center justify-center text-lg font-bold border-2 border-slate-600 flex-shrink-0">
          {name && name[0] ? name[0].toUpperCase() : '?'}
        </span>
      );
    }
  };

  return (
    <div
      key={id}
      className={`bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-emerald-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 ${borderColor}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold tracking-wider ${statusColor}`}>{status}</span>
        <span className="text-xs text-slate-400 truncate" title={series}>{series}</span>
      </div>
      <div className="mb-4 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            {renderTeamLogo(teamA.logo, teamA.name)}
            <span className="text-xl font-semibold text-slate-200 truncate" title={teamA.name}>{teamA.name}</span>
          </div>
          {teamA.score && <span className="text-2xl font-bold text-emerald-400 ml-2 whitespace-nowrap">{teamA.score}</span>}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center min-w-0">
            {renderTeamLogo(teamB.logo, teamB.name)}
            <span className="text-xl font-semibold text-slate-200 truncate" title={teamB.name}>{teamB.name}</span>
          </div>
          <div className="flex items-baseline ml-2">
            {teamB.score && teamB.score.trim() !== '' && <span className="text-2xl font-bold text-emerald-400 whitespace-nowrap">{teamB.score}</span>}
            {overs && <span className="text-sm text-slate-400 ml-2 whitespace-nowrap">({overs} ov)</span>}
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-400 mb-4 h-10 overflow-hidden" title={summary}>{summary}</p>
      <Link
        to={`/cricket/match/${id}`}
        className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 active:scale-95"
      >
        View Scorecard
      </Link>
    </div>
  );
};

export default MatchCard; 
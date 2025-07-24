import React from 'react';
import { Link } from 'react-router-dom';

const TeamListItem = ({ team }) => {
  const { _id, name, captain, manager, logo } = team;

  // Helper to render logo or fallback
  const renderTeamLogo = (logo, name) => {
    if (logo && logo.trim() !== '') {
      return (
        <img
          src={logo}
          alt={`${name} logo`}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-700 group-hover:border-emerald-500 transition-colors duration-300 object-cover"
        />
      );
    } else {
      return (
        <span className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-600 text-white flex items-center justify-center text-5xl font-bold border-4 border-slate-700 group-hover:border-emerald-500 transition-colors duration-300">
          {name && name[0] ? name[0].toUpperCase() : '?'}
        </span>
      );
    }
  };

  return (
    <div
      key={_id}
      className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-emerald-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-center"
    >
      {renderTeamLogo(logo, name)}
      <h2 className="text-2xl font-semibold text-emerald-400 mb-2 truncate" title={name}>{name}</h2>
      <div className="text-slate-300 text-sm space-y-1 mb-4">
        <p className="truncate" title={`Captain: ${captain && captain.name ? captain.name : ''}`}>Captain: {captain && captain.name ? captain.name : 'N/A'}</p>
        <p className="truncate" title={`Manager: ${manager}`}>Manager: {manager || 'N/A'}</p>
      </div>
      <Link
        to={`/cricket/team/${_id}/squad`}
        className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 active:scale-95"
      >
        View Squad
      </Link>
    </div>
  );
};

export default TeamListItem; 
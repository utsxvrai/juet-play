import React from 'react';
import { Link } from 'react-router-dom';

const FootballPlayerCard = ({ player }) => {
  if (!player) return null;
  const { _id, name, age, gender, position, jerseyNumber, country, goals, assists, yellowCards, redCards } = player;

  const getPositionColor = (pos) => {
    switch (pos) {
      case 'goalkeeper': return 'text-blue-400';
      case 'defender': return 'text-green-400';
      case 'midfielder': return 'text-yellow-400';
      case 'forward': return 'text-red-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-green-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 border-green-400">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold text-green-300">{name}</h3>
        <div className="bg-green-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
          {jerseyNumber || '?'}
        </div>
      </div>
      <div className="text-slate-200 mb-2">Age: {age}</div>
      <div className="text-slate-200 mb-2 capitalize">Gender: {gender}</div>
      <div className={`text-slate-200 mb-2 capitalize font-semibold ${getPositionColor(position)}`}>
        Position: {position}
      </div>
      <div className="text-slate-200 mb-2">Country: {country}</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <span className="text-green-400 font-semibold block">Goals: {goals || 0}</span>
        </div>
        <div className="text-center">
          <span className="text-blue-400 font-semibold block">Assists: {assists || 0}</span>
        </div>
        <div className="text-center">
          <span className="text-yellow-400 font-semibold block">Yellow: {yellowCards || 0}</span>
        </div>
        <div className="text-center">
          <span className="text-red-400 font-semibold block">Red: {redCards || 0}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link 
          to={`/football/player/${_id}`}
          className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default FootballPlayerCard; 
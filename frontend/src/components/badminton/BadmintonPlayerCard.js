import React from 'react';
import { Link } from 'react-router-dom';

const BadmintonPlayerCard = ({ player }) => {
  if (!player) return null;
  const { _id, name, age, gender, country, Won, Lost } = player;

  return (
    <div className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-orange-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 border-orange-400">
      <h3 className="text-2xl font-bold text-orange-300 mb-2">{name}</h3>
      <div className="text-slate-200 mb-2">Age: {age}</div>
      <div className="text-slate-200 mb-2 capitalize">Gender: {gender}</div>
      <div className="text-slate-200 mb-2">Country: {country}</div>
      <div className="flex gap-4 mb-4">
        <span className="text-green-400 font-semibold">Won: {Won}</span>
        <span className="text-red-400 font-semibold">Lost: {Lost}</span>
      </div>
      <div className="mt-4 flex justify-end">
        <Link 
          to={`/badminton/player/${_id}`}
          className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BadmintonPlayerCard; 
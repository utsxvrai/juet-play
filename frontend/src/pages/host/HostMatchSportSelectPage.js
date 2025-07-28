import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const sports = [
  { name: 'Badminton', path: '/host/badminton', emoji: '🏸', accent: 'orange' },
  { name: 'Football', path: '/host/football', emoji: '⚽', accent: 'teal' },
  { name: 'Volleyball', path: '/host/volleyball', emoji: '🏐', accent: 'indigo' },
  { name: 'Basketball', path: '/host/basketball', emoji: '🏀', accent: 'orange' },
];

const accentClasses = {
  emerald: 'hover:border-emerald-400 focus:ring-emerald-400 focus:ring-2',
  teal: 'hover:border-teal-400 focus:ring-teal-400 focus:ring-2',
  indigo: 'hover:border-indigo-400 focus:ring-indigo-400 focus:ring-2',
  orange: 'hover:border-orange-400 focus:ring-orange-400 focus:ring-2',
};

const HostMatchSportSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Host a New Match</h1>
          <p className="text-xl text-slate-400">Select the sport for which you want to host a match.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 justify-center">
          {sports.map((sport) => (
            <Link
              to={sport.path}
              key={sport.name}
              className={`group bg-slate-700/50 border border-slate-700 p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none ${accentClasses[sport.accent]} hover:bg-opacity-60 hover:shadow-2xl`}
            >
              <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">{sport.emoji}</div>
              <span className="text-xl font-medium text-slate-200 group-hover:text-white transition-colors duration-300">{sport.name}</span>
            </Link>
          ))}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-12 w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-300 text-lg mx-auto block"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default HostMatchSportSelectPage; 
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const sports = [
    { name: 'Cricket', emoji: '🏏', path: '/cricket' },
    { name: 'Football', emoji: '⚽', path: '/football' },
    { name: 'Volleyball', emoji: '🏐', path: '/volleyball' },
    { name: 'Basketball', emoji: '🏀', path: '/basketball' },
  ];

  const handleSportClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500 selection:text-white">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-6xl font-extrabold tracking-tight">
          JUET <span className="text-emerald-400">Play</span>
        </h1>
        <p className="text-2xl text-slate-400 font-light">
          Your Arena for Real-time Multi-Sport Scoring
        </p>
      </div>

      <main className="w-full max-w-3xl bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 md:p-12">
        <section className="mb-10">
          <h2 className="text-4xl font-semibold text-emerald-400 mb-8 text-center">
            Select a Sport
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {sports.map((sport) => (
              <button
                key={sport.name}
                onClick={() => handleSportClick(sport.path)}
                className="group bg-slate-700/50 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500 p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:ring-opacity-50 active:scale-95"
              >
                <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">{sport.emoji}</div>
                <span className="text-xl font-medium text-slate-200 group-hover:text-emerald-300 transition-colors duration-300">
                  {sport.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => navigate('/host')}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-4 px-12 text-xl rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-75 active:scale-95"
          >
            Host a Match
          </button>
          <button
            onClick={() => navigate('/add-team')}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-12 text-xl rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 active:scale-95"
          >
            Add Team
          </button>
        </section>
      </main>

      <footer className="mt-auto pt-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} JUET Play. Crafted with ❤️.</p>
      </footer>
    </div>
  );
};

export default HomePage; 
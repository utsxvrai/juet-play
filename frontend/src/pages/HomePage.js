import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  // Management login modal state
  const [showModal, setShowModal] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const sports = [
    { name: 'Badminton', emoji: '🏸', path: '/badminton' },
    { name: 'Football', emoji: '⚽', path: '/football' },
    { name: 'Volleyball', emoji: '🏐', path: '/volleyball' },
    { name: 'Basketball', emoji: '🏀', path: '/basketball' },
  ];


  const handleSportClick = (path) => {
    navigate(path);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (login.email === '221b425' && login.password === '1234') {
      setShowModal(false);
      setLoginError('');
      setLogin({ email: '', password: '' });
      navigate('/host');
    } else {
      setLoginError('Invalid email or password.');
    }
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
            onClick={() => setShowModal(true)}
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

        {/* Management Login Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-xs relative">
              <h2 className="text-lg font-bold text-emerald-400 mb-4">Management Login</h2>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm text-emerald-300 mb-1">Email/ID</label>
                  <input type="text" name="email" id="email" value={login.email} onChange={handleLoginChange} required
                    className="w-full bg-slate-700 border-slate-600 text-white rounded-md py-2 px-3" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm text-emerald-300 mb-1">Password</label>
                  <input type="password" name="password" id="password" value={login.password} onChange={handleLoginChange} required
                    className="w-full bg-slate-700 border-slate-600 text-white rounded-md py-2 px-3" />
                </div>
                {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
                <div className="flex justify-end space-x-2 mt-4">
                  <button type="button" onClick={() => { setShowModal(false); setLoginError(''); setLogin({ email: '', password: '' }); }}
                    className="px-4 py-1 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700">Cancel</button>
                  <button type="submit" className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md">Login</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto pt-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} JUET Play. Crafted with ❤️.</p>
      </footer>
    </div>
  );
};

export default HomePage; 
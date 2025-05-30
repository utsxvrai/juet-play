import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const CricketPageLayout = ({ children, title }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine active tab
  const isMatchesPage = currentPath.includes('/cricket/matches') || currentPath === '/cricket';
  const isTeamsPage = currentPath.includes('/cricket/teams');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-6 selection:bg-emerald-500 selection:text-white">
      <header className="mb-8">
        <nav className="container mx-auto flex flex-wrap justify-between items-center gap-y-4 gap-x-6 py-2">
          <Link to="/" className="text-3xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors duration-300">
            JUET <span className="text-slate-300">Play</span>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-5">
            <Link 
              to="/cricket/matches" 
              className={`text-base sm:text-lg pb-1 transition-all duration-300 hover:text-emerald-300 ${isMatchesPage ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'text-slate-300 font-normal'}`}
            >
              Matches
            </Link>
            <Link 
              to="/cricket/teams" 
              className={`text-base sm:text-lg pb-1 transition-all duration-300 hover:text-emerald-300 ${isTeamsPage ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'text-slate-300 font-normal'}`}
            >
              Teams
            </Link>
            {/* Add other sport-specific nav links here if needed */}
          </div>
        </nav>
      </header>
      <main className="container mx-auto">
        {title && (
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 sm:mb-10 text-center text-emerald-400 tracking-tight">
            {title}
          </h1>
        )}
        {children}
      </main>
      <footer className="container mx-auto mt-12 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} JUET Play. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default CricketPageLayout; 
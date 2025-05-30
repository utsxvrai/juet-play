import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FootballPageLayout = ({ children, title }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isMatchesPage = currentPath.includes('/football/matches') || currentPath === '/football';
  const isTeamsPage = currentPath.includes('/football/teams');
  // Add more specific page checks if needed, e.g., standings, players

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-6 selection:bg-teal-500 selection:text-white">
      <header className="mb-8">
        <nav className="container mx-auto flex flex-wrap justify-between items-center gap-y-4 gap-x-6 py-2">
          <Link to="/" className="text-3xl font-bold text-teal-400 hover:text-teal-300 transition-colors duration-300">
            JUET <span className="text-slate-300">Play</span>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-5">
            <Link 
              to="/football/matches" 
              className={`text-base sm:text-lg pb-1 transition-all duration-300 hover:text-teal-300 ${isMatchesPage ? 'text-teal-400 font-semibold border-b-2 border-teal-400' : 'text-slate-300 font-normal'}`}
            >
              Matches
            </Link>
            <Link 
              to="/football/teams" 
              className={`text-base sm:text-lg pb-1 transition-all duration-300 hover:text-teal-300 ${isTeamsPage ? 'text-teal-400 font-semibold border-b-2 border-teal-400' : 'text-slate-300 font-normal'}`}
            >
              Teams
            </Link>
            {/* Example: Add Standings link 
            <Link 
              to="/football/standings" 
              className={`text-base sm:text-lg pb-1 transition-all duration-300 hover:text-teal-300 ${currentPath.includes('/football/standings') ? 'text-teal-400 font-semibold border-b-2 border-teal-400' : 'text-slate-300 font-normal'}`}
            >
              Standings
            </Link> 
            */}
          </div>
        </nav>
      </header>
      <main className="container mx-auto">
        {title && (
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 sm:mb-10 text-center text-teal-400 tracking-tight">
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

export default FootballPageLayout; 
import React from 'react';
import { Link } from 'react-router-dom';

const FootballPageLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-6 selection:bg-green-500 selection:text-white">
      <header className="mb-8">
        <nav className="container mx-auto flex flex-wrap justify-between items-center gap-y-4 gap-x-6 py-2">
          <Link to="/" className="text-3xl font-bold text-green-400 hover:text-green-300 transition-colors duration-300">
            JUET <span className="text-slate-300">Play</span>
          </Link>
        </nav>
      </header>
      <main className="container mx-auto">
        {title && (
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 sm:mb-10 text-center text-green-400 tracking-tight">
            {title}
          </h1>
        )}
        {children}
      </main>
      <footer className="mt-10 text-center text-slate-400 text-xs">
        <p>&copy; {new Date().getFullYear()} JUET Play. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default FootballPageLayout; 
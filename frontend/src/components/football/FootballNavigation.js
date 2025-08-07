import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FootballNavigation = ({ statusFilter, setStatusFilter }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/football/matches', label: 'Matches', icon: '⚽' },
    { path: '/football/teams', label: 'Teams', icon: '🏆' },
    { path: '/football/players', label: 'Players', icon: '👤' },
    { path: '/football/live-scoring', label: 'Live Scoring', icon: '📊' },
  ];

  return (
    <nav className="bg-slate-800/70 backdrop-blur-md rounded-lg shadow-lg p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPath === item.path
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-green-400 hover:bg-slate-700/50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        
        {/* Dropdown Filter - only show on matches page */}
        {currentPath === '/football/matches' && (
          <div className="flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="all">All Matches</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
      </div>
    </nav>
  );
};

export default FootballNavigation; 
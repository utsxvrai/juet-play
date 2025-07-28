import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sports = [
    { name: 'Badminton', emoji: '🏸', dashboard: '/badminton/match/' },
  { name: 'Football', emoji: '⚽', dashboard: '/football/match/' },
  { name: 'Volleyball', emoji: '🏐', dashboard: '/volleyball/match/' },
  { name: 'Basketball', emoji: '🏀', dashboard: '/basketball/match/' },
];

const ScoringMatchesPage = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3002/api/v1/match?sport=BADMINTON').then(r => r.json()),
      fetch('http://localhost:3002/api/v1/match?sport=FOOTBALL').then(r => r.json()),
      fetch('http://localhost:3002/api/v1/match?sport=BASKETBALL').then(r => r.json()),
      fetch('http://localhost:3002/api/v1/match?sport=VOLLEYBALL').then(r => r.json()),
    ]).then(([badminton, football, basketball, volleyball]) => {
      setUpcomingMatches([
        ...badminton.filter(m => m.status === 'upcoming').map(m => ({ ...m, sport: 'BADMINTON' })),
        ...football.filter(m => m.status === 'upcoming').map(m => ({ ...m, sport: 'FOOTBALL' })),
        ...basketball.filter(m => m.status === 'upcoming').map(m => ({ ...m, sport: 'BASKETBALL' })),
        ...volleyball.filter(m => m.status === 'upcoming').map(m => ({ ...m, sport: 'VOLLEYBALL' })),
      ]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8 mt-8">Upcoming Matches</h1>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {upcomingMatches.length === 0 ? (
            <div className="text-slate-400 col-span-2">No upcoming matches found.</div>
          ) : (
            upcomingMatches.map(match => (
              <div key={match._id} className="bg-slate-700/60 rounded-lg p-6 shadow-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{sports.find(s => s.name.toUpperCase() === match.sport)?.emoji}</span>
                  <span className="font-bold text-lg text-slate-200">{match.teams?.map(t => t.name).join(' vs ')}</span>
                </div>
                <div className="text-sm text-slate-400 mb-2">{match.location} | {new Date(match.startTime).toLocaleString()}</div>
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-slate-900 font-semibold text-xs mb-2">UPCOMING</span>
                <button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg mt-2"
                  onClick={() => {
                    let dash = '';
                    if (match.sport === 'BADMINTON') dash = `/badminton/live-score/${match._id}`;
                    else if (match.sport === 'FOOTBALL') dash = `/football/match/${match._id}/score`;
                    else if (match.sport === 'BASKETBALL') dash = `/basketball/match/${match._id}/score`;
                    else if (match.sport === 'VOLLEYBALL') dash = `/volleyball/match/${match._id}/score`;
                    navigate(dash);
                  }}
                >Go Live</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ScoringMatchesPage;

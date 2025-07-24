import React, { useEffect, useState } from 'react';
import TournamentTeamList from '../../components/common/TournamentTeamList';

const VolleyballTournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3002/api/v1/tournament')
      .then(res => res.json())
      .then(data => {
        setTournaments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-400">Loading tournaments...</div>;
  if (!tournaments.length) return <div className="text-slate-400">No tournaments found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">Volleyball Tournaments</h1>
      <div className="space-y-8">
        {tournaments.map(t => (
          <div key={t._id} className="bg-slate-800/70 rounded-xl shadow-lg p-6">
            <div className="mb-2">
              <span className="text-xl font-semibold text-blue-300">{t.name}</span>
              <span className="ml-2 text-xs text-slate-400">({t.type})</span>
            </div>
            <div className="mb-2 text-slate-400 text-sm">{t.startDate ? new Date(t.startDate).toLocaleDateString() : ''} - {t.endDate ? new Date(t.endDate).toLocaleDateString() : ''}</div>
            <div className="mb-2">
              <span className="font-medium text-slate-300">Registered Teams:</span>
              <TournamentTeamList teamIds={t.teams} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolleyballTournamentsPage;

import React, { useEffect, useState } from 'react';

const HostMatchTournamentSelect = ({ selectedTournament, setSelectedTournament, onCreateNew }) => {
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

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-blue-300 mb-1">Tournament/Series</label>
      {loading ? (
        <div className="text-slate-400 text-sm">Loading tournaments...</div>
      ) : (
        <select
          value={selectedTournament || ''}
          onChange={e => setSelectedTournament(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md py-2 px-3 mb-2"
        >
          <option value="">Select Tournament/Series</option>
          {tournaments.map(t => (
            <option key={t._id} value={t._id}>{t.name} ({t.type})</option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={onCreateNew}
        className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
      >
        + Create New Tournament/Series
      </button>
    </div>
  );
};

export default HostMatchTournamentSelect;

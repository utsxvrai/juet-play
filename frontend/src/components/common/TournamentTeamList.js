import React, { useEffect, useState } from 'react';

const TournamentTeamList = ({ teamIds }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      if (!teamIds || teamIds.length === 0) {
        setTeams([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const results = await Promise.all(
        teamIds.map(id =>
          fetch(`http://localhost:3001/api/v1/team/${id}`)
            .then(res => res.json())
            .then(data => data.data)
            .catch(() => null)
        )
      );
      setTeams(results.filter(Boolean));
      setLoading(false);
    }
    fetchTeams();
  }, [teamIds]);

  if (loading) return <div className="text-slate-400">Loading teams...</div>;
  if (!teams.length) return <div className="text-slate-400">No teams registered.</div>;

  return (
    <ul className="divide-y divide-slate-700">
      {teams.map(team => (
        <li key={team._id} className="py-2 flex items-center">
          <span className="font-semibold text-emerald-300 mr-2">{team.name}</span>
          <span className="text-xs text-slate-400">({team.sport})</span>
        </li>
      ))}
    </ul>
  );
};

export default TournamentTeamList;

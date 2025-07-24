import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CricketPageLayout from '../../components/cricket/CricketPageLayout';

const CricketTeamSquadPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3001/api/v1/team/${teamId}`);
        const data = await res.json();
        if (res.ok && data.data) {
          setTeam(data.data);
        } else {
          setError(data.message || 'Failed to fetch team');
        }
      } catch (err) {
        setError('Error connecting to backend');
      }
      setLoading(false);
    };
    fetchTeam();
  }, [teamId]);

  return (
    <CricketPageLayout title={team ? `${team.name} Squad` : 'Team Squad'}>
      <button onClick={() => navigate(-1)} className="mb-6 text-emerald-400 hover:underline">&larr; Back</button>
      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading squad...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-12">{error}</div>
      ) : team ? (
        <div className="bg-slate-800/70 rounded-xl shadow-xl p-6 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <img src={team.logo} alt={team.name} className="w-28 h-28 rounded-full border-4 border-slate-700 mr-0 md:mr-8 mb-4 md:mb-0 object-cover" />
            <div>
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">{team.name}</h2>
              <p className="text-slate-300 mb-1">Manager: {team.manager || 'N/A'}</p>
              <p className="text-slate-300 mb-1">Captain: {team.captain && team.captain.name ? team.captain.name : 'N/A'}</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-emerald-300 mb-4">Squad</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-slate-900/80 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-slate-400">#</th>
                  <th className="px-4 py-2 text-left text-slate-400">Name</th>
                  <th className="px-4 py-2 text-left text-slate-400">Role</th>
                  <th className="px-4 py-2 text-left text-slate-400">Jersey No.</th>
                </tr>
              </thead>
              <tbody>
                {team.players && team.players.length > 0 ? (
                  team.players.map((player, idx) => (
                    <tr key={player._id || idx} className="border-b border-slate-700">
                      <td className="px-4 py-2 text-slate-200">{idx + 1}</td>
                      <td className="px-4 py-2 text-slate-200">{player.name}</td>
                      <td className="px-4 py-2 text-slate-200">{player.role}</td>
                      <td className="px-4 py-2 text-slate-200">{player.jerseyNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center text-slate-400 py-4">No players found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </CricketPageLayout>
  );
};

export default CricketTeamSquadPage;

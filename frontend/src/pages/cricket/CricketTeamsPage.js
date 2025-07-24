import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamListItem from '../../components/cricket/TeamListItem';
import CricketPageLayout from '../../components/cricket/CricketPageLayout';

const CricketTeamsPage = () => {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3001/api/v1/team');
        const data = await res.json();
        if (res.ok && data.data) {
          setTeams(data.data);
        } else {
          setError(data.message || 'Failed to fetch teams');
        }
      } catch (err) {
        setError('Error connecting to backend');
      }
      setLoading(false);
    };
    fetchTeams();
  }, []);

  return (
    <CricketPageLayout title="Cricket Teams">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-emerald-400">Meet the Teams</h2>
        <button 
          onClick={() => navigate('/cricket/teams/add')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add New Team
        </button>
      </div>
      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading teams...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-12">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
          {teams.map(team => (
            <TeamListItem key={team._id} team={team} />
          ))}
        </div>
      )}
    </CricketPageLayout>
  );
};

export default CricketTeamsPage; 
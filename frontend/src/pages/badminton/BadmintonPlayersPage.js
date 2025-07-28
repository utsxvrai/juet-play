import React, { useEffect, useState } from 'react';
import BadmintonPageLayout from '../../components/badminton/BadmintonPageLayout';
import BadmintonPlayerCard from '../../components/badminton/BadmintonPlayerCard';
import { Link } from 'react-router-dom';
import { fetchPlayers } from '../../utils/api';

const BadmintonPlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayers('badminton')
      .then(data => {
        console.log('Players API Response:', data);
        const playersArray = Array.isArray(data) ? data : (data?.data || []);
        setPlayers(playersArray);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching players:', err);
        setError('Failed to load players');
        setPlayers([]);
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <BadmintonPageLayout title="Badminton Players">
        <div className="text-red-400 text-center">{error}</div>
      </BadmintonPageLayout>
    );
  }

  return (
    <BadmintonPageLayout title="Badminton Players">
      <div className="flex justify-end mb-6">
        <Link to="/badminton/players/add" className="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75">
          Add Player
        </Link>
      </div>
      {loading ? (
        <div className="text-slate-400">Loading players...</div>
      ) : players.length === 0 ? (
        <div className="text-slate-400 text-center">No players found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {players.map(player => (
            <BadmintonPlayerCard key={player._id} player={player} />
          ))}
        </div>
      )}
    </BadmintonPageLayout>
  );
};

export default BadmintonPlayersPage; 
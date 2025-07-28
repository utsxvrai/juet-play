import React, { useEffect, useState } from 'react';
import BadmintonPageLayout from '../../components/badminton/BadmintonPageLayout';
import BadmintonPlayerCard from '../../components/badminton/BadmintonPlayerCard';
import { Link } from 'react-router-dom';
import { fetchPlayers } from '../../utils/api';

const BadmintonPlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(6);  // Players per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchPlayers('badminton', { page, limit })
      .then(data => {
        // data is your full API response: { data, total, page, pages }
        setPlayers(data.data);
        setTotalPages(data.pages || 1);
        // console.log(data.pages)
        setLoading(false);
        // console.log('Fetched players data:', data); // For debugging
      })
      .catch(err => {
        console.error('Error fetching players:', err);
        setError('Failed to load players');
        setPlayers([]);
        setLoading(false);
      });
  }, [page, limit]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {players.map(player => (
              <BadmintonPlayerCard key={player._id} player={player} />
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <button onClick={handlePrev} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
              Prev
            </button>
            <span className="flex items-center">Page {page} of {totalPages}</span>
            <button onClick={handleNext} disabled={page === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </>
      )}
    </BadmintonPageLayout>
  );
};

export default BadmintonPlayersPage;

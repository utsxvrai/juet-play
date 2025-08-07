import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import FootballPlayerCard from '../../components/football/FootballPlayerCard';
import FootballNavigation from '../../components/football/FootballNavigation';
import { FOOTBALL_SERVICE_URL } from '../../utils/api';

const FootballPlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // Optimized: 6 players per page for faster loading
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');

  const fetchPlayers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/player?page=${pageNum}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      const data = await response.json();
      setPlayers(data.data || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers(page);
  }, [page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  if (error) {
    return (
      <FootballPageLayout title="Football Players">
        <div className="text-center text-red-400">
          <p>Error: {error}</p>
          <button 
            onClick={() => fetchPlayers(page)}
            className="mt-4 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </FootballPageLayout>
    );
  }

  return (
    <FootballPageLayout title="Football Players">
      <FootballNavigation />
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="all">All Positions</option>
            <option value="goalkeeper">Goalkeeper</option>
            <option value="defender">Defender</option>
            <option value="midfielder">Midfielder</option>
            <option value="forward">Forward</option>
          </select>
        </div>
        <Link
          to="/football/players/add"
          className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Add Player
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="mt-2 text-slate-400">Loading players...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPlayers.map((player) => (
              <FootballPlayerCard key={player._id} player={player} />
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No players found.</p>
            </div>
          )}

          {/* Optimized Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-4 mt-6">
              <button 
                onClick={handlePrev} 
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="flex items-center">Page {page} of {totalPages}</span>
              <button 
                onClick={handleNext} 
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </FootballPageLayout>
  );
};

export default FootballPlayersPage; 
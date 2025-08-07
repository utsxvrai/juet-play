import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import FootballMatchCard from '../../components/football/FootballMatchCard';
import FootballNavigation from '../../components/football/FootballNavigation';
import { FOOTBALL_SERVICE_URL } from '../../utils/api';

const FootballMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // Optimized: 6 matches per page for faster loading
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMatches = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/match?page=${pageNum}&limit=${limit}`);
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      const data = await response.json();
      setMatches(data.data || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(page);
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

  const filteredMatches = matches.filter(match => {
    return statusFilter === 'all' || match.status === statusFilter;
  });

  if (error) {
    return (
      <FootballPageLayout title="Football Matches">
        <div className="text-center text-red-400">
          <p>Error: {error}</p>
          <button 
            onClick={() => fetchMatches(page)}
            className="mt-4 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </FootballPageLayout>
    );
  }

  return (
    <FootballPageLayout title="Football Matches">
      <FootballNavigation statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="mt-2 text-slate-400">Loading matches...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredMatches.map((match) => (
              <FootballMatchCard key={match._id} match={match} />
            ))}
          </div>

          {filteredMatches.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No matches found.</p>
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

export default FootballMatchesPage; 
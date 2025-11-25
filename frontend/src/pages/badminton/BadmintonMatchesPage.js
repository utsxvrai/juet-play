import React, { useEffect, useState } from 'react';
import BadmintonPageLayout from '../../components/badminton/BadmintonPageLayout';
import BadmintonMatchCard from '../../components/badminton/BadmintonMatchCard';
import { Link } from 'react-router-dom';
import { fetchMatchesBySport } from '../../utils/api';

const BadmintonMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // fixed 6 per page
  const [totalPages, setTotalPages] = useState(1);

  const loadMatches = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const data = await fetchMatchesBySport('badminton', { page, limit });
      
      // Ensure matchesArray is always an array
      const matchesArray = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];
          
      setMatches(matchesArray);
      setTotalPages(data.pages || 1);
      setError('');
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches. Please try again.');
      setMatches([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and when page changes
  useEffect(() => {
    loadMatches();
  }, [page, limit]);

  // CRITICAL FIX: Auto-refresh every 30 seconds to show newly created matches
  // This compensates for any cache issues and keeps the list up-to-date
  useEffect(() => {
    const interval = setInterval(() => {
      loadMatches(true); // Silent refresh without showing loading state
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [page, limit]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleManualRefresh = () => {
    loadMatches(true);
  };

  if (error) {
    return (
      <BadmintonPageLayout title="Badminton Games">
        <div className="text-red-400 text-center mb-4">{error}</div>
        <div className="text-center">
          <button 
            onClick={handleManualRefresh}
            className="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </BadmintonPageLayout>
    );
  }

  return (
    <BadmintonPageLayout title="Badminton Games">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <Link to="/badminton/players/add" className="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75">
            Add Player
          </Link>
          <Link to="/badminton/live-scoring" className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
            Live Scoring
          </Link>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {refreshing ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      
      {loading ? (
        <div className="text-slate-400">Loading matches...</div>
      ) : matches.length === 0 ? (
        <div className="text-slate-400 text-center">No matches found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {matches.map(match => (
              <BadmintonMatchCard key={match._id} match={match} />
            ))}
          </div>
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
        </>
      )}
    </BadmintonPageLayout>
  );
};

export default BadmintonMatchesPage;

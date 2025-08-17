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
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMatches = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/match?page=${pageNum}&limit=${limit}`);

      console.log('Matches API response:', response);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Matches API response:', data);
      console.log('Response type:', typeof data);
      console.log('Is array?', Array.isArray(data));
      console.log('Has data property?', data && data.hasOwnProperty('data'));
      console.log('Data.data type:', data && typeof data.data);
      console.log('Data.data is array?', data && Array.isArray(data.data));
      
      let processedMatches = [];
      let processedTotalPages = 1;
      let processedTotalMatches = 0;
      
      // Handle different response structures
      if (data && data.data && Array.isArray(data.data)) {
        // Standard response format with pagination
        processedMatches = data.data;
        processedTotalPages = data.pages || 1;
        processedTotalMatches = data.total || data.data.length;
        console.log('Using data.data format');
      } else if (Array.isArray(data)) {
        // Direct array response
        processedMatches = data;
        processedTotalPages = 1;
        processedTotalMatches = data.length;
        console.log('Using direct array format');
      } else if (data && Array.isArray(data.matches)) {
        // Alternative response format
        processedMatches = data.matches;
        processedTotalPages = data.pages || 1;
        processedTotalMatches = data.total || data.matches.length;
        console.log('Using data.matches format');
      } else {
        // Fallback - empty array
        console.warn('Unexpected response format:', data);
        processedMatches = [];
        processedTotalPages = 1;
        processedTotalMatches = 0;
      }
      
      console.log('Setting state with:', {
        matches: processedMatches,
        totalPages: processedTotalPages,
        totalMatches: processedTotalMatches
      });
      
      setMatches(processedMatches);
      setTotalPages(processedTotalPages);
      setTotalMatches(processedTotalMatches);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err.message);
      setMatches([]);
      setTotalPages(1);
      setTotalMatches(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  const filteredMatches = matches.filter(match => {
    if (statusFilter === 'all') return true;
    return match.status && match.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const resetToFirstPage = () => {
    setPage(1);
    fetchMatches(1);
  };

  if (error) {
    return (
      <FootballPageLayout title="Football Matches">
        <div className="text-center text-red-400 py-8">
          <p className="text-lg mb-4">Error: {error}</p>
          <button 
            onClick={resetToFirstPage}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
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

      {/* Status Summary */}
      <div className="mb-6 text-center text-slate-400">
        <p>Showing {filteredMatches.length} of {totalMatches} matches</p>
        {totalPages > 1 && (
          <p className="text-sm">Page {page} of {totalPages}</p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="mt-2 text-slate-400">Loading matches...</p>
        </div>
      ) : (
        <>
          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredMatches.map((match) => (
                <FootballMatchCard key={match._id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 text-lg">No matches found.</p>
              {statusFilter !== 'all' && (
                <button 
                  onClick={() => setStatusFilter('all')}
                  className="mt-2 text-green-400 hover:text-green-300 underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}

          {/* Improved Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
              <button 
                onClick={handlePrev} 
                disabled={page === 1}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        pageNum === page
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={handleNext} 
                disabled={page === totalPages}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </FootballPageLayout>
  );
};

export default FootballMatchesPage; 
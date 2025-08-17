import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import FootballTeamCard from '../../components/football/FootballTeamCard';
import FootballNavigation from '../../components/football/FootballNavigation';
import { FOOTBALL_SERVICE_URL } from '../../utils/api';

const FootballTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // Optimized: 6 teams per page for faster loading
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');

  const fetchTeams = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/team?page=${pageNum}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      const data = await response.json();
      setTeams(data.data || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams(page);
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

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.coach.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === 'all' || team.country.toLowerCase() === countryFilter.toLowerCase();
    return matchesSearch && matchesCountry;
  });

  // Get unique countries for filter
  const uniqueCountries = [...new Set(teams.map(team => team.country))].sort();

  if (error) {
    return (
      <FootballPageLayout title="Football Teams">
        <div className="text-center text-red-400">
          <p>Error: {error}</p>
          <button 
            onClick={() => fetchTeams(page)}
            className="mt-4 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </FootballPageLayout>
    );
  }

  return (
    <FootballPageLayout title="Football Teams">
      <FootballNavigation />
      <div className="mb-6 flex justify-center">
        <div className="flex gap-4 w-full sm:w-auto max-w-md">
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="all">All Countries</option>
            {uniqueCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="mt-2 text-slate-400">Loading teams...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTeams.map((team) => (
              <FootballTeamCard key={team._id} team={team} />
            ))}
          </div>

          {filteredTeams.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No teams found.</p>
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

export default FootballTeamsPage; 
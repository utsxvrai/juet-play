import React, { useEffect, useState } from 'react';
import BadmintonPageLayout from '../../components/badminton/BadmintonPageLayout';
import BadmintonMatchCard from '../../components/badminton/BadmintonMatchCard';
import { Link } from 'react-router-dom';

import { fetchMatchesBySport } from '../../utils/api';

const BadmintonMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatchesBySport('badminton')
      .then(data => {
        console.log('API Response:', data);
        // Ensure data is an array
        const matchesArray = Array.isArray(data) ? data : (data?.data || []);
        setMatches(matchesArray);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches');
        setMatches([]);
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <BadmintonPageLayout title="Badminton Games">
        <div className="text-red-400 text-center">{error}</div>
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
      </div>
      {loading ? (
        <div className="text-slate-400">Loading matches...</div>
      ) : matches.length === 0 ? (
        <div className="text-slate-400 text-center">No matches found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {matches.map(match => (
            <BadmintonMatchCard key={match._id} match={match} />
          ))}
        </div>
      )}
    </BadmintonPageLayout>
  );
};

export default BadmintonMatchesPage; 
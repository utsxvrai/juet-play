import React, { useEffect, useState } from 'react';
import VolleyballPageLayout from '../../components/volleyball/VolleyballPageLayout';
import VolleyballMatchCard from '../../components/volleyball/VolleyballMatchCard';

import { fetchMatchesBySport } from '../../utils/api';

const VolleyballMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchesBySport('VOLLEYBALL')
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <VolleyballPageLayout title="Volleyball Matches">
      {loading ? (
        <div className="text-slate-400">Loading matches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {matches.map(match => (
            <VolleyballMatchCard key={match._id} match={match} />
          ))}
        </div>
      )}
    </VolleyballPageLayout>
  );
};

export default VolleyballMatchesPage; 
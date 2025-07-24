import React, { useEffect, useState } from 'react';
import BasketballPageLayout from '../../components/basketball/BasketballPageLayout';
import BasketballMatchCard from '../../components/basketball/BasketballMatchCard';

import { fetchMatchesBySport } from '../../utils/api';

const BasketballMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchesBySport('BASKETBALL')
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <BasketballPageLayout title="Basketball Games">
      {loading ? (
        <div className="text-slate-400">Loading matches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {matches.map(match => (
            <BasketballMatchCard key={match._id} match={match} />
          ))}
        </div>
      )}
    </BasketballPageLayout>
  );
};

export default BasketballMatchesPage; 
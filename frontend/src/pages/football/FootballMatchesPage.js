import React, { useEffect, useState } from 'react';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import FootballMatchCard from '../../components/football/FootballMatchCard';

import { fetchMatchesBySport } from '../../utils/api';

const FootballMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchesBySport('FOOTBALL')
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <FootballPageLayout title="Football Matches">
      {loading ? (
        <div className="text-slate-400">Loading matches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {matches.map(match => (
            <FootballMatchCard key={match._id} match={match} />
          ))}
        </div>
      )}
    </FootballPageLayout>
  );
};

export default FootballMatchesPage; 
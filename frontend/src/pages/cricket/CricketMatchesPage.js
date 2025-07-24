import React, { useEffect, useState } from 'react';
import MatchCard from '../../components/cricket/MatchCard'; 
import CricketPageLayout from '../../components/cricket/CricketPageLayout';

import { fetchMatchesBySport } from '../../utils/api';

const CricketMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchesBySport('CRICKET')
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <CricketPageLayout title="Cricket Matches">
      {loading ? (
        <div className="text-slate-400">Loading matches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {matches.map(match => {
            // Map backend format to MatchCard props
            const teamA = match.teams?.[0] ? {
              name: match.teams[0].name || '',
              score: (match.teams[0].score?.runs !== undefined && match.teams[0].score?.wickets !== undefined)
                ? `${match.teams[0].score.runs}/${match.teams[0].score.wickets}`
                : (typeof match.teams[0].score === 'string' ? match.teams[0].score : ''),
              logo: match.teams[0].logo || '',
            } : { name: '', score: '', logo: '' };
            const teamB = match.teams?.[1] ? {
              name: match.teams[1].name || '',
              score: (match.teams[1].score?.runs !== undefined && match.teams[1].score?.wickets !== undefined)
                ? `${match.teams[1].score.runs}/${match.teams[1].score.wickets}`
                : (typeof match.teams[1].score === 'string' ? match.teams[1].score : ''),
              logo: match.teams[1].logo || '',
            } : { name: '', score: '', logo: '' };
            const overs = match.teams?.[0]?.score?.overs !== undefined ? match.teams[0].score.overs : '';
            return (
              <MatchCard
                key={match._id}
                match={{
                  id: match._id,
                  status: match.status?.toUpperCase() || 'UPCOMING',
                  series: match.location || '',
                  teamA,
                  teamB,
                  overs,
                  summary: '',
                }}
              />
            );
          })}
        </div>
      )}
    </CricketPageLayout>
  );
};

export default CricketMatchesPage; 
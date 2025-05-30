import React from 'react';
import VolleyballPageLayout from '../../components/volleyball/VolleyballPageLayout';
import VolleyballMatchCard from '../../components/volleyball/VolleyballMatchCard';

const VolleyballMatchesPage = () => {
  // Sample data for Volleyball
  const matches = [
    {
      id: 1,
      status: 'LIVE',
      tournament: 'National League - Set 3',
      teamA: { name: 'Eagles VC', setsWon: 1, currentSetScore: 20, logo: 'https://via.placeholder.com/40/FFC107/000000?Text=EVC' },
      teamB: { name: 'Titans Club', setsWon: 1, currentSetScore: 18, logo: 'https://via.placeholder.com/40/03A9F4/FFFFFF?Text=TTC' },
      currentSet: 3,
      summary: 'Eagles leading by 2 points in the crucial third set.',
    },
    {
      id: 2,
      status: 'UPCOMING',
      tournament: 'University Championship - Final',
      teamA: { name: 'JUET Spikers', setsWon: 0, currentSetScore: 0, logo: 'https://via.placeholder.com/40/4CAF50/FFFFFF?Text=JST' },
      teamB: { name: 'JIIT Warriors', setsWon: 0, currentSetScore: 0, logo: 'https://via.placeholder.com/40/F44336/FFFFFF?Text=JWT' },
      currentSet: 1,
      summary: 'The much-awaited final starts in 1 hour!',
    },
  ];

  return (
    <VolleyballPageLayout title="Volleyball Matches">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {matches.map(match => (
          <VolleyballMatchCard key={match.id} match={match} />
        ))}
      </div>
    </VolleyballPageLayout>
  );
};

export default VolleyballMatchesPage; 
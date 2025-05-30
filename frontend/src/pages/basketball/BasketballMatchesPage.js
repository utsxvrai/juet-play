import React from 'react';
import BasketballPageLayout from '../../components/basketball/BasketballPageLayout';
import BasketballMatchCard from '../../components/basketball/BasketballMatchCard';

const BasketballMatchesPage = () => {
  // Sample data for Basketball
  const matches = [
    {
      id: 1,
      status: 'LIVE',
      league: 'NBA Season - Q3',
      teamA: { name: 'LA Lakers', score: 88, logo: 'https://via.placeholder.com/40/552583/FDB927?Text=LAL' },
      teamB: { name: 'Boston Celtics', score: 85, logo: 'https://via.placeholder.com/40/007A33/FFFFFF?Text=BOS' },
      quarter: 3,
      timeRemaining: '02:15',
      summary: 'Tight game! LeBron just hit a 3-pointer.',
    },
    {
      id: 2,
      status: 'UPCOMING',
      league: 'College Championship',
      teamA: { name: 'Duke Blue Devils', score: null, logo: 'https://via.placeholder.com/40/003087/FFFFFF?Text=DUKE' },
      teamB: { name: 'UNC Tar Heels', score: null, logo: 'https://via.placeholder.com/40/7BAFD4/FFFFFF?Text=UNC' },
      quarter: null,
      timeRemaining: 'Tomorrow 7 PM',
      summary: 'Classic rivalry! The final showdown for the championship.',
    },
     {
      id: 3,
      status: 'ENDED',
      league: 'EuroLeague Regular Season',
      teamA: { name: 'Real Madrid BK', score: 95, logo: 'https://via.placeholder.com/40/00529F/FEBE10?Text=RMB' },
      teamB: { name: 'FC Barcelona BK', score: 92, logo: 'https://via.placeholder.com/40/A50044/EDBB00?Text=BARBK' },
      quarter: 4,
      timeRemaining: '00:00',
      summary: 'Real Madrid clinches a narrow victory in El Clásico.',
    },
  ];

  return (
    <BasketballPageLayout title="Basketball Games">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {matches.map(match => (
          <BasketballMatchCard key={match.id} match={match} />
        ))}
      </div>
    </BasketballPageLayout>
  );
};

export default BasketballMatchesPage; 
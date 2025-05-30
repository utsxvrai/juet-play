import React from 'react';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import FootballMatchCard from '../../components/football/FootballMatchCard';

const FootballMatchesPage = () => {
  // Sample data - replace with API call later
  const matches = [
    {
      id: 1,
      status: 'LIVE',
      league: 'Premier League',
      teamA: { name: 'Manchester United', score: 1, logo: 'https://via.placeholder.com/40/DA291C/FFFFFF?Text=MUN' },
      teamB: { name: 'Liverpool FC', score: 1, logo: 'https://via.placeholder.com/40/C8102E/FFFFFF?Text=LIV' },
      time: '75',
      summary: 'Intense match! Rashford just scored an equalizer.',
    },
    {
      id: 2,
      status: 'HALF-TIME',
      league: 'La Liga',
      teamA: { name: 'Real Madrid', score: 0, logo: 'https://via.placeholder.com/40/FEBE10/00529F?Text=RMA' },
      teamB: { name: 'FC Barcelona', score: 0, logo: 'https://via.placeholder.com/40/A50044/EDBB00?Text=BAR' },
      time: '45',
      summary: 'Goalless at the break, but plenty of chances for both sides.',
    },
    {
      id: 3,
      status: 'UPCOMING',
      league: 'Serie A',
      teamA: { name: 'Juventus FC', score: null, logo: 'https://via.placeholder.com/40/000000/FFFFFF?Text=JUV' },
      teamB: { name: 'Inter Milan', score: null, logo: 'https://via.placeholder.com/40/0068A8/FFFFFF?Text=INT' },
      time: 'KO 20:00',
      summary: 'Derby d\'Italia! Kicks off tonight at 8 PM.',
    },
  ];

  return (
    <FootballPageLayout title="Football Matches">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {matches.map(match => (
          <FootballMatchCard key={match.id} match={match} />
        ))}
      </div>
    </FootballPageLayout>
  );
};

export default FootballMatchesPage; 
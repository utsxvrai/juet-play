import React from 'react';
import MatchCard from '../../components/cricket/MatchCard'; 
import CricketPageLayout from '../../components/cricket/CricketPageLayout';

const CricketMatchesPage = () => {
  // Sample data - replace with API call later
  const liveMatches = [
    {
      id: 1,
      status: 'LIVE',
      series: 'ODI Series - Match 3 of 5',
      teamA: { name: 'India Kings XI', score: '178/3', logo: 'https://via.placeholder.com/40/0000FF/FFFFFF?Text=IND' },
      teamB: { name: 'Australia Super Giants', score: ' ', logo: 'https://via.placeholder.com/40/FF0000/FFFFFF?Text=AUS' },
      overs: '20.0',
      summary: 'India needs 50 runs in 30 balls to win the match and the series.',
    },
    {
      id: 2,
      status: 'LIVE',
      series: 'T20 Domestic League - Final',
      teamA: { name: 'Chennai Super Kings', score: '205/4', logo: 'https://via.placeholder.com/40/FFFF00/000000?Text=CSK' },
      teamB: { name: 'Mumbai Indians', score: '180/7', logo: 'https://via.placeholder.com/40/0033CC/FFFFFF?Text=MI' },
      overs: '18.2',
      summary: 'Mumbai Indians require 26 runs in 10 balls. What a thriller!',
    },
    {
      id: 3,
      status: 'UPCOMING',
      series: 'World Test Championship - 1st Test',
      teamA: { name: 'England Lions', score: '', logo: 'https://via.placeholder.com/40/FFCCCC/000000?Text=ENG' },
      teamB: { name: 'New Zealand Kiwis', score: '', logo: 'https://via.placeholder.com/40/000000/FFFFFF?Text=NZ' },
      overs: '',
      summary: 'Match starts tomorrow at 9:00 AM local time. Pitch looks green.',
    },
     {
      id: 4,
      status: 'RECENT',
      series: 'Bilateral T20 Series - Match 5',
      teamA: { name: 'Pakistan Shaheens', score: '190/5', logo: 'https://via.placeholder.com/40/006400/FFFFFF?Text=PAK' },
      teamB: { name: 'South Africa Proteas', score: '191/4', logo: 'https://via.placeholder.com/40/008000/FFFFFF?Text=RSA' },
      overs: '19.4',
      summary: 'South Africa won by 6 wickets with 2 balls remaining.',
    },
  ];

  return (
    <CricketPageLayout title="Cricket Matches">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {liveMatches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </CricketPageLayout>
  );
};

export default CricketMatchesPage; 
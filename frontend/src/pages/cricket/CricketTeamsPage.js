import React from 'react';
import TeamListItem from '../../components/cricket/TeamListItem';
import CricketPageLayout from '../../components/cricket/CricketPageLayout';

const CricketTeamsPage = () => {
  // Sample data - replace with API call later
  const teams = [
    { id: 1, name: 'India National Team', captain: 'Rohit G. Sharma', coach: 'Rahul S. Dravid', logo: 'https://via.placeholder.com/80/0000FF/FFFFFF?Text=IND' },
    { id: 2, name: 'Australia National Team', captain: 'Patrick J. Cummins', coach: 'Andrew G. McDonald', logo: 'https://via.placeholder.com/80/FFDF00/000000?Text=AUS' },
    { id: 3, name: 'England Lions', captain: 'Joseph C. Buttler', coach: 'Matthew P. Mott', logo: 'https://via.placeholder.com/80/CF142B/FFFFFF?Text=ENG' },
    { id: 4, name: 'Pakistan Shaheens', captain: 'Babar Azam', coach: 'Saqlain Mushtaq', logo: 'https://via.placeholder.com/80/006400/FFFFFF?Text=PAK' },
    { id: 5, name: 'New Zealand Kiwis', captain: 'Kane S. Williamson', coach: 'Gary Stead', logo: 'https://via.placeholder.com/80/000000/FFFFFF?Text=NZ' },
    { id: 6, name: 'South Africa Proteas', captain: 'Temba Bavuma', coach: 'Shukri Conrad', logo: 'https://via.placeholder.com/80/008000/FFFFFF?Text=RSA' },
  ];

  return (
    <CricketPageLayout title="Cricket Teams">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        {teams.map(team => (
          <TeamListItem key={team.id} team={team} />
        ))}
      </div>
    </CricketPageLayout>
  );
};

export default CricketTeamsPage; 
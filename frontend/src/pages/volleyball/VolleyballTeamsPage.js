import React from 'react';
import VolleyballPageLayout from '../../components/volleyball/VolleyballPageLayout';
import VolleyballTeamListItem from '../../components/volleyball/VolleyballTeamListItem';

const VolleyballTeamsPage = () => {
  // Sample data for Volleyball Teams
  const teams = [
    {
      id: 1, name: 'Eagles VC', coach: 'Alex Johnson', 
      homeCourt: 'City Sports Arena', logo: 'https://via.placeholder.com/40/FFC107/000000?Text=EVC'
    },
    {
      id: 2, name: 'Titans Club', coach: 'Maria Rodriguez', 
      homeCourt: 'National Volleyball Center', logo: 'https://via.placeholder.com/40/03A9F4/FFFFFF?Text=TTC'
    },
    {
      id: 3, name: 'JUET Spikers', coach: 'Dr. Anirban Das', 
      homeCourt: 'JUET Volleyball Court', logo: 'https://via.placeholder.com/40/4CAF50/FFFFFF?Text=JST' 
    },
  ];

  return (
    <VolleyballPageLayout title="Volleyball Teams">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        {teams.map(team => (
          <VolleyballTeamListItem key={team.id} team={team} />
        ))}
      </div>
    </VolleyballPageLayout>
  );
};

export default VolleyballTeamsPage; 
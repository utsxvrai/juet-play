import React from 'react';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import FootballTeamListItem from '../../components/football/FootballTeamListItem';

const FootballTeamsPage = () => {
  // Sample data - replace with API call later
  const teams = [
    {
      id: 1, name: 'Manchester United', manager: 'Erik ten Hag', 
      stadium: 'Old Trafford', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png'
    },
    {
      id: 2, name: 'Liverpool FC', manager: 'Jürgen Klopp', 
      stadium: 'Anfield', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png'
    },
    {
      id: 3, name: 'Real Madrid C.F.', manager: 'Carlo Ancelotti', 
      stadium: 'Santiago Bernabéu', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png' 
    },
    // Add more sample teams with real logo URLs if possible
  ];

  return (
    <FootballPageLayout title="Football Clubs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        {teams.map(team => (
          <FootballTeamListItem key={team.id} team={team} />
        ))}
      </div>
    </FootballPageLayout>
  );
};

export default FootballTeamsPage; 
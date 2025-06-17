import React from 'react';
import { useNavigate } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import FootballTeamListItem from '../../components/football/FootballTeamListItem';

const FootballTeamsPage = () => {
  const navigate = useNavigate();

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
    <FootballPageLayout title="Football Teams">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-teal-400">Participating Clubs</h2>
        <button 
          onClick={() => navigate('/football/teams/add')}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add New Club
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        {teams.map(team => (
          <FootballTeamListItem key={team.id} team={team} />
        ))}
      </div>
    </FootballPageLayout>
  );
};

export default FootballTeamsPage; 
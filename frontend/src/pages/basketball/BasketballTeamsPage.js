import React from 'react';
import { useNavigate } from 'react-router-dom';
import BasketballPageLayout from '../../components/basketball/BasketballPageLayout';
import BasketballTeamListItem from '../../components/basketball/BasketballTeamListItem';

const BasketballTeamsPage = () => {
  const navigate = useNavigate();

  // Sample data - replace with API call later
  const teams = [
    {
      id: 1, name: 'Los Angeles Lakers', coach: 'Darvin Ham', 
      city: 'Los Angeles', conference: 'Western',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/1200px-Los_Angeles_Lakers_logo.svg.png'
    },
    {
      id: 2, name: 'Boston Celtics', coach: 'Joe Mazzulla', 
      city: 'Boston', conference: 'Eastern',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/1200px-Boston_Celtics.svg.png'
    },
    {
      id: 3, name: 'Golden State Warriors', coach: 'Steve Kerr', 
      city: 'San Francisco', conference: 'Western',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/1200px-Golden_State_Warriors_logo.svg.png'
    },
    // Add more sample teams with real logo URLs if possible
  ];

  return (
    <BasketballPageLayout title="Basketball Teams">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-orange-400">The Rosters</h2>
        <button 
          onClick={() => navigate('/basketball/teams/add')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add New Team
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        {teams.map(team => (
          <BasketballTeamListItem key={team.id} team={team} />
        ))}
      </div>
    </BasketballPageLayout>
  );
};

export default BasketballTeamsPage; 
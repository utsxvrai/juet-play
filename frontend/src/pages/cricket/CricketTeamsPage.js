import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeamListItem from '../../components/cricket/TeamListItem';
import CricketPageLayout from '../../components/cricket/CricketPageLayout';

const CricketTeamsPage = () => {
  const navigate = useNavigate();

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
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-emerald-400">Meet the Teams</h2>
        <button 
          onClick={() => navigate('/cricket/teams/add')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add New Team
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        {teams.map(team => (
          <TeamListItem key={team.id} team={team} />
        ))}
      </div>
    </CricketPageLayout>
  );
};

export default CricketTeamsPage; 
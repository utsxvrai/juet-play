import React from 'react';
import { useNavigate } from 'react-router-dom';
import VolleyballPageLayout from '../../components/volleyball/VolleyballPageLayout';
import VolleyballTeamListItem from '../../components/volleyball/VolleyballTeamListItem';

const VolleyballTeamsPage = () => {
  const navigate = useNavigate();

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
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-indigo-400">National & Club Teams</h2>
        <button 
          onClick={() => navigate('/volleyball/teams/add')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add New Team
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
        {teams.map(team => (
          <VolleyballTeamListItem key={team.id} team={team} />
        ))}
      </div>
    </VolleyballPageLayout>
  );
};

export default VolleyballTeamsPage; 
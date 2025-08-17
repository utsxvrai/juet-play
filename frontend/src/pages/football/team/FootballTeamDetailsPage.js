import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FootballPageLayout from '../../../components/football/FootballPageLayout';
import { FOOTBALL_SERVICE_URL } from '../../../utils/api';

const FootballTeamDetailsPage = () => {
  const { teamId } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Squad'); // Default tab

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch team details
      const teamResponse = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/team/${teamId}`);
      if (!teamResponse.ok) {
        throw new Error('Failed to fetch team details');
      }
      const teamData = await teamResponse.json();
      setTeamDetails(teamData.data || teamData);

      // Fetch team players
      if (teamData.data?.players && teamData.data.players.length > 0) {
        const playerPromises = teamData.data.players.map(async (playerId) => {
          const playerResponse = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/player/${playerId}`);
          if (playerResponse.ok) {
            const playerData = await playerResponse.json();
            return playerData.data || playerData;
          }
          return null;
        });
        
        const playerResults = await Promise.all(playerPromises);
        setPlayers(playerResults.filter(p => p));
      } else {
        setPlayers([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching team details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <FootballPageLayout title="Team Details">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="mt-2 text-slate-400">Loading team details...</p>
        </div>
      </FootballPageLayout>
    );
  }

  if (error) {
    return (
      <FootballPageLayout title="Team Details">
        <div className="text-center text-red-400">
          <p>Error: {error}</p>
          <button 
            onClick={fetchTeamDetails}
            className="mt-4 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </FootballPageLayout>
    );
  }

  if (!teamDetails) {
    return (
      <FootballPageLayout title="Team Details">
        <div className="text-center text-slate-400">
          <p>Team not found</p>
        </div>
      </FootballPageLayout>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Squad':
        return (
          <div className="bg-slate-800/50 rounded-lg shadow p-4 md:p-6">
            <h3 className="text-xl text-teal-300 mb-4">Squad List</h3>
            {players.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <p>No players found for this team.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-teal-300 uppercase tracking-wider">#</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-teal-300 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-teal-300 uppercase tracking-wider hidden sm:table-cell">Position</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-teal-300 uppercase tracking-wider hidden sm:table-cell">Age</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-teal-300 uppercase tracking-wider hidden sm:table-cell">Country</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {players.map(player => (
                      <tr key={player._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-3 py-2 whitespace-nowrap text-slate-300">{player.jerseyNumber}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-slate-100 font-medium">{player.name}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-slate-300 hidden sm:table-cell capitalize">{player.position}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-slate-300 hidden sm:table-cell">{player.age}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-slate-300 hidden sm:table-cell">{player.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'Info':
         return (
          <div className="bg-slate-800/50 rounded-lg shadow p-4 md:p-6 space-y-3">
            <h3 className="text-xl text-teal-300 mb-2">Team Information</h3>
            <p><span className="font-semibold text-slate-300">Coach:</span> <span className="text-slate-200">{teamDetails.coach || 'N/A'}</span></p>
            <p><span className="font-semibold text-slate-300">Country:</span> <span className="text-slate-200">{teamDetails.country || 'N/A'}</span></p>
            <p><span className="font-semibold text-slate-300">Players:</span> <span className="text-slate-200">{players.length}</span></p>
            <p><span className="font-semibold text-slate-300">Wins:</span> <span className="text-slate-200">{teamDetails.wins || 0}</span></p>
            <p><span className="font-semibold text-slate-300">Losses:</span> <span className="text-slate-200">{teamDetails.losses || 0}</span></p>
            <p><span className="font-semibold text-slate-300">Draws:</span> <span className="text-slate-200">{teamDetails.draws || 0}</span></p>
            <p><span className="font-semibold text-slate-300">Created:</span> <span className="text-slate-200">{teamDetails.createdAt ? new Date(teamDetails.createdAt).toLocaleDateString() : 'N/A'}</span></p>
          </div>
         );
      // Add cases for 'Fixtures', 'Results' etc. later
      default:
        return null;
    }
  }

  const tabStyles = "py-2 px-4 sm:px-6 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap";
  const activeTabStyles = "text-teal-400 border-b-2 border-teal-400";
  const inactiveTabStyles = "text-slate-400 hover:text-teal-300";

  return (
    <FootballPageLayout title={teamDetails.name}>
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl md:text-6xl text-teal-400 font-bold">
            {teamDetails.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mb-6 sm:mb-8 border-b border-slate-700">
        <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-1 sm:gap-x-4">
          {['Squad', 'Info', 'Fixtures', 'Results'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`${tabStyles} ${activeTab === tab ? activeTabStyles : inactiveTabStyles}`}
              disabled={['Fixtures', 'Results'].includes(tab)} // Disable unimplemented tabs
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="fade-in">
        {renderTabContent()}
      </div>
    </FootballPageLayout>
  );
};

export default FootballTeamDetailsPage; 
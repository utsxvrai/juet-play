import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FootballPageLayout from '../../../components/football/FootballPageLayout';

// Sample Team Data (to be fetched based on teamId)
const sampleTeamData = {
  '1': {
    id: 1, name: 'Manchester United', manager: 'Erik ten Hag', 
    stadium: 'Old Trafford', country: 'England', founded: '1878',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/200px-Manchester_United_FC_crest.svg.png',
    squad: [
      { number: 24, name: 'André Onana', position: 'Goalkeeper' },
      { number: 20, name: 'Diogo Dalot', position: 'Defender' },
      { number: 19, name: 'Raphaël Varane', position: 'Defender' },
      { number: 6, name: 'Lisandro Martínez', position: 'Defender' },
      { number: 23, name: 'Luke Shaw', position: 'Defender' },
      { number: 18, name: 'Casemiro', position: 'Midfielder' },
      { number: 37, name: 'Kobbie Mainoo', position: 'Midfielder' },
      { number: 17, name: 'Alejandro Garnacho', position: 'Forward' },
      { number: 8, name: 'Bruno Fernandes (c)', position: 'Midfielder' },
      { number: 10, name: 'Marcus Rashford', position: 'Forward' },
      { number: 11, name: 'Rasmus Højlund', position: 'Forward' },
      // Add more players
    ],
    // Could add recent_form, upcoming_matches, etc.
  },
  '2': { // Liverpool FC
    id: 2, name: 'Liverpool FC', manager: 'Jürgen Klopp', 
    stadium: 'Anfield', country: 'England', founded: '1892',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/200px-Liverpool_FC.svg.png',
    squad: [
      { number: 1, name: 'Alisson Becker', position: 'Goalkeeper'},
      { number: 66, name: 'Trent Alexander-Arnold', position: 'Defender'},
      // ... more players
    ]
  },
  // Add more teams by ID
};

const FootballTeamDetailsPage = () => {
  const { teamId } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('Squad'); // Default tab

  useEffect(() => {
    // Simulate API call
    setTeamDetails(sampleTeamData[teamId] || null);
  }, [teamId]);

  if (!teamDetails) {
    return <FootballPageLayout><div className="text-center text-xl p-10">Loading team details...</div></FootballPageLayout>;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Squad':
        return (
          <div className="bg-slate-800/50 rounded-lg shadow p-4 md:p-6">
            <h3 className="text-xl text-teal-300 mb-4">Squad List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-teal-300 uppercase tracking-wider">#</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-teal-300 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-teal-300 uppercase tracking-wider hidden sm:table-cell">Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {teamDetails.squad.map(player => (
                    <tr key={player.number} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300">{player.number}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-100 font-medium">{player.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300 hidden sm:table-cell">{player.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Info':
         return (
          <div className="bg-slate-800/50 rounded-lg shadow p-4 md:p-6 space-y-3">
            <h3 className="text-xl text-teal-300 mb-2">Team Information</h3>
            <p><span className="font-semibold text-slate-300">Manager:</span> <span className="text-slate-200">{teamDetails.manager}</span></p>
            <p><span className="font-semibold text-slate-300">Stadium:</span> <span className="text-slate-200">{teamDetails.stadium}</span></p>
            <p><span className="font-semibold text-slate-300">Country:</span> <span className="text-slate-200">{teamDetails.country}</span></p>
            <p><span className="font-semibold text-slate-300">Founded:</span> <span className="text-slate-200">{teamDetails.founded}</span></p>
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
        <img src={teamDetails.logo} alt={`${teamDetails.name} logo`} className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4" />
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
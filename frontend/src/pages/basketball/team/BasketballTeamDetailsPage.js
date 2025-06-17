import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BasketballPageLayout from '../../../components/basketball/BasketballPageLayout';

const sampleTeamData = {
  '1': {
    id: 1, name: 'Los Angeles Lakers', coach: 'Darvin Ham',
    arena: 'Crypto.com Arena', conference: 'Western',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/200px-Los_Angeles_Lakers_logo.svg.png',
    roster: [
      { number: 6, name: 'LeBron James', position: 'Forward', height: '6-9', weight: '250' },
      { number: 3, name: 'Anthony Davis', position: 'Forward-Center', height: '6-10', weight: '253' },
      { number: 1, name: 'D \'Angelo Russell', position: 'Guard', height: '6-3', weight: '193' },
      // ... more players
    ]
  },
  '2': {
    id: 2, name: 'Boston Celtics', coach: 'Joe Mazzulla',
    arena: 'TD Garden', conference: 'Eastern',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/200px-Boston_Celtics.svg.png',
    roster: [
      { number: 0, name: 'Jayson Tatum', position: 'Forward', height: '6-8', weight: '210' },
      { number: 7, name: 'Jaylen Brown', position: 'Guard-Forward', height: '6-6', weight: '223' },
      // ... more players
    ]
  }
};

const BasketballTeamDetailsPage = () => {
  const { teamId } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('Roster'); // Default tab

  useEffect(() => {
    setTeamDetails(sampleTeamData[teamId] || null);
  }, [teamId]);

  if (!teamDetails) {
    return <BasketballPageLayout><div className="text-center text-xl p-10">Loading team details...</div></BasketballPageLayout>;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Roster':
        return (
          <div className="bg-slate-800/50 rounded-lg shadow p-4 md:p-6">
            <h3 className="text-xl text-orange-300 mb-4">Team Roster</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-orange-300 uppercase tracking-wider">#</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-orange-300 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-orange-300 uppercase tracking-wider hidden md:table-cell">Position</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-orange-300 uppercase tracking-wider hidden lg:table-cell">Height</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-orange-300 uppercase tracking-wider hidden lg:table-cell">Weight (lbs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {teamDetails.roster.map(player => (
                    <tr key={player.number} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300">{player.number}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-100 font-medium">{player.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300 hidden md:table-cell">{player.position}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300 hidden lg:table-cell">{player.height}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300 hidden lg:table-cell">{player.weight}</td>
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
            <h3 className="text-xl text-orange-300 mb-2">Team Information</h3>
            <p><span className="font-semibold text-slate-300">Coach:</span> <span className="text-slate-200">{teamDetails.coach}</span></p>
            <p><span className="font-semibold text-slate-300">Arena:</span> <span className="text-slate-200">{teamDetails.arena}</span></p>
            <p><span className="font-semibold text-slate-300">Conference:</span> <span className="text-slate-200">{teamDetails.conference}</span></p>
          </div>
         );
      default:
        return null;
    }
  }

  const tabStyles = "py-2 px-4 sm:px-6 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap";
  const activeTabStyles = "text-orange-400 border-b-2 border-orange-400";
  const inactiveTabStyles = "text-slate-400 hover:text-orange-300";

  return (
    <BasketballPageLayout title={teamDetails.name}>
      <div className="flex flex-col items-center mb-6">
        <img src={teamDetails.logo} alt={`${teamDetails.name} logo`} className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4" />
      </div>

      <div className="mb-6 sm:mb-8 border-b border-slate-700">
        <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-1 sm:gap-x-4">
          {['Roster', 'Info', 'Schedule', 'Stats'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`${tabStyles} ${activeTab === tab ? activeTabStyles : inactiveTabStyles}`}
              disabled={['Schedule', 'Stats'].includes(tab)} // Disable unimplemented tabs
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="fade-in">
        {renderTabContent()}
      </div>
    </BasketballPageLayout>
  );
};

export default BasketballTeamDetailsPage; 
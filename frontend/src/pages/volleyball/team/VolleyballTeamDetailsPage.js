import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VolleyballPageLayout from '../../../components/volleyball/VolleyballPageLayout';

const sampleTeamData = {
  '1': {
    id: 1, name: 'Poland National Team', coach: 'Nikola Grbić', 
    ranking: 1, 
    logo: 'https://via.placeholder.com/100/DC143C/FFFFFF?Text=POL',
    players: [
      { number: 9, name: 'Wilfredo León', position: 'Outside Hitter' },
      { number: 1, name: 'Bartosz Kurek', position: 'Opposite' },
      { number: 20, name: 'Mateusz Bieniek', position: 'Middle Blocker' },
      { number: 11, name: 'Jakub Kochanowski', position: 'Middle Blocker' },
      { number: 6, name: 'Marcin Janusz', position: 'Setter' },
      { number: 17, name: 'Paweł Zatorski', position: 'Libero' },
    ]
  },
  '2': {
    id: 2, name: 'USA National Team', coach: 'John Speraw', 
    ranking: 2,
    logo: 'https://via.placeholder.com/100/002868/FFFFFF?Text=USA',
    players: [
      { number: 1, name: 'Matt Anderson', position: 'Opposite' },
      { number: 11, name: 'Micah Christenson', position: 'Setter' },
      { number: 3, name: 'Taylor Sander', position: 'Outside Hitter' },
      { number: 12, name: 'Max Holt', position: 'Middle Blocker' },
      { number: 22, name: 'Erik Shoji', position: 'Libero' },
    ]
  }
};

const VolleyballTeamDetailsPage = () => {
  const { teamId } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('Players');

  useEffect(() => {
    setTeamDetails(sampleTeamData[teamId] || null);
  }, [teamId]);

  if (!teamDetails) {
    return <VolleyballPageLayout><div className="text-center text-xl p-10">Loading team details...</div></VolleyballPageLayout>;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Players':
        return (
          <div className="bg-slate-800/50 rounded-lg shadow p-4 md:p-6">
            <h3 className="text-xl text-indigo-300 mb-4">Player Roster</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">#</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider hidden sm:table-cell">Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {teamDetails.players.map(player => (
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
            <h3 className="text-xl text-indigo-300 mb-2">Team Information</h3>
            <p><span className="font-semibold text-slate-300">Coach:</span> <span className="text-slate-200">{teamDetails.coach}</span></p>
            <p><span className="font-semibold text-slate-300">World Ranking:</span> <span className="text-slate-200">{teamDetails.ranking}</span></p>
            {/* Add more info like recent achievements, etc. */}
          </div>
         );
      default:
        return null;
    }
  }

  const tabStyles = "py-2 px-4 sm:px-6 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap";
  const activeTabStyles = "text-indigo-400 border-b-2 border-indigo-400";
  const inactiveTabStyles = "text-slate-400 hover:text-indigo-300";

  return (
    <VolleyballPageLayout title={teamDetails.name}>
      <div className="flex flex-col items-center mb-6">
        <img src={teamDetails.logo} alt={`${teamDetails.name} logo`} className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4 p-2 bg-white rounded-full" />
      </div>

      <div className="mb-6 sm:mb-8 border-b border-slate-700">
        <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-1 sm:gap-x-4">
          {['Players', 'Info'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`${tabStyles} ${activeTab === tab ? activeTabStyles : inactiveTabStyles}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="fade-in">
        {renderTabContent()}
      </div>
    </VolleyballPageLayout>
  );
};

export default VolleyballTeamDetailsPage; 
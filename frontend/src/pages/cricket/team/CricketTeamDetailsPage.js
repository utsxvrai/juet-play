import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CricketPageLayout from '../../../components/cricket/CricketPageLayout';

const sampleTeamData = {
  '1': {
    id: 1, name: 'Mumbai Indians', captain: 'Hardik Pandya', 
    homeGround: 'Wankhede Stadium, Mumbai', coach: 'Mark Boucher',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/Mumbai_Indians_Logo.svg/225px-Mumbai_Indians_Logo.svg.png',
    squad: [
      { jersey: 45, name: 'Rohit Sharma', role: 'Batsman' },
      { jersey: 93, name: 'Jasprit Bumrah', role: 'Bowler' },
      { jersey: 77, name: 'Suryakumar Yadav', role: 'Batsman' },
      { jersey: 23, name: 'Ishan Kishan', role: 'Wicketkeeper-Batsman' },
      { jersey: 33, name: 'Hardik Pandya', role: 'All-rounder' },
      // Add more players
    ]
  },
  '2': { 
    id: 2, name: 'Chennai Super Kings', captain: 'Ruturaj Gaikwad', 
    homeGround: 'M. A. Chidambaram Stadium, Chennai', coach: 'Stephen Fleming',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/200px-Chennai_Super_Kings_Logo.svg.png',
    squad: [
      { jersey: 7, name: 'MS Dhoni', role: 'Wicketkeeper-Batsman' },
      { jersey: 31, name: 'Ruturaj Gaikwad', role: 'Batsman' },
      // ... more players
    ]
  },
};

const CricketTeamDetailsPage = () => {
  const { teamId } = useParams();
  const [teamDetails, setTeamDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('Squad'); // Default tab

  useEffect(() => {
    setTeamDetails(sampleTeamData[teamId] || null);
  }, [teamId]);

  if (!teamDetails) {
    return <CricketPageLayout><div className="text-center text-xl p-10">Loading team details...</div></CricketPageLayout>;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Squad':
        return (
          <div className="bg-slate-800/50 rounded-lg shadow p-4 md:p-6">
            <h3 className="text-xl text-emerald-300 mb-4">Player Squad</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider hidden sm:table-cell">Jersey #</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {teamDetails.squad.map(player => (
                    <tr key={player.jersey || player.name} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300 hidden sm:table-cell">{player.jersey || 'N/A'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-100 font-medium">{player.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300">{player.role}</td>
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
            <h3 className="text-xl text-emerald-300 mb-2">Team Information</h3>
            <p><span className="font-semibold text-slate-300">Captain:</span> <span className="text-slate-200">{teamDetails.captain}</span></p>
            <p><span className="font-semibold text-slate-300">Coach:</span> <span className="text-slate-200">{teamDetails.coach}</span></p>
            <p><span className="font-semibold text-slate-300">Home Ground:</span> <span className="text-slate-200">{teamDetails.homeGround}</span></p>
          </div>
         );
      default:
        return null;
    }
  }

  const tabStyles = "py-2 px-4 sm:px-6 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap";
  const activeTabStyles = "text-emerald-400 border-b-2 border-emerald-400";
  const inactiveTabStyles = "text-slate-400 hover:text-emerald-300";

  return (
    <CricketPageLayout title={teamDetails.name}>
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
    </CricketPageLayout>
  );
};

export default CricketTeamDetailsPage; 
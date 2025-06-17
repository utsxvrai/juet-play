import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VolleyballPageLayout from '../../../components/volleyball/VolleyballPageLayout';

// Placeholder components for different tabs
const MatchSummaryView = ({ matchData }) => (
  <div className="p-4 bg-slate-800/50 rounded-lg shadow space-y-3">
    <h3 className="text-xl text-indigo-300 mb-2">Set Scores</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-lg font-semibold text-slate-200">{matchData.teamA.name}</p>
        {matchData.teamA.sets.map((score, idx) => <p key={idx} className="text-slate-300">Set {idx + 1}: {score}</p>)}
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-200">{matchData.teamB.name}</p>
        {matchData.teamB.sets.map((score, idx) => <p key={idx} className="text-slate-300">Set {idx + 1}: {score}</p>)}
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-700">
      <h4 className="text-lg text-indigo-300 mb-1">Match Result</h4>
      <p className="text-xl font-bold text-white">{matchData.result}</p>
    </div>
  </div>
);

const MatchStatsView = ({ stats }) => {
  if (!stats) return <p className="text-slate-400">Statistics not available.</p>;
  return (
    <div className="p-4 bg-slate-800/50 rounded-lg shadow">
      <h3 className="text-xl text-indigo-300 mb-4 text-center">Team Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-2">{stats.teamA.name}</h4>
          {Object.entries(stats.teamA.data).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm text-slate-300 py-1">
              <span className="capitalize">{key.replace(/_/g, ' ')}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-2">{stats.teamB.name}</h4>
          {Object.entries(stats.teamB.data).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm text-slate-300 py-1">
              <span className="capitalize">{key.replace(/_/g, ' ')}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Could add individual player stats here later */}
    </div>
  );
};

const SquadsView = ({ teamASquad, teamBSquad }) => (
  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-slate-800/50 rounded-lg shadow p-4">
      <h3 className="text-xl text-indigo-300 mb-2 flex items-center"><img src={teamASquad.logo} alt={teamASquad.name} className="w-6 h-6 mr-2 object-contain"/>{teamASquad.name}</h3>
      <ul className="list-disc list-inside text-slate-300 space-y-1">
        {teamASquad.players.map(player => <li key={player.number}>{player.name} (#{player.number}) - {player.position}</li>)}
      </ul>
    </div>
    <div className="bg-slate-800/50 rounded-lg shadow p-4">
      <h3 className="text-xl text-indigo-300 mb-2 flex items-center"><img src={teamBSquad.logo} alt={teamBSquad.name} className="w-6 h-6 mr-2 object-contain"/>{teamBSquad.name}</h3>
      <ul className="list-disc list-inside text-slate-300 space-y-1">
        {teamBSquad.players.map(player => <li key={player.number}>{player.name} (#{player.number}) - {player.position}</li>)}
      </ul>
    </div>
  </div>
);

const sampleVolleyballMatchData = {
  id: 1,
  matchTitle: 'VNL Finals: Poland vs USA',
  tournament: 'Volleyball Nations League 2025',
  venue: 'Ergo Arena, Gdańsk',
  status: 'Poland won 3-1',
  timestamp: 'Live',
  teamA: { 
    name: 'Poland', 
    logo: 'https://via.placeholder.com/40/DC143C/FFFFFF?Text=POL',
    sets: [25, 22, 25, 25], // Scores for each set
  },
  teamB: { 
    name: 'USA', 
    logo: 'https://via.placeholder.com/40/002868/FFFFFF?Text=USA',
    sets: [20, 25, 20, 23],
  },
  result: 'Poland wins 3 sets to 1',
  stats: {
    teamA: {
      name: 'Poland',
      data: { attacks: 55, blocks: 12, serves_aces: 7, reception_errors: 10, digs: 60 },
    },
    teamB: {
      name: 'USA',
      data: { attacks: 50, blocks: 9, serves_aces: 5, reception_errors: 12, digs: 55 },
    }
  },
  teamASquad: {
    name: 'Poland',
    logo: 'https://via.placeholder.com/40/DC143C/FFFFFF?Text=POL',
    players: [
      { name: 'Wilfredo León', number: 9, position: 'Outside Hitter' },
      { name: 'Bartosz Kurek', number: 1, position: 'Opposite' },
      { name: 'Mateusz Bieniek', number: 20, position: 'Middle Blocker' },
      // ... more players
    ]
  },
  teamBSquad: {
    name: 'USA',
    logo: 'https://via.placeholder.com/40/002868/FFFFFF?Text=USA',
    players: [
      { name: 'Matt Anderson', number: 1, position: 'Opposite' },
      { name: 'Micah Christenson', number: 11, position: 'Setter' },
      { name: 'Taylor Sander', number: 3, position: 'Outside Hitter' },
      // ... more players
    ]
  }
};

const VolleyballMatchDetailsPage = () => {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState('Summary');
  const [matchDetails, setMatchDetails] = useState(null);

  useEffect(() => {
    setMatchDetails(sampleVolleyballMatchData); // Fetch based on matchId
  }, [matchId]);

  if (!matchDetails) {
    return <VolleyballPageLayout><div className="text-center text-xl p-10">Loading match details...</div></VolleyballPageLayout>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Summary':
        return <MatchSummaryView matchData={matchDetails} />;
      case 'Stats':
        return <MatchStatsView stats={matchDetails.stats} />;
      case 'Squads':
        return <SquadsView teamASquad={matchDetails.teamASquad} teamBSquad={matchDetails.teamBSquad} />;
      default:
        return null;
    }
  };

  const tabStyles = "py-2 px-4 sm:px-6 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap";
  const activeTabStyles = "text-indigo-400 border-b-2 border-indigo-400";
  const inactiveTabStyles = "text-slate-400 hover:text-indigo-300";

  return (
    <VolleyballPageLayout title={matchDetails.matchTitle}>
      <div className="mb-4 text-center">
        <p className="text-slate-300 text-sm">{matchDetails.tournament}</p>
        <p className="text-slate-400 text-xs">{matchDetails.venue}</p>
        <p className="text-indigo-400 font-semibold mt-1">{matchDetails.status} <span className="text-slate-500 text-xs">({matchDetails.timestamp})</span></p>
      </div>
      
      <div className="mb-6 sm:mb-8 border-b border-slate-700">
        <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-1 sm:gap-x-4">
          {['Summary', 'Stats', 'Squads'].map(tab => (
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

export default VolleyballMatchDetailsPage; 
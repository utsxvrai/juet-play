import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FootballPageLayout from '../../../components/football/FootballPageLayout';

// Placeholder components for different tabs
const MatchSummaryView = ({ matchData }) => {
  // Example: Display goals and key events
  return (
    <div className="p-4 bg-slate-800/50 rounded-lg shadow space-y-4">
      <h3 className="text-xl text-teal-300 mb-2">Match Events</h3>
      {matchData.events && matchData.events.length > 0 ? (
        <ul className="divide-y divide-slate-700">
          {matchData.events.map((event, idx) => (
            <li key={idx} className="py-3">
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-semibold ${event.team === matchData.teamA.name ? 'text-teal-400' : 'text-orange-400'}`}>{event.time}'</span>
                <img src={event.teamLogo} alt={event.team} className="w-5 h-5 object-contain"/>
                <span className="text-slate-300">{event.type === 'Goal' ? '⚽' : (event.type === 'Yellow Card' ? '🟨' : '🟥')} {event.player} ({event.type})</span> 
              </div>
              {event.assist && <p className="text-xs text-slate-400 ml-10">Assist: {event.assist}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-300">No key events recorded yet.</p>
      )}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <h4 className="text-lg text-teal-300 mb-1">Final Score</h4>
        <p className="text-2xl font-bold text-white">{matchData.teamA.name} {matchData.teamA.score} - {matchData.teamB.score} {matchData.teamB.name}</p>
      </div>
    </div>
  );
};

const MatchStatsView = ({ stats }) => {
  if (!stats) return <p className="text-slate-400">Statistics not available.</p>;
  return (
    <div className="p-4 bg-slate-800/50 rounded-lg shadow">
      <h3 className="text-xl text-teal-300 mb-4 text-center">Match Statistics</h3>
      <div className="grid grid-cols-3 gap-x-4 mb-4">
        <div className="text-lg font-semibold text-center text-slate-200">{stats.teamA.name}</div>
        <div className="text-lg font-semibold text-center text-slate-400">VS</div>
        <div className="text-lg font-semibold text-center text-slate-200">{stats.teamB.name}</div>
      </div>
      {Object.keys(stats.teamA.data).map(key => (
        <div key={key} className="mb-3">
          <div className="flex justify-between items-center text-sm text-slate-300 mb-1">
            <span>{stats.teamA.data[key]}</span>
            <span className="font-medium text-teal-300 capitalize">{key.replace(/_/g, ' ')}</span>
            <span>{stats.teamB.data[key]}</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 bg-teal-500 rounded-l-full" style={{ width: `${stats.teamA.percentages[key]}%` }}></div>
            <div className="h-2 bg-orange-500 rounded-r-full" style={{ width: `${stats.teamB.percentages[key]}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const LineupsView = ({ teamALineup, teamBLineup }) => (
  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-slate-800/50 rounded-lg shadow p-4">
      <h3 className="text-xl text-teal-300 mb-2 flex items-center"><img src={teamALineup.logo} alt={teamALineup.name} className="w-6 h-6 mr-2 object-contain"/> {teamALineup.name} <span className="text-xs text-slate-400 ml-2">({teamALineup.formation})</span></h3>
      <h4 className="text-sm text-slate-400 mb-1 mt-3 font-semibold">Starting XI:</h4>
      <ul className="list-decimal list-inside text-slate-300 space-y-1">
        {teamALineup.starters.map(player => <li key={player.number}>{player.name} ({player.number})</li>)}
      </ul>
      {teamALineup.substitutes.length > 0 && <h4 className="text-sm text-slate-400 mb-1 mt-3 font-semibold">Substitutes:</h4>}
      <ul className="text-slate-400 text-xs space-y-0.5">
        {teamALineup.substitutes.map(player => <li key={player.number}>{player.name} ({player.number})</li>)}
      </ul>
    </div>
    <div className="bg-slate-800/50 rounded-lg shadow p-4">
    <h3 className="text-xl text-teal-300 mb-2 flex items-center"><img src={teamBLineup.logo} alt={teamBLineup.name} className="w-6 h-6 mr-2 object-contain"/> {teamBLineup.name} <span className="text-xs text-slate-400 ml-2">({teamBLineup.formation})</span></h3>
      <h4 className="text-sm text-slate-400 mb-1 mt-3 font-semibold">Starting XI:</h4>
      <ul className="list-decimal list-inside text-slate-300 space-y-1">
        {teamBLineup.starters.map(player => <li key={player.number}>{player.name} ({player.number})</li>)}
      </ul>
      {teamBLineup.substitutes.length > 0 && <h4 className="text-sm text-slate-400 mb-1 mt-3 font-semibold">Substitutes:</h4>}
      <ul className="text-slate-400 text-xs space-y-0.5">
        {teamBLineup.substitutes.map(player => <li key={player.number}>{player.name} ({player.number})</li>)}
      </ul>
    </div>
  </div>
);


const sampleFootballMatchData = {
  id: 1,
  matchTitle: 'Manchester Derby Showdown',
  league: 'Premier League - Week 10',
  venue: 'Old Trafford, Manchester',
  status: 'Full Time',
  timestamp: 'Yesterday',
  teamA: { name: 'Manchester United', score: 2, logo: 'https://via.placeholder.com/40/DA291C/FFFFFF?Text=MUN' },
  teamB: { name: 'Manchester City', score: 2, logo: 'https://via.placeholder.com/40/6CABDD/FFFFFF?Text=MCI' },
  events: [
    { time: 15, team: 'Manchester United', teamLogo: 'https://via.placeholder.com/20/DA291C/FFFFFF?Text=MUN', type: 'Goal', player: 'Marcus Rashford', assist: 'Bruno Fernandes' },
    { time: 35, team: 'Manchester City', teamLogo: 'https://via.placeholder.com/20/6CABDD/FFFFFF?Text=MCI', type: 'Goal', player: 'Erling Haaland', assist: 'Kevin De Bruyne' },
    { time: 60, team: 'Manchester United', teamLogo: 'https://via.placeholder.com/20/DA291C/FFFFFF?Text=MUN', type: 'Yellow Card', player: 'Casemiro' },
    { time: 75, team: 'Manchester City', teamLogo: 'https://via.placeholder.com/20/6CABDD/FFFFFF?Text=MCI', type: 'Goal', player: 'Phil Foden' },
    { time: 92, team: 'Manchester United', teamLogo: 'https://via.placeholder.com/20/DA291C/FFFFFF?Text=MUN', type: 'Goal', player: 'Alejandro Garnacho', assist: 'Luke Shaw' },
  ],
  stats: {
    teamA: {
      name: 'Man Utd',
      data: { possession: '45%', shots: 12, shots_on_target: 5, corners: 4, fouls: 10 },
      percentages: { possession: 45, shots: 60, shots_on_target: 50, corners: 40, fouls: 55 }
    },
    teamB: {
      name: 'Man City',
      data: { possession: '55%', shots: 18, shots_on_target: 8, corners: 6, fouls: 8 },
      percentages: { possession: 55, shots: 40, shots_on_target: 50, corners: 60, fouls: 45 }
    }
  },
  teamALineup: {
    name: 'Manchester United',
    logo: 'https://via.placeholder.com/20/DA291C/FFFFFF?Text=MUN',
    formation: '4-2-3-1',
    starters: [{name:'Onana', number:24}, {name:'Dalot', number:20}, {name:'Varane', number:19}, {name:'Martinez', number:6}, {name:'Shaw', number:23}, {name:'Casemiro', number:18}, {name:'Mainoo', number:37}, {name:'Garnacho', number:17}, {name:'Fernandes (c)', number:8}, {name:'Rashford', number:10}, {name:'Højlund', number:11}],
    substitutes: [{name:'Bayindir', number:1}, {name:'Maguire', number:5}, {name:'Amrabat', number:4}, {name:'McTominay', number:39}, {name:'Eriksen', number:14}, {name:'Antony', number:21}]
  },
  teamBLineup: {
    name: 'Manchester City',
    logo: 'https://via.placeholder.com/20/6CABDD/FFFFFF?Text=MCI',
    formation: '4-3-3',
    starters: [{name:'Ederson', number:31}, {name:'Walker (c)', number:2}, {name:'Dias', number:3}, {name:'Aké', number:6}, {name:'Gvardiol', number:24}, {name:'Rodri', number:16}, {name:'De Bruyne', number:17}, {name:'Silva', number:20}, {name:'Foden', number:47}, {name:'Haaland', number:9}, {name:'Doku', number:11}],
    substitutes: [{name:'Ortega', number:18}, {name:'Stones', number:5}, {name:'Kovačić', number:8}, {name:'Alvarez', number:19}, {name:'Grealish', number:10}]
  }
};

const FootballMatchDetailsPage = () => {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState('Summary');
  const [matchDetails, setMatchDetails] = useState(null);

  useEffect(() => {
    setMatchDetails(sampleFootballMatchData);
  }, [matchId]);

  if (!matchDetails) {
    return <FootballPageLayout><div className="text-center text-xl p-10">Loading match details...</div></FootballPageLayout>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Summary':
        return <MatchSummaryView matchData={matchDetails} />;
      case 'Stats':
        return <MatchStatsView stats={matchDetails.stats} />;
      case 'Lineups':
        return <LineupsView teamALineup={matchDetails.teamALineup} teamBLineup={matchDetails.teamBLineup} />;
      default:
        return null;
    }
  };

  const tabStyles = "py-2 px-4 sm:px-6 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap";
  const activeTabStyles = "text-teal-400 border-b-2 border-teal-400";
  const inactiveTabStyles = "text-slate-400 hover:text-teal-300";

  return (
    <FootballPageLayout title={matchDetails.matchTitle}>
      <div className="mb-4 text-center">
        <p className="text-slate-300 text-sm">{matchDetails.league}</p>
        <p className="text-slate-400 text-xs">{matchDetails.venue}</p>
        <p className="text-teal-400 font-semibold mt-1">{matchDetails.status} <span className="text-slate-500 text-xs">({matchDetails.timestamp})</span></p>
      </div>
      
      <div className="mb-6 sm:mb-8 border-b border-slate-700">
        <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-1 sm:gap-x-4">
          {['Summary', 'Stats', 'Lineups'].map(tab => (
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
    </FootballPageLayout>
  );
};

export default FootballMatchDetailsPage; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FootballPageLayout from '../../../components/football/FootballPageLayout';

// Live Score Display Component
const LiveScoreDisplay = ({ matchData }) => {
  const isLive = matchData.status === 'Live' || matchData.status === 'ongoing';
  
  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8 border border-slate-600/30">
      <div className="text-center">
        {/* Match Info Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{matchData.matchTitle}</h1>
          <p className="text-slate-300 text-sm">{matchData.league}</p>
          <p className="text-slate-400 text-xs">{matchData.venue}</p>
        </div>

        {/* Modern Score Display */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          {/* Team A */}
          <div className="text-center flex-1">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
              <h3 className="text-xl font-bold text-white mb-2">{matchData.teamA.name}</h3>
              <div className="text-6xl font-black text-teal-400 mb-2">{matchData.teamA.score}</div>
            </div>
          </div>
          
          {/* VS Section */}
          <div className="text-center px-6">
            <div className="bg-slate-600/50 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-slate-300">VS</span>
            </div>
            {isLive && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-bold text-sm">LIVE</span>
                <span className="text-slate-300 font-mono text-sm">{matchData.currentMinute || '45'}'</span>
              </div>
            )}
            <div className="text-slate-400 text-xs mt-1">{matchData.status}</div>
          </div>
          
          {/* Team B */}
          <div className="text-center flex-1">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
              <h3 className="text-xl font-bold text-white mb-2">{matchData.teamB.name}</h3>
              <div className="text-6xl font-black text-teal-400 mb-2">{matchData.teamB.score}</div>
            </div>
          </div>
        </div>

        {/* Match Status Bar */}
        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Status: <span className="text-teal-400 font-semibold">{matchData.status}</span></span>
            <span className="text-slate-300">Time: <span className="text-slate-200">{matchData.timestamp}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Match Summary with Detailed Events
const MatchSummaryView = ({ matchData }) => {
  return (
    <div className="space-y-6">
      {/* Match Events Timeline */}
      <div className="bg-slate-800/50 rounded-lg shadow p-6">
        <h3 className="text-xl text-teal-300 mb-4 flex items-center">
          <span className="mr-2">⚽</span>
          Match Events Timeline
        </h3>
      {matchData.events && matchData.events.length > 0 ? (
          <div className="space-y-3">
          {matchData.events.map((event, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
                <div className={`text-sm font-bold px-2 py-1 rounded ${event.team === matchData.teamA.name ? 'bg-teal-600 text-white' : 'bg-orange-600 text-white'}`}>
                  {event.time}'
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-300 font-medium">{event.team}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {event.type === 'Goal' && <span className="text-2xl">⚽</span>}
                  {event.type === 'Yellow Card' && <span className="text-2xl">🟨</span>}
                  {event.type === 'Red Card' && <span className="text-2xl">🟥</span>}
                  {event.type === 'Substitution' && <span className="text-2xl">🔄</span>}
                  <span className="text-slate-200 font-semibold">{event.player}</span>
                  <span className="text-slate-400">({event.type})</span>
                </div>
                {event.assist && (
                  <div className="text-sm text-slate-400">
                    Assist: <span className="text-slate-300">{event.assist}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-300 text-center py-4">No events recorded yet.</p>
        )}
      </div>

      {/* Key Moments */}
      <div className="bg-slate-800/50 rounded-lg shadow p-6">
        <h3 className="text-xl text-teal-300 mb-4">Key Moments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h4 className="text-teal-400 font-semibold mb-2">First Half</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-300">First Goal:</span>
                <span className="text-slate-200">{matchData.events?.find(e => e.type === 'Goal')?.time || 'N/A'}'</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-300">Cards:</span>
                <span className="text-slate-200">{matchData.events?.filter(e => e.type.includes('Card')).length || 0}</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h4 className="text-teal-400 font-semibold mb-2">Second Half</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-300">Goals:</span>
                <span className="text-slate-200">{matchData.events?.filter(e => e.type === 'Goal').length || 0}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-300">Substitutions:</span>
                <span className="text-slate-200">{matchData.events?.filter(e => e.type === 'Substitution').length || 0}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Statistics View
const MatchStatsView = ({ stats }) => {
  if (!stats) return <p className="text-slate-400">Statistics not available.</p>;
  
  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="bg-slate-800/50 rounded-lg shadow p-6">
        <h3 className="text-xl text-teal-300 mb-6 text-center">Match Statistics</h3>
        <div className="grid grid-cols-3 gap-x-4 mb-6">
        <div className="text-lg font-semibold text-center text-slate-200">{stats.teamA.name}</div>
        <div className="text-lg font-semibold text-center text-slate-400">VS</div>
        <div className="text-lg font-semibold text-center text-slate-200">{stats.teamB.name}</div>
      </div>
      {Object.keys(stats.teamA.data).map(key => (
          <div key={key} className="mb-4">
            <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
              <span className="font-medium">{stats.teamA.data[key]}</span>
            <span className="font-medium text-teal-300 capitalize">{key.replace(/_/g, ' ')}</span>
              <span className="font-medium">{stats.teamB.data[key]}</span>
            </div>
            <div className="flex items-center h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${stats.teamA.percentages[key]}%` }}></div>
              <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${stats.teamB.percentages[key]}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg shadow p-6">
          <h4 className="text-lg text-teal-300 mb-4">Attack Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Shots on Target</span>
              <span className="text-slate-200">{stats.teamA.data.shots_on_target} - {stats.teamB.data.shots_on_target}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Offsides</span>
              <span className="text-slate-200">{stats.teamA.data.offsides || 3} - {stats.teamB.data.offsides || 2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Saves</span>
              <span className="text-slate-200">{stats.teamA.data.saves || 4} - {stats.teamB.data.saves || 3}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg shadow p-6">
          <h4 className="text-lg text-teal-300 mb-4">Defense Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Tackles</span>
              <span className="text-slate-200">{stats.teamA.data.tackles || 15} - {stats.teamB.data.tackles || 18}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Clearances</span>
              <span className="text-slate-200">{stats.teamA.data.clearances || 12} - {stats.teamB.data.clearances || 10}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Interceptions</span>
              <span className="text-slate-200">{stats.teamA.data.interceptions || 8} - {stats.teamB.data.interceptions || 9}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Lineups View with Detailed Player Information
const LineupsView = ({ teamALineup, teamBLineup }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Team A Lineup */}
      <div className="bg-slate-800/50 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <h3 className="text-xl text-teal-300 font-semibold">{teamALineup.name}</h3>
          <span className="text-xs text-slate-400 ml-2 bg-slate-700 px-2 py-1 rounded">({teamALineup.formation})</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm text-slate-400 mb-2 font-semibold">Starting XI:</h4>
            <div className="space-y-2">
              {teamALineup.starters.map(player => (
                <div key={player.number} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 text-sm font-mono">{player.number}</span>
                    <span className="text-slate-200 font-medium">{player.name}</span>
                    {player.position && <span className="text-xs text-slate-500 bg-slate-600 px-2 py-1 rounded">{player.position}</span>}
                  </div>
                  {player.captain && <span className="text-xs text-yellow-400 font-bold">(C)</span>}
                </div>
              ))}
            </div>
          </div>
          
          {teamALineup.substitutes.length > 0 && (
            <div>
              <h4 className="text-sm text-slate-400 mb-2 font-semibold">Substitutes:</h4>
              <div className="space-y-1">
                {teamALineup.substitutes.map(player => (
                  <div key={player.number} className="flex items-center justify-between p-2 bg-slate-700/20 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-500 text-sm font-mono">{player.number}</span>
                      <span className="text-slate-300 text-sm">{player.name}</span>
                      {player.position && <span className="text-xs text-slate-600 bg-slate-700 px-1 py-0.5 rounded">{player.position}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Team B Lineup */}
      <div className="bg-slate-800/50 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <h3 className="text-xl text-teal-300 font-semibold">{teamBLineup.name}</h3>
          <span className="text-xs text-slate-400 ml-2 bg-slate-700 px-2 py-1 rounded">({teamBLineup.formation})</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm text-slate-400 mb-2 font-semibold">Starting XI:</h4>
            <div className="space-y-2">
              {teamBLineup.starters.map(player => (
                <div key={player.number} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 text-sm font-mono">{player.number}</span>
                    <span className="text-slate-200 font-medium">{player.name}</span>
                    {player.position && <span className="text-xs text-slate-500 bg-slate-600 px-2 py-1 rounded">{player.position}</span>}
                  </div>
                  {player.captain && <span className="text-xs text-yellow-400 font-bold">(C)</span>}
                </div>
              ))}
            </div>
          </div>
          
          {teamBLineup.substitutes.length > 0 && (
            <div>
              <h4 className="text-sm text-slate-400 mb-2 font-semibold">Substitutes:</h4>
              <div className="space-y-1">
                {teamBLineup.substitutes.map(player => (
                  <div key={player.number} className="flex items-center justify-between p-2 bg-slate-700/20 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-500 text-sm font-mono">{player.number}</span>
                      <span className="text-slate-300 text-sm">{player.name}</span>
                      {player.position && <span className="text-xs text-slate-600 bg-slate-700 px-1 py-0.5 rounded">{player.position}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Match Officials */}
    <div className="bg-slate-800/50 rounded-lg shadow p-6">
      <h3 className="text-lg text-teal-300 mb-4">Match Officials</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <span className="text-slate-400 text-sm">Referee</span>
          <p className="text-slate-200 font-medium">Michael Oliver</p>
        </div>
        <div className="text-center">
          <span className="text-slate-400 text-sm">Assistant Referee 1</span>
          <p className="text-slate-200 font-medium">Stuart Burt</p>
        </div>
        <div className="text-center">
          <span className="text-slate-400 text-sm">Assistant Referee 2</span>
          <p className="text-slate-200 font-medium">Simon Bennett</p>
        </div>
        <div className="text-center">
          <span className="text-slate-400 text-sm">Fourth Official</span>
          <p className="text-slate-200 font-medium">Anthony Taylor</p>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced sample data with more details
const sampleFootballMatchData = {
  id: 1,
  matchTitle: 'Manchester Derby Showdown',
  league: 'Premier League - Week 10',
  venue: 'Old Trafford, Manchester',
  status: 'Full Time',
  timestamp: 'Yesterday',
  currentMinute: 90,
  teamA: { name: 'Manchester United', score: 2 },
  teamB: { name: 'Manchester City', score: 2 },
  events: [
    { time: 15, team: 'Manchester United', type: 'Goal', player: 'Marcus Rashford', assist: 'Bruno Fernandes', minute: 15 },
    { time: 35, team: 'Manchester City', type: 'Goal', player: 'Erling Haaland', assist: 'Kevin De Bruyne', minute: 35 },
    { time: 45, team: 'Manchester United', type: 'Substitution', player: 'Scott McTominay', subbedFor: 'Kobbie Mainoo', minute: 45 },
    { time: 60, team: 'Manchester United', type: 'Yellow Card', player: 'Casemiro', minute: 60 },
    { time: 75, team: 'Manchester City', type: 'Goal', player: 'Phil Foden', assist: 'Bernardo Silva', minute: 75 },
    { time: 80, team: 'Manchester City', type: 'Substitution', player: 'Jack Grealish', subbedFor: 'Jeremy Doku', minute: 80 },
    { time: 92, team: 'Manchester United', type: 'Goal', player: 'Alejandro Garnacho', assist: 'Luke Shaw', minute: 92 },
  ],
  stats: {
    teamA: {
      name: 'Man Utd',
      data: { possession: '45%', shots: 12, shots_on_target: 5, corners: 4, fouls: 10, offsides: 3, saves: 4, tackles: 15, clearances: 12, interceptions: 8 },
      percentages: { possession: 45, shots: 60, shots_on_target: 50, corners: 40, fouls: 55, offsides: 60, saves: 57, tackles: 45, clearances: 55, interceptions: 47 }
    },
    teamB: {
      name: 'Man City',
      data: { possession: '55%', shots: 18, shots_on_target: 8, corners: 6, fouls: 8, offsides: 2, saves: 3, tackles: 18, clearances: 10, interceptions: 9 },
      percentages: { possession: 55, shots: 40, shots_on_target: 50, corners: 60, fouls: 45, offsides: 40, saves: 43, tackles: 55, clearances: 45, interceptions: 53 }
    }
  },
  teamALineup: {
    name: 'Manchester United',
    formation: '4-2-3-1',
    starters: [
      {name:'Onana', number:24, position: 'GK'}, 
      {name:'Dalot', number:20, position: 'RB'}, 
      {name:'Varane', number:19, position: 'CB'}, 
      {name:'Martinez', number:6, position: 'CB'}, 
      {name:'Shaw', number:23, position: 'LB'}, 
      {name:'Casemiro', number:18, position: 'CDM'}, 
      {name:'Mainoo', number:37, position: 'CM'}, 
      {name:'Garnacho', number:17, position: 'RW'}, 
      {name:'Fernandes', number:8, position: 'CAM', captain: true}, 
      {name:'Rashford', number:10, position: 'LW'}, 
      {name:'Højlund', number:11, position: 'ST'}
    ],
    substitutes: [
      {name:'Bayindir', number:1, position: 'GK'}, 
      {name:'Maguire', number:5, position: 'CB'}, 
      {name:'Amrabat', number:4, position: 'CDM'}, 
      {name:'McTominay', number:39, position: 'CM'}, 
      {name:'Eriksen', number:14, position: 'CM'}, 
      {name:'Antony', number:21, position: 'RW'}
    ]
  },
  teamBLineup: {
    name: 'Manchester City',
    formation: '4-3-3',
    starters: [
      {name:'Ederson', number:31, position: 'GK'}, 
      {name:'Walker', number:2, position: 'RB', captain: true}, 
      {name:'Dias', number:3, position: 'CB'}, 
      {name:'Aké', number:6, position: 'CB'}, 
      {name:'Gvardiol', number:24, position: 'LB'}, 
      {name:'Rodri', number:16, position: 'CDM'}, 
      {name:'De Bruyne', number:17, position: 'CM'}, 
      {name:'Silva', number:20, position: 'CM'}, 
      {name:'Foden', number:47, position: 'RW'}, 
      {name:'Haaland', number:9, position: 'ST'}, 
      {name:'Doku', number:11, position: 'LW'}
    ],
    substitutes: [
      {name:'Ortega', number:18, position: 'GK'}, 
      {name:'Stones', number:5, position: 'CB'}, 
      {name:'Kovačić', number:8, position: 'CM'}, 
      {name:'Alvarez', number:19, position: 'ST'}, 
      {name:'Grealish', number:10, position: 'LW'}
    ]
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
      {/* Live Score Display */}
      <LiveScoreDisplay matchData={matchDetails} />
      
      {/* Navigation Tabs */}
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

      {/* Tab Content */}
      <div className="fade-in">
         {renderTabContent()}
      </div>
    </FootballPageLayout>
  );
};

export default FootballMatchDetailsPage; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BasketballPageLayout from '../../../components/basketball/BasketballPageLayout';

// Placeholder components for different tabs
const GameRecapView = ({ matchData }) => (
  <div className="p-4 bg-slate-800/50 rounded-lg shadow space-y-4">
    <h3 className="text-xl text-orange-300 mb-2">Quarterly Scores</h3>
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-orange-300">Team</th>
            {matchData.teamA.quarter_scores.map((_, idx) => <th key={`q${idx+1}`} className="px-2 py-2 text-center font-semibold text-slate-300">Q{idx+1}</th>)}
            <th className="px-3 py-2 text-center font-semibold text-orange-300">Final</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {[matchData.teamA, matchData.teamB].map(team => (
            <tr key={team.name} className="hover:bg-slate-700/30">
              <td className="px-3 py-2 whitespace-nowrap text-slate-100 font-medium flex items-center"><img src={team.logo} alt={team.name} className="w-5 h-5 mr-2 object-contain"/>{team.name}</td>
              {team.quarter_scores.map((score, idx) => <td key={`score-${idx}`} className="px-2 py-2 text-center text-slate-200">{score}</td>)}
              <td className="px-3 py-2 text-center text-orange-200 font-bold">{team.final_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <h3 className="text-xl text-orange-300 mb-2">Key Performers</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {matchData.keyPerformers.map(player => (
        <div key={player.name} className="bg-slate-700/40 p-3 rounded-md">
          <p className="font-semibold text-orange-200">{player.name} ({player.team})</p>
          <p className="text-xs text-slate-300">PTS: {player.pts} | REB: {player.reb} | AST: {player.ast}</p>
        </div>
      ))}
    </div>
  </div>
);

const BoxScoreView = ({ boxScore }) => {
  if (!boxScore) return <p className="text-slate-400">Box score not available.</p>;

  const renderPlayerStats = (players) => (
    <tbody className="divide-y divide-slate-700">
      {players.map((player, idx) => (
        <tr key={idx} className="hover:bg-slate-700/30">
          <td className="px-2 py-1.5 whitespace-nowrap text-slate-100 text-xs sm:text-sm">{player.name} <span className="text-slate-500 text-xs">{player.pos}</span></td>
          <td className="px-1 py-1.5 text-center text-slate-200 text-xs sm:text-sm">{player.min}</td>
          <td className="px-1 py-1.5 text-center text-slate-200 text-xs sm:text-sm">{player.fgm}-{player.fga}</td>
          <td className="px-1 py-1.5 text-center text-slate-200 text-xs sm:text-sm">{player.fg_pct}%</td>
          <td className="px-1 py-1.5 text-center text-slate-200 text-xs sm:text-sm">{player.ftm}-{player.fta}</td>
          <td className="px-1 py-1.5 text-center text-slate-200 text-xs sm:text-sm">{player.ft_pct}%</td>
          <td className="px-1 py-1.5 text-center text-slate-200 text-xs sm:text-sm">{player.reb}</td>
          <td className="px-1 py-1.5 text-center text-slate-200 text-xs sm:text-sm">{player.ast}</td>
          <td className="px-1 py-1.5 text-center text-slate-200 text-xs sm:text-sm">{player.stl}</td>
          <td className="px-1 py-1.5 text-center text-slate-200 text-xs sm:text-sm">{player.blk}</td>
          <td className="px-1 py-1.5 text-center text-orange-200 font-semibold text-xs sm:text-sm">{player.pts}</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="space-y-6">
      {[boxScore.teamA, boxScore.teamB].map(teamData => (
        <div key={teamData.name} className="bg-slate-800/50 rounded-lg shadow overflow-hidden">
          <h4 className="text-lg font-semibold text-orange-300 p-3 bg-slate-700/50 flex items-center"><img src={teamData.logo} alt={teamData.name} className="w-5 h-5 mr-2 object-contain"/>{teamData.name} - Box Score</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-slate-700/30">
                <tr>
                  {['Player', 'MIN', 'FG', 'FG%', 'FT', 'FT%', 'REB', 'AST', 'STL', 'BLK', 'PTS'].map(header => (
                    <th key={header} className="px-1 py-2 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              {renderPlayerStats(teamData.players)}
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

const TeamStatsView = ({ teamStats }) => {
  if (!teamStats) return <p className="text-slate-400">Team statistics not available.</p>;
  return (
    <div className="p-4 bg-slate-800/50 rounded-lg shadow">
      <h3 className="text-xl text-orange-300 mb-4 text-center">Team Comparison</h3>
      <div className="grid grid-cols-3 gap-x-2 sm:gap-x-4 mb-4">
        <div className="text-base sm:text-lg font-semibold text-center text-slate-200 flex items-center justify-center"><img src={teamStats.teamA.logo} alt={teamStats.teamA.name} className="w-5 h-5 mr-1 sm:mr-2 object-contain"/>{teamStats.teamA.name}</div>
        <div className="text-base sm:text-lg font-semibold text-center text-slate-400">VS</div>
        <div className="text-base sm:text-lg font-semibold text-center text-slate-200 flex items-center justify-center"><img src={teamStats.teamB.logo} alt={teamStats.teamB.name} className="w-5 h-5 mr-1 sm:mr-2 object-contain"/>{teamStats.teamB.name}</div>
      </div>
      {Object.keys(teamStats.teamA.data).map(key => (
        <div key={key} className="mb-2.5">
          <div className="flex justify-between items-center text-xs sm:text-sm text-slate-300 mb-1">
            <span>{teamStats.teamA.data[key]}</span>
            <span className="font-medium text-orange-300 capitalize">{key.replace(/_/g, ' ')}</span>
            <span>{teamStats.teamB.data[key]}</span>
          </div>
          {/* Optional: Add bar for visual comparison */}
        </div>
      ))}
    </div>
  );
};

const sampleBasketballMatchData = {
  id: 1,
  matchTitle: 'Lakers vs Celtics - Classic Rivalry',
  league: 'NBA Regular Season',
  venue: 'Crypto.com Arena, Los Angeles',
  status: 'Final',
  timestamp: 'Last Night',
  teamA: { name: 'Los Angeles Lakers', logo:'https://via.placeholder.com/30/552583/FFFFFF?Text=LAL', quarter_scores: [28, 30, 25, 29], final_score: 112 },
  teamB: { name: 'Boston Celtics', logo:'https://via.placeholder.com/30/007A33/FFFFFF?Text=BOS', quarter_scores: [25, 28, 31, 30], final_score: 114 },
  keyPerformers: [
    { name: 'LeBron James', team: 'LAL', pts: 30, reb: 10, ast: 8 },
    { name: 'Jayson Tatum', team: 'BOS', pts: 35, reb: 7, ast: 5 },
  ],
  boxScore: {
    teamA: {
      name: 'Los Angeles Lakers', logo:'https://via.placeholder.com/30/552583/FFFFFF?Text=LAL',
      players: [
        { name: 'L. James', pos: 'SF', min: 38, fgm: 12, fga: 20, fg_pct: 60, ftm: 5, fta: 6, ft_pct: 83.3, reb: 10, ast: 8, stl: 2, blk: 1, pts: 30 },
        { name: 'A. Davis', pos: 'PF', min: 36, fgm: 9, fga: 18, fg_pct: 50, ftm: 7, fta: 7, ft_pct: 100, reb: 12, ast: 3, stl: 1, blk: 3, pts: 25 },
        // ... more LAL players
      ]
    },
    teamB: {
      name: 'Boston Celtics', logo:'https://via.placeholder.com/30/007A33/FFFFFF?Text=BOS',
      players: [
        { name: 'J. Tatum', pos: 'SF', min: 39, fgm: 13, fga: 25, fg_pct: 52, ftm: 6, fta: 7, ft_pct: 85.7, reb: 7, ast: 5, stl: 1, blk: 0, pts: 35 },
        { name: 'J. Brown', pos: 'SG', min: 37, fgm: 10, fga: 22, fg_pct: 45.5, ftm: 4, fta: 4, ft_pct: 100, reb: 6, ast: 4, stl: 2, blk: 1, pts: 26 },
        // ... more BOS players
      ]
    }
  },
  teamStats: {
    teamA: { name: 'LAL', logo:'https://via.placeholder.com/30/552583/FFFFFF?Text=LAL', data: { points: 112, field_goals_pct: 48.5, three_pointers_pct: 35.0, free_throws_pct: 85.0, rebounds: 45, assists: 25, turnovers: 12 } },
    teamB: { name: 'BOS', logo:'https://via.placeholder.com/30/007A33/FFFFFF?Text=BOS', data: { points: 114, field_goals_pct: 50.2, three_pointers_pct: 38.1, free_throws_pct: 88.0, rebounds: 42, assists: 28, turnovers: 10 } },
  }
};

const BasketballMatchDetailsPage = () => {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState('Game Recap');
  const [matchDetails, setMatchDetails] = useState(null);

  useEffect(() => {
    setMatchDetails(sampleBasketballMatchData); // Fetch based on matchId
  }, [matchId]);

  if (!matchDetails) {
    return <BasketballPageLayout><div className="text-center text-xl p-10">Loading match details...</div></BasketballPageLayout>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Game Recap':
        return <GameRecapView matchData={matchDetails} />;
      case 'Box Score':
        return <BoxScoreView boxScore={matchDetails.boxScore} />;
      case 'Team Stats':
        return <TeamStatsView teamStats={matchDetails.teamStats} />;
      default:
        return null;
    }
  };

  const tabStyles = "py-2 px-4 sm:px-6 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap";
  const activeTabStyles = "text-orange-400 border-b-2 border-orange-400";
  const inactiveTabStyles = "text-slate-400 hover:text-orange-300";

  return (
    <BasketballPageLayout title={matchDetails.matchTitle}>
      <div className="mb-4 text-center">
        <p className="text-slate-300 text-sm">{matchDetails.league}</p>
        <p className="text-slate-400 text-xs">{matchDetails.venue}</p>
        <p className="text-orange-400 font-semibold mt-1">{matchDetails.status} <span className="text-slate-500 text-xs">({matchDetails.timestamp})</span></p>
      </div>
      
      <div className="mb-6 sm:mb-8 border-b border-slate-700">
        <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-1 sm:gap-x-4">
          {['Game Recap', 'Box Score', 'Team Stats'].map(tab => (
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
    </BasketballPageLayout>
  );
};

export default BasketballMatchDetailsPage; 
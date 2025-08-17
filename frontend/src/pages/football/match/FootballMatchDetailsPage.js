import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FootballPageLayout from '../../../components/football/FootballPageLayout';
import { FOOTBALL_SERVICE_URL } from '../../../utils/api';

// Live Score Display Component
const LiveScoreDisplay = ({ matchData, homeTeam, awayTeam }) => {
  const isLive = matchData?.status === 'Live' || matchData?.status === 'ongoing';
  
  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8 border border-slate-600/30">
      <div className="text-center">
        {/* Match Info Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {homeTeam?.name || 'Home Team'} vs {awayTeam?.name || 'Away Team'}
          </h1>
          <p className="text-slate-300 text-sm">Football Match</p>
          <p className="text-slate-400 text-xs">
            {matchData?.date ? new Date(matchData.date).toLocaleDateString() : 'TBD'}
          </p>
        </div>

        {/* Modern Score Display */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          {/* Home Team */}
          <div className="text-center flex-1">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
              <h3 className="text-xl font-bold text-white mb-2">{homeTeam?.name || 'Home Team'}</h3>
              <div className="text-6xl font-black text-teal-400 mb-2">{matchData?.homeScore || 0}</div>
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
              </div>
            )}
            <div className="text-slate-400 text-xs mt-1">{matchData?.status || 'Unknown'}</div>
          </div>
          
          {/* Away Team */}
          <div className="text-center flex-1">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
              <h3 className="text-xl font-bold text-white mb-2">{awayTeam?.name || 'Away Team'}</h3>
              <div className="text-6xl font-black text-teal-400 mb-2">{matchData?.awayScore || 0}</div>
            </div>
          </div>
        </div>

        {/* Match Status Bar */}
        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Status: <span className="text-teal-400 font-semibold">{matchData?.status || 'Unknown'}</span></span>
            <span className="text-slate-300">Date: <span className="text-slate-200">
              {matchData?.date ? new Date(matchData.date).toLocaleString() : 'TBD'}
            </span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Match Summary with Detailed Events
const MatchSummaryView = ({ matchData, homeTeam, awayTeam }) => {
  if (!matchData) return <p className="text-slate-400">Match data not available.</p>;
  
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
            {matchData.events
              .sort((a, b) => a.minute - b.minute)
              .map((event, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
                  <div className={`text-sm font-bold px-2 py-1 rounded ${
                    event.team === homeTeam?._id ? 'bg-teal-600 text-white' : 'bg-orange-600 text-white'
                  }`}>
                    {event.minute}'
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300 font-medium">
                      {event.team === homeTeam?._id ? homeTeam?.name : awayTeam?.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.type === 'goal' && <span className="text-2xl">⚽</span>}
                    {event.type === 'yellow_card' && <span className="text-2xl">🟨</span>}
                    {event.type === 'red_card' && <span className="text-2xl">🟥</span>}
                    {event.type === 'substitution' && <span className="text-2xl">🔄</span>}
                    <span className="text-slate-200 font-semibold">{event.description}</span>
                    <span className="text-slate-400 capitalize">({event.type.replace('_', ' ')})</span>
                  </div>
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
                <span className="text-slate-200">
                  {matchData.events?.find(e => e.type === 'goal')?.minute || 'N/A'}'
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-300">Cards:</span>
                <span className="text-slate-200">
                  {matchData.events?.filter(e => e.type.includes('card')).length || 0}
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <h4 className="text-teal-400 font-semibold mb-2">Second Half</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-300">Goals:</span>
                <span className="text-slate-200">
                  {matchData.events?.filter(e => e.type === 'goal').length || 0}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-300">Substitutions:</span>
                <span className="text-slate-200">
                  {matchData.events?.filter(e => e.type === 'substitution').length || 0}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Statistics View
const MatchStatsView = ({ matchData, homeTeam, awayTeam }) => {
  if (!matchData) return <p className="text-slate-400">Statistics not available.</p>;
  
  // Calculate basic statistics from events
  const homeTeamId = homeTeam?._id;
  const awayTeamId = awayTeam?._id;
  
  const homeGoals = matchData.events?.filter(e => e.type === 'goal' && e.team === homeTeamId).length || 0;
  const awayGoals = matchData.events?.filter(e => e.type === 'goal' && e.team === awayTeamId).length || 0;
  const homeYellowCards = matchData.events?.filter(e => e.type === 'yellow_card' && e.team === homeTeamId).length || 0;
  const awayYellowCards = matchData.events?.filter(e => e.type === 'yellow_card' && e.team === awayTeamId).length || 0;
  const homeRedCards = matchData.events?.filter(e => e.type === 'red_card' && e.team === homeTeamId).length || 0;
  const awayRedCards = matchData.events?.filter(e => e.type === 'red_card' && e.team === awayTeamId).length || 0;
  const homeSubstitutions = matchData.events?.filter(e => e.type === 'substitution' && e.team === homeTeamId).length || 0;
  const awaySubstitutions = matchData.events?.filter(e => e.type === 'substitution' && e.team === awayTeamId).length || 0;
  
  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="bg-slate-800/50 rounded-lg shadow p-6">
        <h3 className="text-xl text-teal-300 mb-6 text-center">Match Statistics</h3>
        <div className="grid grid-cols-3 gap-x-4 mb-6">
          <div className="text-lg font-semibold text-center text-slate-200">{homeTeam?.name || 'Home Team'}</div>
          <div className="text-lg font-semibold text-center text-slate-400">VS</div>
          <div className="text-lg font-semibold text-center text-slate-200">{awayTeam?.name || 'Away Team'}</div>
        </div>
        
        {/* Goals */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
            <span className="font-medium">{homeGoals}</span>
            <span className="font-medium text-teal-300">Goals</span>
            <span className="font-medium">{awayGoals}</span>
          </div>
          <div className="flex items-center h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${homeGoals > 0 ? (homeGoals / (homeGoals + awayGoals)) * 100 : 0}%` }}></div>
            <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${awayGoals > 0 ? (awayGoals / (homeGoals + awayGoals)) * 100 : 0}%` }}></div>
          </div>
        </div>

        {/* Yellow Cards */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
            <span className="font-medium">{homeYellowCards}</span>
            <span className="font-medium text-yellow-400">Yellow Cards</span>
            <span className="font-medium">{awayYellowCards}</span>
          </div>
          <div className="flex items-center h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${homeYellowCards > 0 ? (homeYellowCards / (homeYellowCards + awayYellowCards)) * 100 : 0}%` }}></div>
            <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${awayYellowCards > 0 ? (awayYellowCards / (homeYellowCards + awayYellowCards)) * 100 : 0}%` }}></div>
          </div>
        </div>

        {/* Red Cards */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
            <span className="font-medium">{homeRedCards}</span>
            <span className="font-medium text-red-400">Red Cards</span>
            <span className="font-medium">{awayRedCards}</span>
          </div>
          <div className="flex items-center h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${homeRedCards > 0 ? (homeRedCards / (homeRedCards + awayRedCards)) * 100 : 0}%` }}></div>
            <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${awayRedCards > 0 ? (awayRedCards / (homeRedCards + awayRedCards)) * 100 : 0}%` }}></div>
          </div>
        </div>

        {/* Substitutions */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
            <span className="font-medium">{homeSubstitutions}</span>
            <span className="font-medium text-blue-400">Substitutions</span>
            <span className="font-medium">{awaySubstitutions}</span>
          </div>
          <div className="flex items-center h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${homeSubstitutions > 0 ? (homeSubstitutions / (homeSubstitutions + awaySubstitutions)) * 100 : 0}%` }}></div>
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${awaySubstitutions > 0 ? (awaySubstitutions / (homeSubstitutions + awaySubstitutions)) * 100 : 0}%` }}></div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg shadow p-6">
          <h4 className="text-lg text-teal-300 mb-4">Match Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Total Goals</span>
              <span className="text-slate-200">{homeGoals + awayGoals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Total Cards</span>
              <span className="text-slate-200">{homeYellowCards + awayYellowCards + homeRedCards + awayRedCards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Total Substitutions</span>
              <span className="text-slate-200">{homeSubstitutions + awaySubstitutions}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg shadow p-6">
          <h4 className="text-lg text-teal-300 mb-4">Match Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Status</span>
              <span className="text-slate-200 capitalize">{matchData.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Date</span>
              <span className="text-slate-200">
                {matchData.date ? new Date(matchData.date).toLocaleDateString() : 'TBD'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Winner</span>
              <span className="text-slate-200">
                {matchData.winnerId ? 
                  (matchData.winnerId === homeTeamId ? homeTeam?.name : awayTeam?.name) : 
                  'TBD'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Lineups View with Detailed Player Information
const LineupsView = ({ homeTeam, awayTeam }) => {
  if (!homeTeam || !awayTeam) return <p className="text-slate-400">Team lineups not available.</p>;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Team Lineup */}
        <div className="bg-slate-800/50 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl text-teal-300 font-semibold">{homeTeam.name}</h3>
            <span className="text-xs text-slate-400 ml-2 bg-slate-700 px-2 py-1 rounded">Home Team</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-slate-400 mb-2 font-semibold">Players:</h4>
              <div className="space-y-2">
                {homeTeam.players && homeTeam.players.length > 0 ? (
                  homeTeam.players.map((player, index) => (
                    <div key={player._id || index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-400 text-sm font-mono">#{player.jerseyNumber || 'N/A'}</span>
                        <span className="text-slate-200 font-medium">{player.name}</span>
                        {player.position && <span className="text-xs text-slate-500 bg-slate-600 px-2 py-1 rounded capitalize">{player.position}</span>}
                      </div>
                      <div className="text-xs text-slate-400">
                        {player.age && `${player.age} yrs`}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No players available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Away Team Lineup */}
        <div className="bg-slate-800/50 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl text-teal-300 font-semibold">{awayTeam.name}</h3>
            <span className="text-xs text-slate-400 ml-2 bg-slate-700 px-2 py-1 rounded">Away Team</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-slate-400 mb-2 font-semibold">Players:</h4>
              <div className="space-y-2">
                {awayTeam.players && awayTeam.players.length > 0 ? (
                  awayTeam.players.map((player, index) => (
                    <div key={player._id || index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-400 text-sm font-mono">#{player.jerseyNumber || 'N/A'}</span>
                        <span className="text-slate-200 font-medium">{player.name}</span>
                        {player.position && <span className="text-xs text-slate-500 bg-slate-600 px-2 py-1 rounded capitalize">{player.position}</span>}
                      </div>
                      <div className="text-xs text-slate-400">
                        {player.age && `${player.age} yrs`}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No players available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Information */}
      <div className="bg-slate-800/50 rounded-lg shadow p-6">
        <h3 className="text-lg text-teal-300 mb-4">Team Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-teal-400 font-semibold mb-2">{homeTeam.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Coach:</span>
                <span className="text-slate-200">{homeTeam.coach || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Country:</span>
                <span className="text-slate-200">{homeTeam.country || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Record:</span>
                <span className="text-slate-200">
                  {homeTeam.wins || 0}W - {homeTeam.losses || 0}L - {homeTeam.draws || 0}D
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-teal-400 font-semibold mb-2">{awayTeam.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Coach:</span>
                <span className="text-slate-200">{awayTeam.coach || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Country:</span>
                <span className="text-slate-200">{awayTeam.country || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Record:</span>
                <span className="text-slate-200">
                  {awayTeam.wins || 0}W - {awayTeam.losses || 0}L - {awayTeam.draws || 0}D
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FootballMatchDetailsPage = () => {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState('Summary');
  const [matchDetails, setMatchDetails] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/match/${matchId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const matchData = data.data || data;
        setMatchDetails(matchData);
        
        // Fetch team details
        if (matchData.homeTeam) {
          const homeTeamRes = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/team/${matchData.homeTeam}`);
          if (homeTeamRes.ok) {
            const homeTeamData = await homeTeamRes.json();
            setHomeTeam(homeTeamData.data || homeTeamData);
          }
        }
        
        if (matchData.awayTeam) {
          const awayTeamRes = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/team/${matchData.awayTeam}`);
          if (awayTeamRes.ok) {
            const awayTeamData = await awayTeamRes.json();
            setAwayTeam(awayTeamData.data || awayTeamData);
          }
        }
      } catch (error) {
        console.error("Error fetching match details:", error);
        setError(error.message);
        setMatchDetails(null);
        setHomeTeam(null);
        setAwayTeam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
    const interval = setInterval(fetchMatchDetails, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [matchId]);

  if (loading) {
    return (
      <FootballPageLayout title="Loading...">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="mt-2 text-slate-400">Loading match details...</p>
        </div>
      </FootballPageLayout>
    );
  }

  if (error) {
    return (
      <FootballPageLayout title="Error">
        <div className="text-center text-red-400 py-8">
          <p className="text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </FootballPageLayout>
    );
  }

  if (!matchDetails) {
    return (
      <FootballPageLayout title="Match Not Found">
        <div className="text-center text-slate-400 py-8">
          <p className="text-lg">Match not found</p>
        </div>
      </FootballPageLayout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Summary':
        return <MatchSummaryView matchData={matchDetails} homeTeam={homeTeam} awayTeam={awayTeam} />;
      case 'Stats':
        return <MatchStatsView matchData={matchDetails} homeTeam={homeTeam} awayTeam={awayTeam} />;
      case 'Lineups':
        return <LineupsView homeTeam={homeTeam} awayTeam={awayTeam} />;
      default:
        return null;
    }
  };

  const tabStyles = "py-2 px-4 sm:px-6 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap";
  const activeTabStyles = "text-teal-400 border-b-2 border-teal-400";
  const inactiveTabStyles = "text-slate-400 hover:text-teal-300";

  return (
    <FootballPageLayout title={`${homeTeam?.name || 'Home Team'} vs ${awayTeam?.name || 'Away Team'}`}>
      {/* Match Header */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-300">
            {homeTeam?.name || 'Home Team'} vs {awayTeam?.name || 'Away Team'}
          </h2>
          <div className="flex space-x-3">
            {(matchDetails.status === 'scheduled' || matchDetails.status === 'ongoing') && (
              <button
                onClick={() => window.location.href = `/football/live-scoring/${matchId}`}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Live Scoring
              </button>
            )}
            <button
              onClick={() => window.location.href = '/football'}
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              ← Back to Matches
            </button>
          </div>
        </div>
        <div className="text-sm text-slate-400">
          Date: {matchDetails.date ? new Date(matchDetails.date).toLocaleString() : 'TBD'} | 
          Status: {matchDetails.status}
        </div>
      </div>
      {/* Live Score Display */}
      <LiveScoreDisplay matchData={matchDetails} homeTeam={homeTeam} awayTeam={awayTeam} />
      
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
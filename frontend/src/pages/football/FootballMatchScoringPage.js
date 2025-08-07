import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import { FOOTBALL_SERVICE_URL } from '../../utils/api';

const FootballMatchScoringPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [matchWinner, setMatchWinner] = useState(null);
  
  // Player selection states
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  useEffect(() => {
    if (matchId) {
      fetchMatchDetails();
    }
  }, [matchId]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setCurrentSecond(prev => {
          if (prev === 59) {
            setCurrentMinute(prevMinute => Math.min(prevMinute + 1, 90));
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/match/${matchId}`);
      if (response.ok) {
        const data = await response.json();
        const matchData = data.data || data;
        setMatch(matchData);
        setHomeScore(matchData.homeScore || 0);
        setAwayScore(matchData.awayScore || 0);
        
        // Fetch team details
        if (matchData.homeTeam) {
          const homeTeamRes = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/team/${matchData.homeTeam}`);
          if (homeTeamRes.ok) {
            const homeTeamData = await homeTeamRes.json();
            setHomeTeam(homeTeamData.data || homeTeamData);
            // Fetch home team players
            if (homeTeamData.data?.players) {
              const homePlayersRes = await Promise.all(
                homeTeamData.data.players.map(async (playerId) => {
                  const playerRes = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/player/${playerId}`);
                  if (playerRes.ok) {
                    const playerData = await playerRes.json();
                    return playerData.data || playerData;
                  }
                  return null;
                })
              );
              setHomePlayers(homePlayersRes.filter(p => p));
            }
          }
        }
        
        if (matchData.awayTeam) {
          const awayTeamRes = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/team/${matchData.awayTeam}`);
          if (awayTeamRes.ok) {
            const awayTeamData = await awayTeamRes.json();
            setAwayTeam(awayTeamData.data || awayTeamData);
            // Fetch away team players
            if (awayTeamData.data?.players) {
              const awayPlayersRes = await Promise.all(
                awayTeamData.data.players.map(async (playerId) => {
                  const playerRes = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/player/${playerId}`);
                  if (playerRes.ok) {
                    const playerData = await playerRes.json();
                    return playerData.data || playerData;
                  }
                  return null;
                })
              );
              setAwayPlayers(awayPlayersRes.filter(p => p));
            }
          }
        }
      } else {
        setError('Failed to fetch match details');
      }
    } catch (error) {
      setError('Error fetching match details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreUpdate = (team, action) => {
    if (team === 'home') {
      if (action === 'increment') {
        setHomeScore(prev => prev + 1);
      } else if (action === 'decrement') {
        setHomeScore(prev => Math.max(prev - 1, 0));
      }
    } else {
      if (action === 'increment') {
        setAwayScore(prev => prev + 1);
      } else if (action === 'decrement') {
        setAwayScore(prev => Math.max(prev - 1, 0));
      }
    }
  };

  const handleTimerControl = (action) => {
    if (action === 'start') {
      setIsTimerRunning(true);
    } else if (action === 'pause') {
      setIsTimerRunning(false);
    } else if (action === 'reset') {
      setIsTimerRunning(false);
      setCurrentMinute(0);
      setCurrentSecond(0);
    }
  };

  const formatTime = (minutes, seconds) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEventClick = (eventType, team) => {
    if (currentMinute === 0 && currentSecond === 0) {
      setError('Please start the timer before adding events');
      return;
    }
    
    setSelectedEventType(eventType);
    setSelectedTeam(team);
    setSelectedPlayer('');
    setShowPlayerModal(true);
  };

  const handlePlayerSelect = async () => {
    if (!selectedPlayer) {
      setError('Please select a player');
      return;
    }

    setSaving(true);
    try {
      const newEvent = {
        minute: currentMinute,
        type: selectedEventType,
        team: selectedTeam === 'home' ? match.homeTeam : match.awayTeam,
        player: selectedPlayer,
        description: `${selectedEventType.replace('_', ' ')} by ${selectedPlayer} at ${formatTime(currentMinute, currentSecond)}`
      };

      const updatedEvents = [...(match.events || []), newEvent];
      
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/match/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: updatedEvents,
          homeScore: homeScore,
          awayScore: awayScore,
          status: 'ongoing'
        }),
      });

      if (response.ok) {
        // Refresh match data
        fetchMatchDetails();
        setShowPlayerModal(false);
        setSelectedPlayer('');
      } else {
        setError('Failed to add event');
      }
    } catch (error) {
      setError('Failed to add event');
      console.error('Error adding event:', error);
    } finally {
      setSaving(false);
    }
  };

  const completeMatch = async () => {
    if (!match) return;

    setSaving(true);
    try {
      let winner = null;
      if (homeScore > awayScore) {
        winner = match.homeTeam;
        setMatchWinner('home');
      } else if (awayScore > homeScore) {
        winner = match.awayTeam;
        setMatchWinner('away');
      } else {
        setMatchWinner('draw');
      }
      
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/match/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homeScore: homeScore,
          awayScore: awayScore,
          status: 'completed',
          winnerId: winner,
          completedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setShowCompleteModal(true);
      } else {
        setError('Failed to complete match');
      }
    } catch (error) {
      setError('Failed to complete match');
      console.error('Error completing match:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndExit = () => {
    setShowCompleteModal(false);
    navigate('/football/live-scoring');
  };

  const getEventTypeLabel = (eventType) => {
    switch (eventType) {
      case 'goal': return 'Goal';
      case 'yellow_card': return 'Yellow Card';
      case 'red_card': return 'Red Card';
      case 'substitution': return 'Substitution';
      default: return eventType;
    }
  };

  const getPlayersForTeam = () => {
    return selectedTeam === 'home' ? homePlayers : awayPlayers;
  };

  if (loading) {
    return (
      <FootballPageLayout title="Live Scoring">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="mt-2 text-slate-400">Loading match details...</p>
        </div>
      </FootballPageLayout>
    );
  }

  if (error) {
    return (
      <FootballPageLayout title="Live Scoring">
        <div className="text-center text-red-400">
          <p>Error: {error}</p>
          <button 
            onClick={fetchMatchDetails}
            className="mt-4 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </FootballPageLayout>
    );
  }

  if (!match) {
    return (
      <FootballPageLayout title="Live Scoring">
        <div className="text-center text-slate-400">
          <p>Match not found</p>
        </div>
      </FootballPageLayout>
    );
  }

  return (
    <FootballPageLayout title="Live Scoring">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Match Header */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-300">
              {homeTeam?.name || 'Home Team'} vs {awayTeam?.name || 'Away Team'}
            </h2>
            <button
              onClick={() => navigate('/football/live-scoring')}
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              ← Back to Matches
            </button>
          </div>
          <div className="text-sm text-slate-400">
            Date: {match.date ? new Date(match.date).toLocaleString() : 'TBD'} | 
            Status: {match.status}
          </div>
        </div>

        {/* Live Score Display */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-300 mb-4">Live Score</h3>
          <div className="grid grid-cols-3 gap-6 items-center">
            {/* Home Team */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">{homeTeam?.name || 'Home Team'}</h4>
              <div className="text-4xl font-bold text-green-400 mb-4">{homeScore}</div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleScoreUpdate('home', 'decrement')}
                  disabled={homeScore === 0}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  -
                </button>
                <button
                  onClick={() => handleScoreUpdate('home', 'increment')}
                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* Score Display */}
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{homeScore} - {awayScore}</div>
              <div className="text-sm text-slate-400">Current Score</div>
            </div>

            {/* Away Team */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">{awayTeam?.name || 'Away Team'}</h4>
              <div className="text-4xl font-bold text-green-400 mb-4">{awayScore}</div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleScoreUpdate('away', 'decrement')}
                  disabled={awayScore === 0}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  -
                </button>
                <button
                  onClick={() => handleScoreUpdate('away', 'increment')}
                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Control */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-300 mb-4">Match Timer</h3>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-4xl font-bold text-white px-6">
              {formatTime(currentMinute, currentSecond)}
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleTimerControl('start')}
              disabled={isTimerRunning}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              Start
            </button>
            <button
              onClick={() => handleTimerControl('pause')}
              disabled={!isTimerRunning}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              Pause
            </button>
            <button
              onClick={() => handleTimerControl('reset')}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Event Controls */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-300 mb-4">Add Events</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Home Team Events */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">{homeTeam?.name || 'Home Team'} Events</h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleEventClick('goal', 'home')}
                  disabled={currentMinute === 0 && currentSecond === 0}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Goal
                </button>
                <button
                  onClick={() => handleEventClick('yellow_card', 'home')}
                  disabled={currentMinute === 0 && currentSecond === 0}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Yellow Card
                </button>
                <button
                  onClick={() => handleEventClick('red_card', 'home')}
                  disabled={currentMinute === 0 && currentSecond === 0}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Red Card
                </button>
                <button
                  onClick={() => handleEventClick('substitution', 'home')}
                  disabled={currentMinute === 0 && currentSecond === 0}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Substitution
                </button>
              </div>
            </div>

            {/* Away Team Events */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">{awayTeam?.name || 'Away Team'} Events</h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleEventClick('goal', 'away')}
                  disabled={currentMinute === 0 && currentSecond === 0}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Goal
                </button>
                <button
                  onClick={() => handleEventClick('yellow_card', 'away')}
                  disabled={currentMinute === 0 && currentSecond === 0}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Yellow Card
                </button>
                <button
                  onClick={() => handleEventClick('red_card', 'away')}
                  disabled={currentMinute === 0 && currentSecond === 0}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Red Card
                </button>
                <button
                  onClick={() => handleEventClick('substitution', 'away')}
                  disabled={currentMinute === 0 && currentSecond === 0}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  Substitution
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Match Events Timeline */}
        {match.events && match.events.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-300 mb-4">Match Events</h3>
            <div className="space-y-2">
              {match.events
                .sort((a, b) => a.minute - b.minute)
                .map((event, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded">
                    <span className="text-sm font-bold text-green-400">{event.minute}'</span>
                    <span className="text-sm text-white">{event.description}</span>
                    <span className="text-xs text-slate-400 capitalize">{event.type.replace('_', ' ')}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Complete Match Button */}
        <div className="text-center">
          <button
            onClick={completeMatch}
            disabled={saving}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300 disabled:opacity-50"
          >
            {saving ? 'Completing...' : 'Complete Match'}
          </button>
        </div>
      </div>

      {/* Player Selection Modal */}
      {showPlayerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-4 w-full">
            <h3 className="text-xl font-bold text-green-300 mb-4">
              Select Player for {getEventTypeLabel(selectedEventType)}
            </h3>
            <p className="text-slate-400 mb-4">
              {selectedTeam === 'home' ? homeTeam?.name : awayTeam?.name}
            </p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {getPlayersForTeam().map((player) => (
                <button
                  key={player._id}
                  onClick={() => setSelectedPlayer(player._id)}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    selectedPlayer === player._id
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  <div className="font-semibold">{player.name}</div>
                  <div className="text-sm text-slate-300">
                    {player.position} • #{player.jerseyNumber}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowPlayerModal(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePlayerSelect}
                disabled={!selectedPlayer || saving}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-green-300 mb-4">Match Complete!</h3>
            <p className="text-white mb-4">
              {matchWinner === 'draw' 
                ? 'The match ended in a draw!' 
                : `Winner: ${matchWinner === 'home' ? homeTeam?.name : awayTeam?.name}`
              }
            </p>
            <p className="text-slate-400 mb-6">Final Score: {homeScore} - {awayScore}</p>
            <button
              onClick={handleSaveAndExit}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Save & Exit
            </button>
          </div>
        </div>
      )}
    </FootballPageLayout>
  );
};

export default FootballMatchScoringPage;

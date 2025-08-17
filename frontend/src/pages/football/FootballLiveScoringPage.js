import React, { useState, useEffect } from 'react';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import { useNavigate } from 'react-router-dom';
import { FOOTBALL_SERVICE_URL } from '../../utils/api';

const FootballLiveScoringPage = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [matchesWithTeams, setMatchesWithTeams] = useState([]);
  const [showMatchCompleteModal, setShowMatchCompleteModal] = useState(false);
  const [matchWinner, setMatchWinner] = useState(null); // 'home', 'away', 'draw', or null
  const navigate = useNavigate();

  const CORRECT_PIN = '425';

  useEffect(() => {
    if (isAuthenticated) {
      fetchMatches();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedMatch) {
      initializeScores();
    }
  }, [selectedMatch]);

  // Helper to sort matches by scheduled time
  const sortByScheduledTime = (a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return aTime - bTime;
  };

  // Split matches into ongoing and scheduled (case-insensitive)
  const ongoingMatches = matchesWithTeams.filter(m => (m.status && (m.status.toLowerCase() === 'live' || m.status.toLowerCase() === 'ongoing'))).sort(sortByScheduledTime);
  const scheduledMatches = matchesWithTeams.filter(m => m.status && m.status.toLowerCase() === 'scheduled').sort(sortByScheduledTime);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 3 digits
    if (/^\d{0,3}$/.test(value)) {
      setPin(value);
      setPinError('');
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/match`);
      if (response.ok) {
        const data = await response.json();
        const matchesArray = Array.isArray(data) ? data : (data?.data || []);
        setMatches(matchesArray);
        
        // Fetch team names for each match
        const matchesWithTeamNames = await Promise.all(
          matchesArray.map(async (match) => {
            let homeTeamName = 'Unknown Team';
            let awayTeamName = 'Unknown Team';
            
            try {
              if (match.homeTeam) {
                const homeTeamRes = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/team/${match.homeTeam}`);
                if (homeTeamRes.ok) {
                  const homeTeamData = await homeTeamRes.json();
                  homeTeamName = homeTeamData.data?.name || 'Unknown Team';
                }
              }
              
              if (match.awayTeam) {
                const awayTeamRes = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/team/${match.awayTeam}`);
                if (awayTeamRes.ok) {
                  const awayTeamData = await awayTeamRes.json();
                  awayTeamName = awayTeamData.data?.name || 'Unknown Team';
                }
              }
            } catch (error) {
              console.error('Error fetching team names for match:', error);
            }
            
            return {
              ...match,
              homeTeamName,
              awayTeamName
            };
          })
        );
        
        setMatchesWithTeams(matchesWithTeamNames);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const initializeScores = () => {
    if (selectedMatch) {
      setHomeScore(selectedMatch.homeScore || 0);
      setAwayScore(selectedMatch.awayScore || 0);
      setCurrentMinute(0);
      setMatchWinner(null);
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

  const handleMinuteUpdate = (action) => {
    if (action === 'increment') {
      setCurrentMinute(prev => Math.min(prev + 1, 90));
    } else if (action === 'decrement') {
      setCurrentMinute(prev => Math.max(prev - 1, 0));
    }
  };

  const addEvent = async (eventType, team, playerId = null, description = '') => {
    if (!selectedMatch || currentMinute === 0) return;

    setLoading(true);
    try {
      const newEvent = {
        minute: currentMinute,
        type: eventType,
        team: team === 'home' ? selectedMatch.homeTeam : selectedMatch.awayTeam,
        player: playerId,
        description: description || `${eventType.replace('_', ' ')} at minute ${currentMinute}`
      };

      const updatedEvents = [...(selectedMatch.events || []), newEvent];
      
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/match/${selectedMatch._id}`, {
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
        // Refresh matches
        fetchMatches();
      }
    } catch (error) {
      setError('Failed to add event');
      console.error('Error adding event:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeMatch = async () => {
    if (!selectedMatch) return;

    setLoading(true);
    try {
      let winner = null;
      if (homeScore > awayScore) {
        winner = selectedMatch.homeTeam;
        setMatchWinner('home');
      } else if (awayScore > homeScore) {
        winner = selectedMatch.awayTeam;
        setMatchWinner('away');
      } else {
        setMatchWinner('draw');
      }
      
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/match/${selectedMatch._id}`, {
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
        setShowMatchCompleteModal(true);
        fetchMatches();
      }
    } catch (error) {
      setError('Failed to complete match');
      console.error('Error completing match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndExit = () => {
    setShowMatchCompleteModal(false);
    navigate('/football');
  };

  // PIN Authentication Modal
  if (!isAuthenticated) {
    return (
      <FootballPageLayout title="Live Scoring">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-slate-800/50 rounded-lg p-8 shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-300 mb-2">Live Scoring Access</h2>
              <p className="text-slate-400">Enter the 3-digit PIN to access live scoring</p>
            </div>
            
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-slate-300 mb-2">
                  PIN Code
                </label>
                <input
                  type="password"
                  id="pin"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="Enter 3-digit PIN"
                  maxLength={3}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white text-center text-2xl font-bold tracking-widest rounded-md shadow-sm py-4 px-3 focus:ring-green-500 focus:border-green-500"
                  autoFocus
                />
              </div>
              
              {pinError && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-center">
                  {pinError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={pin.length !== 3}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Access Live Scoring
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/football')}
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                ← Back to Matches
              </button>
            </div>
          </div>
        </div>
      </FootballPageLayout>
    );
  }

  // Live Scoring Interface (only shown after authentication)
  return (
    <FootballPageLayout title="Live Scoring">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Ongoing Matches */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-300 mb-4">Ongoing Matches</h3>
          {ongoingMatches.length === 0 && <div className="text-slate-400">No ongoing matches.</div>}
          <div className="space-y-3">
            {ongoingMatches.map(match => (
              <div
                key={match._id}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-colors border-slate-700 bg-slate-700/30 hover:border-green-400`}
                onClick={() => navigate(`/football/live-scoring/${match._id}`)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{match.homeTeamName} vs {match.awayTeamName}</span>
                  <span className="text-xs text-slate-400">{match.date ? new Date(match.date).toLocaleString() : 'TBD'}</span>
                </div>
                <div className="text-sm text-green-300 mt-1">Status: {match.status}</div>
                <div className="text-sm text-white mt-1">Score: {match.homeScore} - {match.awayScore}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scheduled Matches */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-300 mb-4">Scheduled Matches</h3>
          {scheduledMatches.length === 0 && <div className="text-slate-400">No scheduled matches.</div>}
          <div className="space-y-3">
            {scheduledMatches.map(match => (
              <div
                key={match._id}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-colors border-slate-700 bg-slate-700/30 hover:border-green-400`}
                onClick={() => navigate(`/football/live-scoring/${match._id}`)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{match.homeTeamName} vs {match.awayTeamName}</span>
                  <span className="text-xs text-slate-400">{match.date ? new Date(match.date).toLocaleString() : 'TBD'}</span>
                </div>
                <div className="text-sm text-green-300 mt-1">Status: {match.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Match Complete Modal */}
      {showMatchCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-green-300 mb-4">Match Complete!</h3>
            <p className="text-white mb-4">
              {matchWinner === 'draw' 
                ? 'The match ended in a draw!' 
                : `Winner: ${matchWinner === 'home' ? selectedMatch?.homeTeamName : selectedMatch?.awayTeamName}`
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

export default FootballLiveScoringPage;

import React, { useState, useEffect } from 'react';
import BadmintonPageLayout from '../../components/badminton/BadmintonPageLayout';
import { useNavigate } from 'react-router-dom';

const BadmintonLiveScoringPage = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);
  const [playerOneNames, setPlayerOneNames] = useState([]); // Array of names
  const [playerTwoNames, setPlayerTwoNames] = useState([]); // Array of names
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [matchesWithNames, setMatchesWithNames] = useState([]);
  const [currentServer, setCurrentServer] = useState('one'); // 'one' or 'two'
  const [setWinner, setSetWinner] = useState(null); // 'one', 'two', or null
  const [matchWinner, setMatchWinner] = useState(null); // 'one', 'two', or null
  const [showSetCompleteModal, setShowSetCompleteModal] = useState(false);
  const [showMatchCompleteModal, setShowMatchCompleteModal] = useState(false);
  const navigate = useNavigate();

  const CORRECT_PIN = '425';

  useEffect(() => {
    if (isAuthenticated) {
      fetchMatches();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedMatch) {
      fetchPlayerNames();
      initializeScores();
    }
  }, [selectedMatch]);

  // Helper to join player names
  const joinNames = (names) => names.length > 1 ? names.join(' & ') : names[0] || '';

  // Helper to sort matches by scheduled time
  const sortByScheduledTime = (a, b) => {
    const aTime = a.scheduledTime ? new Date(a.scheduledTime).getTime() : 0;
    const bTime = b.scheduledTime ? new Date(b.scheduledTime).getTime() : 0;
    return aTime - bTime;
  };

  // Split matches into ongoing and scheduled (case-insensitive)
  const ongoingMatches = matchesWithNames.filter(m => (m.status && (m.status.toLowerCase() === 'live' || m.status.toLowerCase() === 'ongoing'))).sort(sortByScheduledTime);
  const scheduledMatches = matchesWithNames.filter(m => m.status && m.status.toLowerCase() === 'scheduled').sort(sortByScheduledTime);

  // DEBUG: Log matchesWithNames and their statuses
  console.log('matchesWithNames:', matchesWithNames.map(m => ({id: m._id, status: m.status})));

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
      const response = await fetch('https://juet-play.onrender.com/api/v1/match');
      if (response.ok) {
        const data = await response.json();
        const matchesArray = Array.isArray(data) ? data : (data?.data || []);
        setMatches(matchesArray);
        
        // Fetch player names for each match
        const matchesWithPlayerNames = await Promise.all(
          matchesArray.map(async (match) => {
            let playerOneName = 'Unknown Player';
            let playerTwoName = 'Unknown Player';
            
            try {
              if (match.playerOneIds?.[0]) {
                const playerOneRes = await fetch(`https://juet-play.onrender.com/api/v1/player/${match.playerOneIds[0]}`);
                if (playerOneRes.ok) {
                  const playerOneData = await playerOneRes.json();
                  playerOneName = playerOneData.data?.name || 'Unknown Player';
                }
              }
              
              if (match.playerTwoIds?.[0]) {
                const playerTwoRes = await fetch(`https://juet-play.onrender.com/api/v1/player/${match.playerTwoIds[0]}`);
                if (playerTwoRes.ok) {
                  const playerTwoData = await playerTwoRes.json();
                  playerTwoName = playerTwoData.data?.name || 'Unknown Player';
                }
              }
            } catch (error) {
              console.error('Error fetching player names for match:', error);
            }
            
            return {
              ...match,
              playerOneName,
              playerTwoName
            };
          })
        );
        
        setMatchesWithNames(matchesWithPlayerNames);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchPlayerNames = async () => {
    if (!selectedMatch) return;
    try {
      // Fetch all player names for both teams
      const fetchNames = async (ids) => {
        if (!ids || ids.length === 0) return [];
        const names = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`https://juet-play.onrender.com/api/v1/player/${id}`);
            if (res.ok) {
              const data = await res.json();
              return data.data?.name || 'Unknown';
            }
            return 'Unknown';
          })
        );
        return names;
      };
      const oneNames = await fetchNames(selectedMatch.playerOneIds);
      const twoNames = await fetchNames(selectedMatch.playerTwoIds);
      setPlayerOneNames(oneNames);
      setPlayerTwoNames(twoNames);
    } catch (error) {
      setPlayerOneNames(['Unknown']);
      setPlayerTwoNames(['Unknown']);
    }
  };

  const initializeScores = () => {
    if (selectedMatch?.sets && selectedMatch.sets.length > 0) {
      const lastSet = selectedMatch.sets[selectedMatch.sets.length - 1];
      setCurrentSet(lastSet.setNumber + 1);
      setPlayerOneScore(0);
      setPlayerTwoScore(0);
      // Set initial server based on who won the last point of the previous set
      setCurrentServer(lastSet.winnerId === selectedMatch.playerOneIds?.[0] ? 'one' : 'two');
    } else {
      setCurrentSet(1);
      setPlayerOneScore(0);
      setPlayerTwoScore(0);
      setCurrentServer('one'); // Default to player one serving first
    }
    setSetWinner(null);
    setMatchWinner(null);
  };

  const handleScoreUpdate = (player, action) => {
    if (player === 'one') {
      if (action === 'increment') {
        setPlayerOneScore(prev => Math.min(prev + 1, 30));
        // Winner of the point serves next
        setCurrentServer('one');
      } else if (action === 'decrement') {
        setPlayerOneScore(prev => Math.max(prev - 1, 0));
      }
    } else {
      if (action === 'increment') {
        setPlayerTwoScore(prev => Math.min(prev + 1, 30));
        // Winner of the point serves next
        setCurrentServer('two');
      } else if (action === 'decrement') {
        setPlayerTwoScore(prev => Math.max(prev - 1, 0));
      }
    }
  };

  const isSetComplete = () => {
    // Badminton set rules: first to 21 points, must win by 2 points
    const maxScore = Math.max(playerOneScore, playerTwoScore);
    const minScore = Math.min(playerOneScore, playerTwoScore);
    
    if (maxScore >= 21 && (maxScore - minScore) >= 2) {
      return true;
    }
    
    // If both players reach 29, next point wins
    if (maxScore >= 29) {
      return true;
    }
    
    return false;
  };

  const getSetWinner = () => {
    if (playerOneScore > playerTwoScore) {
      return selectedMatch?.playerOneIds?.[0];
    } else {
      return selectedMatch?.playerTwoIds?.[0];
    }
  };

  const handleSetComplete = () => {
    const winner = playerOneScore > playerTwoScore ? 'one' : 'two';
    setSetWinner(winner);
    setShowSetCompleteModal(true);
  };

  const confirmSetComplete = async () => {
    setShowSetCompleteModal(false);
    await saveSet();
  };

  const saveSet = async () => {
    if (!selectedMatch) return;

    setLoading(true);
    try {
      const newSet = {
        setNumber: currentSet,
        playerOneScore: playerOneScore,
        playerTwoScore: playerTwoScore,
        winnerId: getSetWinner()
      };

      const updatedSets = [...(selectedMatch.sets || []), newSet];
      
      const response = await fetch(`https://juet-play.onrender.com/api/v1/match/${selectedMatch._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sets: updatedSets,
          status: 'ongoing'
        }),
      });

      if (response.ok) {
        // Check if match is complete (best of 3 sets)
        const playerOneSetsWon = updatedSets.filter(set => set.winnerId === selectedMatch.playerOneIds?.[0]).length;
        const playerTwoSetsWon = updatedSets.filter(set => set.winnerId === selectedMatch.playerTwoIds?.[0]).length;
        
        if (playerOneSetsWon >= 2 || playerTwoSetsWon >= 2) {
          // Match is complete
          const matchWinnerId = playerOneSetsWon >= 2 ? selectedMatch.playerOneIds?.[0] : selectedMatch.playerTwoIds?.[0];
          setMatchWinner(playerOneSetsWon >= 2 ? 'one' : 'two');
          
          await fetch(`https://juet-play.onrender.com/api/v1/match/${selectedMatch._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'completed',
              winnerId: matchWinnerId,
              completedAt: new Date().toISOString()
            }),
          });
          
          setShowMatchCompleteModal(true);
        } else {
          // Continue to next set
          setCurrentSet(prev => prev + 1);
          setPlayerOneScore(0);
          setPlayerTwoScore(0);
          // Winner of the set serves first in the next set
          setCurrentServer(setWinner);
          setSetWinner(null);
        }
        
        // Refresh matches
        fetchMatches();
      }
    } catch (error) {
      setError('Failed to save set');
      console.error('Error saving set:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndExit = () => {
    setShowMatchCompleteModal(false);
    navigate('/badminton');
  };

  const getMatchStatus = () => {
    if (!selectedMatch) return '';
    
    const playerOneSetsWon = selectedMatch.sets?.filter(set => set.winnerId === selectedMatch.playerOneIds?.[0]).length || 0;
    const playerTwoSetsWon = selectedMatch.sets?.filter(set => set.winnerId === selectedMatch.playerTwoIds?.[0]).length || 0;
    
    return `${playerOneSetsWon} - ${playerTwoSetsWon}`;
  };

  const getServerName = () => {
    return currentServer === 'one' ? joinNames(playerOneNames) : joinNames(playerTwoNames);
  };

  // PIN Authentication Modal
  if (!isAuthenticated) {
    return (
      <BadmintonPageLayout title="Live Scoring">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-slate-800/50 rounded-lg p-8 shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-orange-300 mb-2">Live Scoring Access</h2>
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
                  className="w-full bg-slate-700/50 border border-slate-600 text-white text-center text-2xl font-bold tracking-widest rounded-md shadow-sm py-4 px-3 focus:ring-orange-500 focus:border-orange-500"
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
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Access Live Scoring
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/badminton')}
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                ← Back to Matches
              </button>
            </div>
          </div>
        </div>
      </BadmintonPageLayout>
    );
  }

  // Live Scoring Interface (only shown after authentication)
  return (
    <BadmintonPageLayout title="Live Scoring">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Ongoing Matches */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-300 mb-4">Ongoing Matches</h3>
          {ongoingMatches.length === 0 && <div className="text-slate-400">No ongoing matches.</div>}
          <div className="space-y-3">
            {ongoingMatches.map(match => (
              <div
                key={match._id}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-colors border-slate-700 bg-slate-700/30 hover:border-orange-400`}
                onClick={() => navigate(`/live-scoring/${match._id}`)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{joinNames([match.playerOneName])} vs {joinNames([match.playerTwoName])}</span>
                  <span className="text-xs text-slate-400">{match.scheduledTime ? new Date(match.scheduledTime).toLocaleString() : 'TBD'}</span>
                </div>
                <div className="text-sm text-orange-300 mt-1">Status: {match.status}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Scheduled Matches */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-300 mb-4">Scheduled Matches</h3>
          {scheduledMatches.length === 0 && <div className="text-slate-400">No scheduled matches.</div>}
          <div className="space-y-3">
            {scheduledMatches.map(match => (
              <div
                key={match._id}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-colors border-slate-700 bg-slate-700/30 hover:border-orange-400`}
                onClick={() => navigate(`/live-scoring/${match._id}`)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{joinNames([match.playerOneName])} vs {joinNames([match.playerTwoName])}</span>
                  <span className="text-xs text-slate-400">{match.scheduledTime ? new Date(match.scheduledTime).toLocaleString() : 'TBD'}</span>
                </div>
                <div className="text-sm text-orange-300 mt-1">Status: {match.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BadmintonPageLayout>
  );
};

export default BadmintonLiveScoringPage; 
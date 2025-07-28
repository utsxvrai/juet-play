import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BadmintonPageLayout from '../../components/badminton/BadmintonPageLayout';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002');

const BadmintonMatchScoringPage = () => {
  const { matchid } = useParams();
  const [match, setMatch] = useState(null);
  const [playerOneNames, setPlayerOneNames] = useState([]);
  const [playerTwoNames, setPlayerTwoNames] = useState([]);
  const [currentSet, setCurrentSet] = useState(1);
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);
  const [currentServer, setCurrentServer] = useState('one');
  const [setWinner, setSetWinner] = useState(null);
  const [matchWinner, setMatchWinner] = useState(null);
  const [showSetCompleteModal, setShowSetCompleteModal] = useState(false);
  const [showMatchCompleteModal, setShowMatchCompleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/v1/match/${matchid}`);
        if (response.ok) {
          const data = await response.json();
          setMatch(data.data || data);
        }
      } catch (err) {
        setError('Failed to fetch match');
      }
    };
    fetchMatch();

    // Socket.io: join match room and listen for updates
    socket.emit('joinMatch', matchid);
    socket.on('scoreUpdate', (updatedMatch) => {
      setMatch(updatedMatch);
    });
    return () => {
      socket.emit('leaveMatch', matchid);
      socket.off('scoreUpdate');
    };
  }, [matchid]);

  // Refetch player names whenever match changes
  useEffect(() => {
    const fetchNames = async (ids) => {
      if (!ids || ids.length === 0) return [];
      const names = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`http://localhost:3002/api/v1/player/${id}`);
          if (res.ok) {
            const data = await res.json();
            return data.data?.name || 'Unknown';
          }
          return 'Unknown';
        })
      );
      return names;
    };
    if (match) {
      (async () => {
        const oneNames = await fetchNames(match.playerOneIds);
        const twoNames = await fetchNames(match.playerTwoIds);
        setPlayerOneNames(oneNames);
        setPlayerTwoNames(twoNames);
      })();
    }
  }, [match?.playerOneIds, match?.playerTwoIds]);

  useEffect(() => {
    if (match) {
      initializeScores();
    }
    // eslint-disable-next-line
  }, [match]);

  const initializeScores = () => {
    if (match?.sets && match.sets.length > 0) {
      const lastSet = match.sets[match.sets.length - 1];
      // If last set is completed (has winnerId), start a new set
      if (lastSet.winnerId) {
        setCurrentSet(lastSet.setNumber + 1);
        setPlayerOneScore(0);
        setPlayerTwoScore(0);
        setCurrentServer(lastSet.winnerId === match.playerOneIds?.[0] ? 'one' : 'two');
      } else {
        // Continue the last set in progress
        setCurrentSet(lastSet.setNumber);
        setPlayerOneScore(lastSet.playerOneScore || 0);
        setPlayerTwoScore(lastSet.playerTwoScore || 0);
        setCurrentServer(currentServer => currentServer); // keep as is
      }
    } else {
      setCurrentSet(1);
      setPlayerOneScore(0);
      setPlayerTwoScore(0);
      setCurrentServer('one');
    }
    setSetWinner(null);
    setMatchWinner(null);
  };

  const joinNames = (names) => names.length > 1 ? names.join(' & ') : names[0] || '';

  const handleScoreUpdate = async (player, action) => {
    let newPlayerOneScore = playerOneScore;
    let newPlayerTwoScore = playerTwoScore;
    let newServer = currentServer;
    if (player === 'one') {
      if (action === 'increment') {
        newPlayerOneScore = Math.min(playerOneScore + 1, 30);
        newServer = 'one';
      } else if (action === 'decrement') {
        newPlayerOneScore = Math.max(playerOneScore - 1, 0);
      }
    } else {
      if (action === 'increment') {
        newPlayerTwoScore = Math.min(playerTwoScore + 1, 30);
        newServer = 'two';
      } else if (action === 'decrement') {
        newPlayerTwoScore = Math.max(playerTwoScore - 1, 0);
      }
    }
    setPlayerOneScore(newPlayerOneScore);
    setPlayerTwoScore(newPlayerTwoScore);
    setCurrentServer(newServer);
    // Save the current set progress to the backend for real-time DB update
    if (match) {
      const sets = [...(match.sets || [])];
      // Always update the last set in progress (or create if none)
      let setIdx = sets.length > 0 ? sets.length - 1 : -1;
      if (setIdx === -1 || sets[setIdx].winnerId) {
        // No set in progress, create new
        sets.push({
          setNumber: sets.length + 1,
          playerOneScore: newPlayerOneScore,
          playerTwoScore: newPlayerTwoScore,
          winnerId: null
        });
      } else {
        // Update the set in progress
        sets[setIdx] = {
          ...sets[setIdx],
          playerOneScore: newPlayerOneScore,
          playerTwoScore: newPlayerTwoScore
        };
      }
      // Save to backend
      fetch(`http://localhost:3002/api/v1/match/${match._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sets, status: 'ongoing' })
      });
    }
  };

  const isSetComplete = () => {
    const maxScore = Math.max(playerOneScore, playerTwoScore);
    const minScore = Math.min(playerOneScore, playerTwoScore);
    if (maxScore >= 21 && (maxScore - minScore) >= 2) {
      return true;
    }
    if (maxScore >= 29) {
      return true;
    }
    return false;
  };

  const getSetWinner = () => {
    if (playerOneScore > playerTwoScore) {
      return match?.playerOneIds?.[0];
    } else {
      return match?.playerTwoIds?.[0];
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
    if (!match) return;
    setLoading(true);
    try {
      const newSet = {
        setNumber: currentSet,
        playerOneScore: playerOneScore,
        playerTwoScore: playerTwoScore,
        winnerId: getSetWinner()
      };
      const updatedSets = [...(match.sets || [])];
      if (updatedSets.length > 0 && !updatedSets[updatedSets.length - 1].winnerId) {
        // Replace the in-progress set with the completed one
        updatedSets[updatedSets.length - 1] = newSet;
      } else {
        // No incomplete set, just add this
        updatedSets.push(newSet);
      }
      const response = await fetch(`http://localhost:3002/api/v1/match/${match._id}`, {
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
        const playerOneSetsWon = updatedSets.filter(set => set.winnerId === match.playerOneIds?.[0]).length;
        const playerTwoSetsWon = updatedSets.filter(set => set.winnerId === match.playerTwoIds?.[0]).length;
        if (playerOneSetsWon >= 2 || playerTwoSetsWon >= 2) {
          const matchWinnerId = playerOneSetsWon >= 2 ? match.playerOneIds?.[0] : match.playerTwoIds?.[0];
          setMatchWinner(playerOneSetsWon >= 2 ? 'one' : 'two');
          await fetch(`http://localhost:3002/api/v1/match/${match._id}`, {
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
          setCurrentSet(prev => prev + 1);
          setPlayerOneScore(0);
          setPlayerTwoScore(0);
          setCurrentServer(setWinner);
          setSetWinner(null);
        }
        // Refresh match
        const updatedMatch = await fetch(`http://localhost:3002/api/v1/match/${match._id}`);
        if (updatedMatch.ok) {
          const data = await updatedMatch.json();
          setMatch(data.data || data);
        }
      }
    } catch (error) {
      setError('Failed to save set');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndExit = () => {
    setShowMatchCompleteModal(false);
    navigate('/badminton');
  };

  const getMatchStatus = () => {
    if (!match) return '';
    const playerOneSetsWon = match.sets?.filter(set => set.winnerId === match.playerOneIds?.[0]).length || 0;
    const playerTwoSetsWon = match.sets?.filter(set => set.winnerId === match.playerTwoIds?.[0]).length || 0;
    return `${playerOneSetsWon} - ${playerTwoSetsWon}`;
  };

  const getServerName = () => {
    return currentServer === 'one' ? joinNames(playerOneNames) : joinNames(playerTwoNames);
  };

  if (!match) {
    return (
      <BadmintonPageLayout title="Live Scoring">
        <div className="text-center text-xl p-10">Loading match details...</div>
      </BadmintonPageLayout>
    );
  }

  return (
    <BadmintonPageLayout title="Live Scoring">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Match Info */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-orange-300">Match Status</h3>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-white">{getMatchStatus()}</span>
              <button
                onClick={() => navigate('/badminton')}
                className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300"
              >
                Save & Exit
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div>
              <p className="text-lg font-semibold text-white">{joinNames(playerOneNames)}</p>
              <p className="text-sm text-slate-400">Player One</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{joinNames(playerTwoNames)}</p>
              <p className="text-sm text-slate-400">Player Two</p>
            </div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Current Set:</span>
              <span className="text-orange-400 font-bold">Set {currentSet}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-300">Match Format:</span>
              <span className="text-orange-400 font-bold">Best of 3 Sets</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-300">Match Status:</span>
              <span className={`font-bold ${match.status === 'completed' ? 'text-green-400' : match.status === 'ongoing' ? 'text-orange-400' : 'text-blue-400'}`}>
                {match.status?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center bg-orange-600/20 border border-orange-500 rounded-lg px-4 py-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-orange-300 font-semibold">
                Serving: {getServerName()}
              </span>
            </div>
          </div>
        </div>
        {/* Current Set Scoring */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-300 mb-4">Set {currentSet}</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-4">{joinNames(playerOneNames)}</h4>
              <div className="text-6xl font-bold text-orange-400 mb-4">{playerOneScore}</div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleScoreUpdate('one', 'decrement')}
                  disabled={playerOneScore === 0}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <button
                  onClick={() => handleScoreUpdate('one', 'increment')}
                  disabled={playerOneScore === 30}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-4">{joinNames(playerTwoNames)}</h4>
              <div className="text-6xl font-bold text-orange-400 mb-4">{playerTwoScore}</div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleScoreUpdate('two', 'decrement')}
                  disabled={playerTwoScore === 0}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <button
                  onClick={() => handleScoreUpdate('two', 'increment')}
                  disabled={playerTwoScore === 30}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          {/* Set Actions */}
          <div className="mt-6 text-center space-y-3">
            {isSetComplete() && (
              <button
                onClick={handleSetComplete}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Complete Set'}
              </button>
            )}
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => {
                  if (playerOneScore > playerTwoScore) {
                    setSetWinner('one');
                  } else {
                    setSetWinner('two');
                  }
                  setShowSetCompleteModal(true);
                }}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300"
              >
                End Set Manually
              </button>
              <button
                onClick={() => {
                  const playerOneSetsWon = match.sets?.filter(set => set.winnerId === match.playerOneIds?.[0]).length || 0;
                  const playerTwoSetsWon = match.sets?.filter(set => set.winnerId === match.playerTwoIds?.[0]).length || 0;
                  if (playerOneSetsWon >= 1 || playerTwoSetsWon >= 1) {
                    setMatchWinner(playerOneSetsWon >= 1 ? 'one' : 'two');
                    setShowMatchCompleteModal(true);
                  } else {
                    alert('At least one set must be completed to end the match.');
                  }
                }}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300"
              >
                End Match
              </button>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-300 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setPlayerOneScore(0);
                setPlayerTwoScore(0);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors duration-300"
            >
              Reset Set Score
            </button>
            <button
              onClick={() => {
                setCurrentServer(currentServer === 'one' ? 'two' : 'one');
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors duration-300"
            >
              Switch Server
            </button>
            <button
              onClick={() => {
                if (playerOneScore > 0) setPlayerOneScore(prev => prev - 1);
              }}
              disabled={playerOneScore === 0}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Undo Last Point
            </button>
            <button
              onClick={() => {
                const newSet = {
                  setNumber: currentSet,
                  playerOneScore: playerOneScore,
                  playerTwoScore: playerTwoScore,
                  winnerId: getSetWinner(),
                  completedAt: new Date().toISOString()
                };
                console.log('Set Data:', newSet);
              }}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors duration-300"
            >
              Debug Set Data
            </button>
          </div>
        </div>
        {/* Previous Sets */}
        {match.sets && match.sets.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-orange-300 mb-4">Previous Sets</h3>
            <div className="space-y-3">
              {match.sets.map((set, index) => (
                <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-white">Set {set.setNumber}</span>
                    <span className="text-orange-400 font-bold text-lg">{set.playerOneScore} - {set.playerTwoScore}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">
                      Winner: <span className="text-white font-semibold">
                        {set.winnerId === match.playerOneIds?.[0] ? joinNames(playerOneNames) : joinNames(playerTwoNames)}
                      </span>
                    </span>
                    <span className="text-slate-400">
                      Duration: {set.completedAt ? new Date(set.completedAt).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {/* Set Complete Modal */}
        {showSetCompleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-orange-300 mb-4">Set Complete!</h3>
              <p className="text-white mb-4">
                Set {currentSet} winner: <span className="font-bold text-orange-400">
                  {setWinner === 'one' ? joinNames(playerOneNames) : joinNames(playerTwoNames)}
                </span>
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={confirmSetComplete}
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Continue
                </button>
                <button
                  onClick={() => setShowSetCompleteModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Match Complete Modal */}
        {showMatchCompleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-orange-300 mb-4">Match Complete!</h3>
              <p className="text-white mb-4">
                Match winner: <span className="font-bold text-orange-400">
                  {matchWinner === 'one' ? joinNames(playerOneNames) : joinNames(playerTwoNames)}
                </span>
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveAndExit}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Save & Exit
                </button>
                <button
                  onClick={() => setShowMatchCompleteModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BadmintonPageLayout>
  );
};

export default BadmintonMatchScoringPage; 
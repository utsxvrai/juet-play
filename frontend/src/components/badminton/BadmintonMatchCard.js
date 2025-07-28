import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BadmintonMatchCard = ({ match }) => {
  const [playerOneNames, setPlayerOneNames] = useState([]);
  const [playerTwoNames, setPlayerTwoNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerNames = async () => {
      try {
        // Fetch all player names for both teams
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
        const oneNames = await fetchNames(match.playerOneIds);
        const twoNames = await fetchNames(match.playerTwoIds);
        setPlayerOneNames(oneNames);
        setPlayerTwoNames(twoNames);
      } catch (error) {
        console.error('Error fetching player names:', error);
        setPlayerOneNames(['Unknown']);
        setPlayerTwoNames(['Unknown']);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerNames();
  }, [match]);

  if (!match) return null;

  const { _id, status, format, sets, scheduledTime } = match;

  // Get current set scores
  const currentSet = sets && sets.length > 0 ? sets[sets.length - 1] : null;
  const playerOneScore = currentSet?.playerOneScore || 0;
  const playerTwoScore = currentSet?.playerTwoScore || 0;

  // Calculate sets won
  const playerOneSetsWon = sets ? sets.filter(set => set.winnerId === match.playerOneIds?.[0]).length : 0;
  const playerTwoSetsWon = sets ? sets.filter(set => set.winnerId === match.playerTwoIds?.[0]).length : 0;

  // Format player names for display
  const playerOneDisplay = playerOneNames.length > 1 ? playerOneNames.join(' & ') : playerOneNames[0] || 'Player 1';
  const playerTwoDisplay = playerTwoNames.length > 1 ? playerTwoNames.join(' & ') : playerTwoNames[0] || 'Player 2';

  // Winner display for completed matches (case-insensitive)
  let winnerLine = null;
  const isCompleted = status && (status.toLowerCase() === 'completed' || status.toLowerCase() === 'ended');
  if (isCompleted && sets && sets.length > 0) {
    const winnerName = playerOneSetsWon > playerTwoSetsWon ? playerOneDisplay : playerTwoDisplay;
    winnerLine = `${winnerName} won by ${playerOneSetsWon}-${playerTwoSetsWon}`;
  }

  let statusText = status ? status.toUpperCase() : 'SCHEDULED';
  let statusColor = 'bg-yellow-500 text-slate-900';
  let borderColor = 'border-yellow-500';

  if (status === 'LIVE' || status === 'ongoing') {
    statusColor = 'bg-red-500';
    borderColor = 'border-red-500';
  } else if (status === 'COMPLETED' || status === 'ended') {
    statusColor = 'bg-slate-600';
    borderColor = 'border-slate-600';
  }

  const formatText = format === 'singles' ? 'Singles' : format === 'doubles' ? 'Doubles' : 'Unknown';

  return (
    <div 
      className={`bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-orange-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 ${borderColor}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold tracking-wider ${statusColor}`}>{statusText}</span>
        <span className="text-xs text-slate-400 capitalize">{formatText}</span>
      </div>
      
      {loading ? (
        <div className="text-slate-400 text-center py-4">Loading players...</div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-4">
            {/* Player One */}
            <div className="flex justify-between items-center">
              <div className="flex items-center min-w-0">
                <span className="text-lg font-semibold text-orange-300 truncate" title={playerOneDisplay}>{playerOneDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-400">{playerOneSetsWon}</span>
                <span className="text-sm text-slate-300">({playerOneScore})</span>
              </div>
            </div>
            
            {/* VS */}
            <div className="text-center text-slate-400 text-sm font-medium">VS</div>
            
            {/* Player Two */}
            <div className="flex justify-between items-center">
              <div className="flex items-center min-w-0">
                <span className="text-lg font-semibold text-orange-300 truncate" title={playerTwoDisplay}>{playerTwoDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-400">{playerTwoSetsWon}</span>
                <span className="text-sm text-slate-300">({playerTwoScore})</span>
              </div>
            </div>
          </div>
          
          {/* Current Set Info */}
          {currentSet && (
            <p className="text-sm font-medium text-orange-300 mb-3">
              Set {currentSet.setNumber} - {playerOneScore} - {playerTwoScore}
            </p>
          )}

          {/* Winner line for completed match */}
          {winnerLine && (
            <p className="text-center text-green-400 font-semibold mb-2">{winnerLine}</p>
          )}
          
          {/* Scheduled Time */}
          {scheduledTime && (
            <p className="text-xs text-slate-400 mb-4">
              {new Date(scheduledTime).toLocaleString()}
            </p>
          )}
        </>
      )}
      
      <div className="mt-4 flex justify-end">
        <Link 
          to={`/badminton/match/${_id}`}
          className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BadmintonMatchCard; 
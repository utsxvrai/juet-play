import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BadmintonPageLayout from '../../../components/badminton/BadmintonPageLayout';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002');

const BadmintonMatchDetailsPage = () => {
  const { matchId } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [playerOne, setPlayerOne] = useState([]); // Array of player objects
  const [playerTwo, setPlayerTwo] = useState([]); // Array of player objects
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('MATCH');
  const [activeSubTab, setActiveSubTab] = useState('SUMMARY');

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        // Fetch match details
        const matchRes = await fetch(`http://localhost:3002/api/v1/match/${matchId}`);
        if (matchRes.ok) {
          const matchData = await matchRes.json();
          setMatchDetails(matchData.data || matchData);

          // Fetch all player details for both teams
          const fetchPlayers = async (ids) => {
            if (!ids || ids.length === 0) return [];
            const players = await Promise.all(
              ids.map(async (id) => {
                const res = await fetch(`http://localhost:3002/api/v1/player/${id}`);
                if (res.ok) {
                  const data = await res.json();
                  return data.data || data;
                }
                return { name: 'Unknown', rank: 'N/A' };
              })
            );
            return players;
          };

          const onePlayers = await fetchPlayers(matchData.data?.playerOneIds);
          const twoPlayers = await fetchPlayers(matchData.data?.playerTwoIds);
          setPlayerOne(onePlayers);
          setPlayerTwo(twoPlayers);
        }
      } catch (error) {
        console.error('Error fetching match details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();

    // Socket.io: join match room and listen for updates
    socket.emit('joinMatch', matchId);
    socket.on('scoreUpdate', (updatedMatch) => {
      setMatchDetails(updatedMatch);
      // Refetch player details for both teams
      const fetchPlayers = async (ids) => {
        if (!ids || ids.length === 0) return [];
        const players = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`http://localhost:3002/api/v1/player/${id}`);
            if (res.ok) {
              const data = await res.json();
              return data.data || data;
            }
            return { name: 'Unknown', rank: 'N/A' };
          })
        );
        return players;
      };
      (async () => {
        const onePlayers = await fetchPlayers(updatedMatch.playerOneIds);
        const twoPlayers = await fetchPlayers(updatedMatch.playerTwoIds);
        setPlayerOne(onePlayers);
        setPlayerTwo(twoPlayers);
      })();
    });
    return () => {
      socket.emit('leaveMatch', matchId);
      socket.off('scoreUpdate');
    };
  }, [matchId]);

  if (loading) {
    return (
      <BadmintonPageLayout>
        <div className="text-center text-xl p-10">Loading match details...</div>
      </BadmintonPageLayout>
    );
  }

  if (!matchDetails) {
    return (
      <BadmintonPageLayout>
        <div className="text-center text-xl p-10">Match not found</div>
      </BadmintonPageLayout>
    );
  }

  // Calculate final score
  const playerOneSetsWon = matchDetails.sets ? matchDetails.sets.filter(set => set.winnerId === matchDetails.playerOneIds?.[0]).length : 0;
  const playerTwoSetsWon = matchDetails.sets ? matchDetails.sets.filter(set => set.winnerId === matchDetails.playerTwoIds?.[0]).length : 0;
  const finalScore = `${playerOneSetsWon}-${playerTwoSetsWon}`;

  // Determine winner
  const winner = playerOneSetsWon > playerTwoSetsWon ? playerOne : playerTwo;
  const loser = playerOneSetsWon > playerTwoSetsWon ? playerTwo : playerOne;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to join player names
  const joinNames = (players) => players.map(p => p?.name || 'Unknown').join(' & ');

  const renderSummaryContent = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-orange-300 mb-4">SCORE</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-center border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-4 py-2 text-slate-300">Player</th>
                <th className="px-4 py-2 text-slate-300">Sets Won</th>
                <th className="px-4 py-2 text-slate-300">Set 1</th>
                <th className="px-4 py-2 text-slate-300">Set 2</th>
                <th className="px-4 py-2 text-slate-300">Set 3</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-orange-900/30 rounded-lg">
                <td className="px-4 py-2 font-bold text-white">{joinNames(playerOne)}</td>
                <td className="px-4 py-2 text-orange-400 font-bold">{playerOneSetsWon}</td>
                {[0,1,2].map(i => (
                  <td key={i} className="px-4 py-2 text-lg font-semibold text-white">
                    {matchDetails.sets?.[i]?.playerOneScore !== undefined ? matchDetails.sets[i].playerOneScore : '-'}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-700/30 rounded-lg">
                <td className="px-4 py-2 font-bold text-white">{joinNames(playerTwo)}</td>
                <td className="px-4 py-2 text-slate-400 font-bold">{playerTwoSetsWon}</td>
                {[0,1,2].map(i => (
                  <td key={i} className="px-4 py-2 text-lg font-semibold text-white">
                    {matchDetails.sets?.[i]?.playerTwoScore !== undefined ? matchDetails.sets[i].playerTwoScore : '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMatchHistoryContent = () => (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-xl font-bold text-orange-300 mb-4">SET DETAILS</h3>
      <div className="space-y-3">
        {matchDetails.sets?.map((set, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
            <span className="font-semibold text-white">Set {set.setNumber}</span>
            <div className="flex space-x-4">
              <span className="text-orange-400">{set.playerOneScore}</span>
              <span className="text-slate-400">-</span>
              <span className="text-orange-400">{set.playerTwoScore}</span>
            </div>
            <span className="text-sm text-slate-400">
              Winner: {set.winnerId === matchDetails.playerOneIds?.[0] ? joinNames(playerOne) : joinNames(playerTwo)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <BadmintonPageLayout>
      {/* Match Header */}
      <div className="text-center mb-8">
        <p className="text-slate-400 mb-2">
          {matchDetails.scheduledTime ? formatDate(matchDetails.scheduledTime) : 'Date TBD'}
        </p>
        <h1 className="text-6xl font-bold text-orange-400 mb-2">{finalScore}</h1>
        <p className="text-lg text-slate-300 capitalize">{matchDetails.status}</p>
      </div>

      {/* Player Information */}
      <div className="flex justify-between items-center mb-8">
        {/* Player One */}
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-3xl">🏸</span>
          </div>
          <h3 className="font-bold text-white text-lg">{joinNames(playerOne)}</h3>
          <p className="text-sm text-slate-400">BWF: {playerOne.map(p => p?.rank || 'N/A').join(' / ')}</p>
        </div>

        {/* VS */}
        <div className="text-2xl font-bold text-orange-400">VS</div>

        {/* Player Two */}
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-3xl">🏸</span>
          </div>
          <h3 className="font-bold text-white text-lg">{joinNames(playerTwo)}</h3>
          <p className="text-sm text-slate-400">BWF: {playerTwo.map(p => p?.rank || 'N/A').join(' / ')}</p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="border-b border-slate-700 mb-6">
        <nav className="flex space-x-8">
          {['MATCH', 'ODDS', 'H2H', 'DRAW'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-orange-400 text-orange-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Sub Navigation Tabs (only for MATCH tab) */}
      {activeTab === 'MATCH' && (
        <div className="mb-6">
          <div className="flex space-x-4">
            {['SUMMARY', 'MATCH HISTORY'].map(subTab => (
              <button
                key={subTab}
                onClick={() => setActiveSubTab(subTab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                  activeSubTab === subTab
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {subTab}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="fade-in">
        {activeTab === 'MATCH' && (
          <>
            {activeSubTab === 'SUMMARY' && renderSummaryContent()}
            {activeSubTab === 'MATCH HISTORY' && renderMatchHistoryContent()}
          </>
        )}
        {activeTab === 'ODDS' && (
          <div className="text-center text-slate-400 py-10">Odds information coming soon...</div>
        )}
        {activeTab === 'H2H' && (
          <div className="text-center text-slate-400 py-10">Head to Head statistics coming soon...</div>
        )}
        {activeTab === 'DRAW' && (
          <div className="text-center text-slate-400 py-10">Tournament draw coming soon...</div>
        )}
      </div>
    </BadmintonPageLayout>
  );
};

export default BadmintonMatchDetailsPage; 
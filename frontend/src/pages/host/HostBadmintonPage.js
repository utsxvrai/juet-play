import React, { useState, useEffect } from 'react';
import BadmintonPageLayout from '../../components/badminton/BadmintonPageLayout';
import { useNavigate } from 'react-router-dom';
import { BADMINTON_SERVICE_URL } from '../../utils/api';

const HostBadmintonPage = () => {
  const [formData, setFormData] = useState({
    hostId: '',
    format: 'singles',
    playerOneIds: [],
    playerTwoIds: [],
    scheduledTime: '',
    status: 'scheduled'
  });
  
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // CRITICAL FIX: Separate search states for each side to support doubles properly
  const [searchTermPlayerOne, setSearchTermPlayerOne] = useState('');
  const [searchTermPlayerTwo, setSearchTermPlayerTwo] = useState('');
  const [filteredPlayersOne, setFilteredPlayersOne] = useState([]);
  const [filteredPlayersTwo, setFilteredPlayersTwo] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Filter players for Player One search
  useEffect(() => {
    if (searchTermPlayerOne) {
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(searchTermPlayerOne.toLowerCase()) &&
        !formData.playerOneIds.includes(player._id) // Don't show already selected players
      );
      setFilteredPlayersOne(filtered);
    } else {
      setFilteredPlayersOne([]);
    }
  }, [searchTermPlayerOne, players, formData.playerOneIds]);

  // Filter players for Player Two search
  useEffect(() => {
    if (searchTermPlayerTwo) {
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(searchTermPlayerTwo.toLowerCase()) &&
        !formData.playerTwoIds.includes(player._id) // Don't show already selected players
      );
      setFilteredPlayersTwo(filtered);
    } else {
      setFilteredPlayersTwo([]);
    }
  }, [searchTermPlayerTwo, players, formData.playerTwoIds]);

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${BADMINTON_SERVICE_URL}/api/v1/player`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.data || data || []);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      setError('Failed to load players. Please refresh the page.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // CRITICAL FIX: Reset player selections when format changes
    if (name === 'format') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        playerOneIds: [],
        playerTwoIds: []
      }));
      setSearchTermPlayerOne('');
      setSearchTermPlayerTwo('');
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePlayerSelect = (playerId, side) => {
    if (side === 'one') {
      setFormData(prev => ({
        ...prev,
        playerOneIds: formData.format === 'singles' ? [playerId] : [...prev.playerOneIds, playerId].slice(0, 2)
      }));
      setSearchTermPlayerOne('');
      setFilteredPlayersOne([]);
    } else {
      setFormData(prev => ({
        ...prev,
        playerTwoIds: formData.format === 'singles' ? [playerId] : [...prev.playerTwoIds, playerId].slice(0, 2)
      }));
      setSearchTermPlayerTwo('');
      setFilteredPlayersTwo([]);
    }
  };

  const removePlayer = (playerId, side) => {
    if (side === 'one') {
      setFormData(prev => ({
        ...prev,
        playerOneIds: prev.playerOneIds.filter(id => id !== playerId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        playerTwoIds: prev.playerTwoIds.filter(id => id !== playerId)
      }));
    }
  };

  const validateForm = () => {
    // Validation
    if (!formData.hostId.trim()) {
      setError('Host ID is required');
      return false;
    }

    if (formData.playerOneIds.length === 0 || formData.playerTwoIds.length === 0) {
      setError('Please select players for both sides');
      return false;
    }

    if (formData.format === 'singles' && (formData.playerOneIds.length > 1 || formData.playerTwoIds.length > 1)) {
      setError('Singles matches can only have one player per side');
      return false;
    }

    if (formData.format === 'doubles' && (formData.playerOneIds.length !== 2 || formData.playerTwoIds.length !== 2)) {
      setError('Doubles matches must have exactly 2 players per side');
      return false;
    }

    return true;
  };

  const createMatch = async (status, redirectPath) => {
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return null;
    }

    try {
      const matchData = {
        ...formData,
        status: status || formData.status
      };

      const response = await fetch(`${BADMINTON_SERVICE_URL}/api/v1/match/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      if (response.ok) {
        const data = await response.json();
        const matchId = data.data?._id || data._id;
        
        if (redirectPath && matchId) {
          navigate(redirectPath.replace(':matchid', matchId));
        } else {
          navigate('/badminton');
        }
        return data;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create match');
        return null;
      }
    } catch (error) {
      setError('Failed to create match. Please try again.');
      console.error('Error creating match:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createMatch('scheduled', null);
  };

  const handleStartMatch = async (e) => {
    e.preventDefault();
    await createMatch('ongoing', '/live-scoring/:matchid');
  };

  const getPlayerName = (playerId) => {
    const player = players.find(p => p._id === playerId);
    return player ? player.name : 'Unknown Player';
  };

  return (
    <BadmintonPageLayout title="Host Badminton Match">
      <div className="max-w-2xl mx-auto bg-slate-800/70 p-6 md:p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Host ID */}
          <div>
            <label htmlFor="hostId" className="block text-sm font-medium text-orange-300 mb-1">
              Host ID
            </label>
            <input
              type="text"
              name="hostId"
              id="hostId"
              value={formData.hostId}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter host ID"
            />
          </div>

          {/* Format */}
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-orange-300 mb-1">
              Match Format
            </label>
            <select
              name="format"
              id="format"
              value={formData.format}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="singles">Singles</option>
              <option value="doubles">Doubles</option>
            </select>
          </div>

          {/* Player One Selection */}
          <div>
            <label className="block text-sm font-medium text-orange-300 mb-1">
              Player One {formData.format === 'doubles' ? '(2 players)' : ''}
            </label>
            <div className="space-y-2">
              {/* Selected Players */}
              {formData.playerOneIds.map(playerId => (
                <div key={playerId} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                  <span className="text-white">{getPlayerName(playerId)}</span>
                  <button
                    type="button"
                    onClick={() => removePlayer(playerId, 'one')}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {/* Player Search */}
              {formData.playerOneIds.length < (formData.format === 'doubles' ? 2 : 1) && (
                <div className="relative">
                  <input
                    type="text"
                    value={searchTermPlayerOne}
                    onChange={(e) => setSearchTermPlayerOne(e.target.value)}
                    placeholder="Search for players..."
                    className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {filteredPlayersOne.length > 0 && (
                    <div className="absolute z-10 w-full bg-slate-700 border border-slate-600 rounded-md mt-1 max-h-40 overflow-y-auto">
                      {filteredPlayersOne.map(player => (
                        <button
                          key={player._id}
                          type="button"
                          onClick={() => handlePlayerSelect(player._id, 'one')}
                          className="w-full text-left px-3 py-2 text-white hover:bg-slate-600"
                        >
                          {player.name} ({player.country})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Player Two Selection */}
          <div>
            <label className="block text-sm font-medium text-orange-300 mb-1">
              Player Two {formData.format === 'doubles' ? '(2 players)' : ''}
            </label>
            <div className="space-y-2">
              {/* Selected Players */}
              {formData.playerTwoIds.map(playerId => (
                <div key={playerId} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                  <span className="text-white">{getPlayerName(playerId)}</span>
                  <button
                    type="button"
                    onClick={() => removePlayer(playerId, 'two')}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {/* Player Search */}
              {formData.playerTwoIds.length < (formData.format === 'doubles' ? 2 : 1) && (
                <div className="relative">
                  <input
                    type="text"
                    value={searchTermPlayerTwo}
                    onChange={(e) => setSearchTermPlayerTwo(e.target.value)}
                    placeholder="Search for players..."
                    className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {filteredPlayersTwo.length > 0 && (
                    <div className="absolute z-10 w-full bg-slate-700 border border-slate-600 rounded-md mt-1 max-h-40 overflow-y-auto">
                      {filteredPlayersTwo.map(player => (
                        <button
                          key={player._id}
                          type="button"
                          onClick={() => handlePlayerSelect(player._id, 'two')}
                          className="w-full text-left px-3 py-2 text-white hover:bg-slate-600"
                        >
                          {player.name} ({player.country})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Scheduled Time */}
          <div>
            <label htmlFor="scheduledTime" className="block text-sm font-medium text-orange-300 mb-1">
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              name="scheduledTime"
              id="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-orange-300 mb-1">
              Match Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Create Match Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Match'}
            </button>
            
            {/* Start Match Button */}
            <button
              type="button"
              onClick={handleStartMatch}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Starting...' : '🎯 Start Match'}
            </button>
          </div>
        </form>
      </div>
    </BadmintonPageLayout>
  );
};

export default HostBadmintonPage;

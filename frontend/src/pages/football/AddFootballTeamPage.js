import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import { FOOTBALL_SERVICE_URL } from '../../utils/api';

const AddFootballTeamPage = () => {
  const navigate = useNavigate();
  const [teamDetails, setTeamDetails] = useState({
    name: '',
    coach: '',
    country: '',
    players: [{ name: '', position: '', jerseyNumber: '', age: '', gender: '' }], 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlayerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPlayers = [...teamDetails.players];
    updatedPlayers[index] = { ...updatedPlayers[index], [name]: value };
    setTeamDetails(prev => ({ ...prev, players: updatedPlayers }));
  };

  const addPlayerRow = () => {
    setTeamDetails(prev => ({ 
      ...prev, 
      players: [...prev.players, { name: '', position: '', jerseyNumber: '', age: '', gender: '' }]
    }));
  };

  const removePlayerRow = (index) => {
    if (teamDetails.players.length > 1) {
      const updatedPlayers = [...teamDetails.players];
      updatedPlayers.splice(index, 1);
      setTeamDetails(prev => ({ ...prev, players: updatedPlayers }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First create the team
      const teamPayload = {
        name: teamDetails.name,
        coach: teamDetails.coach,
        country: teamDetails.country
      };

      const teamResponse = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/team/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamPayload),
      });

      if (!teamResponse.ok) {
        const errorData = await teamResponse.json();
        throw new Error(errorData.message || 'Failed to create team');
      }

      const teamData = await teamResponse.json();
      const teamId = teamData.data._id;

      // Then create players for the team
      const playerPromises = teamDetails.players.map(async (player) => {
        const playerPayload = {
          name: player.name,
          position: player.position,
          jerseyNumber: parseInt(player.jerseyNumber),
          age: parseInt(player.age),
          gender: player.gender,
          team: teamId
        };

        const playerResponse = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/player/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(playerPayload),
        });

        if (!playerResponse.ok) {
          const errorData = await playerResponse.json();
          throw new Error(`Failed to create player ${player.name}: ${errorData.message}`);
        }

        return playerResponse.json();
      });

      await Promise.all(playerPromises);

      alert('Football team created successfully!');
      navigate('/football/teams');
    } catch (err) {
      setError(err.message || 'Failed to create team');
      console.error('Error creating team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FootballPageLayout title="Add New Football Team">
      <div className="max-w-3xl mx-auto bg-slate-800/70 p-6 md:p-8 rounded-xl shadow-2xl">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl text-teal-300 mb-4">Team Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-teal-300 mb-1">Team Name</label>
              <input type="text" name="name" id="name" value={teamDetails.name} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="coach" className="block text-sm font-medium text-teal-300 mb-1">Coach</label>
              <input type="text" name="coach" id="coach" value={teamDetails.coach} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-teal-300 mb-1">Country</label>
              <input type="text" name="country" id="country" value={teamDetails.country} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>

          <h2 className="text-2xl text-teal-300 mt-8 mb-4">Player Squad</h2>
          {teamDetails.players.map((player, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-3 p-3 bg-slate-700/30 rounded-md">
              <input type="text" name="name" placeholder="Player Name" value={player.name} onChange={(e) => handlePlayerChange(index, e)} required
                     className="md:col-span-1 w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
              <input type="text" name="position" placeholder="Position" value={player.position} onChange={(e) => handlePlayerChange(index, e)} required
                     className="md:col-span-1 w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
              <input type="number" name="jerseyNumber" placeholder="Jersey No." value={player.jerseyNumber} onChange={(e) => handlePlayerChange(index, e)} required
                     className="md:col-span-1 w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
              <input type="number" name="age" placeholder="Age" value={player.age || ''} onChange={(e) => handlePlayerChange(index, e)} required min="16" max="50"
                     className="md:col-span-1 w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
              <select name="gender" value={player.gender || ''} onChange={(e) => handlePlayerChange(index, e)} required
                      className="md:col-span-1 w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500">
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {teamDetails.players.length > 1 && (
                <button type="button" onClick={() => removePlayerRow(index)} 
                        className="md:col-span-1 text-red-400 hover:text-red-300 font-medium py-2 px-3 rounded-md hover:bg-red-500/20 transition-colors text-sm">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addPlayerRow}
                  className="mt-2 text-sm text-teal-400 hover:text-teal-300 font-semibold py-2 px-4 border border-teal-600 hover:border-teal-500 rounded-md transition-colors">
            + Add Player
          </button>

          <div className="flex justify-end space-x-4 mt-10">
            <button type="button" onClick={() => navigate('/football/teams')} 
                    className="px-6 py-2 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md transition-colors disabled:opacity-50">
              {loading ? 'Creating...' : 'Add Football Team'}
            </button>
          </div>
        </form>
      </div>
    </FootballPageLayout>
  );
};

export default AddFootballTeamPage; 
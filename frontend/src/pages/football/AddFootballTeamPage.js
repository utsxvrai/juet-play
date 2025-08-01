import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout';

const AddFootballTeamPage = () => {
  const navigate = useNavigate();
  const [teamDetails, setTeamDetails] = useState({
    name: '',
    manager: '',
    stadium: '',
    logoUrl: '',
    players: [{ name: '', position: '', jerseyNumber: '' }], 
  });

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
      players: [...prev.players, { name: '', position: '', jerseyNumber: '' }]
    }));
  };

  const removePlayerRow = (index) => {
    const updatedPlayers = [...teamDetails.players];
    updatedPlayers.splice(index, 1);
    setTeamDetails(prev => ({ ...prev, players: updatedPlayers }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Football Team Data:', teamDetails);
    alert('New football team data (see console). Backend integration needed.');
    navigate('/football/teams'); 
  };

  return (
    <FootballPageLayout title="Add New Football Team">
      <div className="max-w-3xl mx-auto bg-slate-800/70 p-6 md:p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 class="text-2xl text-teal-300 mb-4">Team Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-teal-300 mb-1">Team Name</label>
              <input type="text" name="name" id="name" value={teamDetails.name} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="manager" className="block text-sm font-medium text-teal-300 mb-1">Manager</label>
              <input type="text" name="manager" id="manager" value={teamDetails.manager} onChange={handleChange}
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="stadium" className="block text-sm font-medium text-teal-300 mb-1">Stadium</label>
              <input type="text" name="stadium" id="stadium" value={teamDetails.stadium} onChange={handleChange}
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
             <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-teal-300 mb-1">Logo URL</label>
              <input type="url" name="logoUrl" id="logoUrl" value={teamDetails.logoUrl} onChange={handleChange}
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>

          <h2 class="text-2xl text-teal-300 mt-8 mb-4">Player Squad</h2>
          {teamDetails.players.map((player, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-3 p-3 bg-slate-700/30 rounded-md">
              <input type="text" name="name" placeholder="Player Name" value={player.name} onChange={(e) => handlePlayerChange(index, e)} required
                     className="md:col-span-1 w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
              <input type="text" name="position" placeholder="Position (e.g., Forward)" value={player.position} onChange={(e) => handlePlayerChange(index, e)} required
                     className="md:col-span-1 w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
              <input type="number" name="jerseyNumber" placeholder="Jersey No." value={player.jerseyNumber} onChange={(e) => handlePlayerChange(index, e)} required
                     className="md:col-span-1 w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
              {teamDetails.players.length > 1 && (
                <button type="button" onClick={() => removePlayerRow(index)} 
                        className="md:col-span-1 text-red-400 hover:text-red-300 font-medium py-2 px-3 rounded-md hover:bg-red-500/20 transition-colors text-sm">
                  Remove Player
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
            <button type="submit"
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md transition-colors">
              Add Football Team
            </button>
          </div>
        </form>
      </div>
    </FootballPageLayout>
  );
};

export default AddFootballTeamPage; 
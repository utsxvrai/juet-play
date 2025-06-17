import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTeamPageLayout from '../components/common/AddTeamPageLayout';

const sportsConfig = {
  cricket: { label: 'Cricket', min: 11, max: 15 },
  football: { label: 'Football', min: 11, max: 15 },
  volleyball: { label: 'Volleyball', min: 6, max: 12 },
  basketball: { label: 'Basketball', min: 5, max: 12 },
};

function hashTeamName(name) {
  // Simple hash for demonstration (not cryptographically secure)
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return 'TEAM-' + Math.abs(hash).toString(36);
}

const sports = [
  { key: 'cricket', name: 'Cricket', emoji: '🏏' },
  { key: 'football', name: 'Football', emoji: '⚽' },
  { key: 'volleyball', name: 'Volleyball', emoji: '🏐' },
  { key: 'basketball', name: 'Basketball', emoji: '🏀' },
];

const AddTeamPage = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [coach, setCoach] = useState('');
  const [arena, setArena] = useState('');
  const [players, setPlayers] = useState([]);

  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
    setPlayers(Array(sportsConfig[e.target.value].min).fill({ name: '', position: '', jerseyNumber: '', height: '', weight: '' }));
  };

  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
    setTeamId(hashTeamName(e.target.value));
  };

  const handlePlayerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [name]: value };
    setPlayers(updatedPlayers);
  };

  const addPlayerRow = () => {
    if (players.length < sportsConfig[selectedSport].max) {
      setPlayers([...players, { name: '', position: '', jerseyNumber: '', height: '', weight: '' }]);
    }
  };

  const removePlayerRow = (index) => {
    if (players.length > sportsConfig[selectedSport].min) {
      const updatedPlayers = [...players];
      updatedPlayers.splice(index, 1);
      setPlayers(updatedPlayers);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Team ${teamName} (${teamId}) created! (Demo only)`);
    navigate('/');
  };

  return (
    <AddTeamPageLayout title="Add a New Team">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-blue-400 mb-8 text-center">Select a Sport</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 justify-center max-w-2xl mx-auto">
          {sports.map((sport) => (
            <button
              key={sport.key}
              type="button"
              onClick={() => handleSportChange({ target: { value: sport.key } })}
              className={`group bg-slate-700/50 border p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 active:scale-95
                ${selectedSport === sport.key
                  ? 'border-blue-500 ring-2 ring-blue-400 scale-105'
                  : 'border-slate-700 hover:bg-blue-500/10 hover:border-blue-400'}
              `}
            >
              <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">{sport.emoji}</div>
              <span className={`text-xl font-medium transition-colors duration-300 ${selectedSport === sport.key ? 'text-blue-300' : 'text-slate-200 group-hover:text-blue-200'}`}>{sport.name}</span>
            </button>
          ))}
        </div>
      </div>
      {selectedSport && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-slate-800/70 p-6 md:p-10 rounded-xl shadow-2xl">
          <div>
            <label className="block text-lg font-medium mb-2">Team Name</label>
            <input type="text" value={teamName} onChange={handleTeamNameChange} required className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3" />
            {teamId && <p className="text-xs text-blue-300 mt-1">Team ID: <span className="font-mono">{teamId}</span></p>}
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Coach</label>
            <input type="text" value={coach} onChange={e => setCoach(e.target.value)} required className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3" />
          </div>
          {(selectedSport === 'basketball' || selectedSport === 'football') && (
            <div>
              <label className="block text-lg font-medium mb-2">Arena / Stadium</label>
              <input type="text" value={arena} onChange={e => setArena(e.target.value)} className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md py-2 px-3" />
            </div>
          )}
          <div>
            <label className="block text-lg font-medium mb-2">Players ({players.length})</label>
            <div className="space-y-2">
              {players.map((player, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center bg-slate-700/30 rounded-md p-2">
                  <input type="text" name="name" placeholder="Name" value={player.name} onChange={e => handlePlayerChange(idx, e)} required className="w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-1 px-2" />
                  <input type="text" name="position" placeholder="Position" value={player.position} onChange={e => handlePlayerChange(idx, e)} className="w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-1 px-2" />
                  <input type="number" name="jerseyNumber" placeholder="Jersey No." value={player.jerseyNumber} onChange={e => handlePlayerChange(idx, e)} className="w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-1 px-2" />
                  <input type="text" name="height" placeholder="Height" value={player.height} onChange={e => handlePlayerChange(idx, e)} className="w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-1 px-2" />
                  <input type="text" name="weight" placeholder="Weight" value={player.weight} onChange={e => handlePlayerChange(idx, e)} className="w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-1 px-2" />
                  {players.length > sportsConfig[selectedSport].min && (
                    <button type="button" onClick={() => removePlayerRow(idx)} className="text-red-400 hover:text-red-300 font-medium py-1 px-2 rounded-md hover:bg-red-500/20 transition-colors text-xs mt-1">Remove</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addPlayerRow} disabled={players.length >= sportsConfig[selectedSport].max} className="mt-2 text-sm text-blue-400 hover:text-blue-300 font-semibold py-2 px-4 border border-blue-600 hover:border-blue-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              + Add Player
            </button>
            <p className="text-xs text-slate-400 mt-1">Squad size: {sportsConfig[selectedSport].min} to {sportsConfig[selectedSport].max}</p>
          </div>
          <div className="flex justify-end mt-8">
            <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors text-lg">Add Team</button>
          </div>
        </form>
      )}
    </AddTeamPageLayout>
  );
};

export default AddTeamPage; 
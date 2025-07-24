import React, { useState } from 'react';
import TeamAutocompleteInput from '../../components/common/TeamAutocompleteInput';
import HostMatchTournamentSelect from '../../components/common/HostMatchTournamentSelect';
import HostMatchTournamentCreateModal from '../../components/common/HostMatchTournamentCreateModal';
import { useNavigate } from 'react-router-dom';
import CricketPageLayout from '../../components/cricket/CricketPageLayout'; // Or a more generic HostPageLayout

const HostCricketPage = () => {
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState({
    matchTitle: '',
    series: '',
    venue: '',
    teamAName: '',
    teamBName: '',
    overs: '20', // Default to T20
    date: '',
    time: '',
    // Add more fields like toss, umpire, etc. as needed
  });
  const [selectedTournament, setSelectedTournament] = useState('');
  const [showCreateTournament, setShowCreateTournament] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatchDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fetch teams by name (in real app, use dropdowns or IDs)
    const teamARes = await fetch(`http://localhost:3001/api/v1/team?name=${encodeURIComponent(matchDetails.teamAName)}`);
    const teamAData = await teamARes.json();
    const teamA = teamAData.data && teamAData.data[0];
    const teamBRes = await fetch(`http://localhost:3001/api/v1/team?name=${encodeURIComponent(matchDetails.teamBName)}`);
    const teamBData = await teamBRes.json();
    const teamB = teamBData.data && teamBData.data[0];
    if (!teamA || !teamB) {
      alert('Both teams must exist.');
      return;
    }
    const payload = {
      sport: 'CRICKET',
      status: 'upcoming',
      startTime: new Date(`${matchDetails.date}T${matchDetails.time}`),
      location: matchDetails.venue,
      teams: [
        { teamId: teamA._id, name: teamA.name, score: {} },
        { teamId: teamB._id, name: teamB.name, score: {} }
      ],
      overs: matchDetails.overs,
      tournamentId: selectedTournament || undefined
    };
    const res = await fetch('http://localhost:3002/api/v1/match/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert('Match hosted successfully!');
      navigate('/host');
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to host match');
    }
  };

  return (
    <CricketPageLayout title="Host New Cricket Match">
      <div className="flex flex-col items-center mb-6">
        <div className="text-6xl mb-2 animate-bounce">🏏</div>
        <div className="text-emerald-300 font-semibold text-lg mb-2">Step 1: Match Details</div>
      </div>
      <div className="max-w-2xl mx-auto bg-slate-800/70 p-6 md:p-8 rounded-xl shadow-2xl">
        <HostMatchTournamentSelect
          selectedTournament={selectedTournament}
          setSelectedTournament={setSelectedTournament}
          onCreateNew={() => setShowCreateTournament(true)}
        />
        <HostMatchTournamentCreateModal
          show={showCreateTournament}
          onClose={() => setShowCreateTournament(false)}
          onCreate={t => setSelectedTournament(t._id)}
        />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="matchTitle" className="block text-sm font-medium text-emerald-300 mb-1">Match Title</label>
            <input type="text" name="matchTitle" id="matchTitle" value={matchDetails.matchTitle} onChange={handleChange} required
                   className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" />
            <p className="text-xs text-slate-400 mt-1">E.g., India vs Australia, 1st T20I</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="series" className="block text-sm font-medium text-emerald-300 mb-1">Series/Tournament</label>
              <input type="text" name="series" id="series" value={matchDetails.series} onChange={handleChange}
                     className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" />
              <p className="text-xs text-slate-400 mt-1">Optional: Tournament or series name</p>
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-emerald-300 mb-1">Venue</label>
              <input type="text" name="venue" id="venue" value={matchDetails.venue} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" />
              <p className="text-xs text-slate-400 mt-1">E.g., Eden Gardens, Kolkata</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamAutocompleteInput
              label="Team A Name"
              value={matchDetails.teamAName}
              onChange={val => setMatchDetails(prev => ({ ...prev, teamAName: val }))}
              placeholder="Type to search teams..."
            />
            <TeamAutocompleteInput
              label="Team B Name"
              value={matchDetails.teamBName}
              onChange={val => setMatchDetails(prev => ({ ...prev, teamBName: val }))}
              placeholder="Type to search teams..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="overs" className="block text-sm font-medium text-emerald-300 mb-1">Overs per Innings</label>
              <input type="number" name="overs" id="overs" value={matchDetails.overs} onChange={handleChange} min="1" max="100" required
                     className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" />
              <p className="text-xs text-slate-400 mt-1">E.g., 20 for T20, 50 for ODI</p>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-emerald-300 mb-1">Date</label>
              <input type="date" name="date" id="date" value={matchDetails.date} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-emerald-300 mb-1">Time</label>
              <input type="time" name="time" id="time" value={matchDetails.time} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" />
            </div>
          </div>
          <div className="flex justify-between items-center space-x-4 mt-8">
            <button type="button" onClick={() => navigate('/host')} 
                    className="px-6 py-2 border border-emerald-400 text-emerald-300 rounded-md hover:bg-emerald-500/10 transition-colors font-semibold">
              ← Back to Sport Selection
            </button>
            <button type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-md transition-colors">
              Create Cricket Match
            </button>
          </div>
        </form>
      </div>
    </CricketPageLayout>
  );
};

export default HostCricketPage; 
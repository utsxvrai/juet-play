import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VolleyballPageLayout from '../../components/volleyball/VolleyballPageLayout'; // Or a generic HostPageLayout

const HostVolleyballPage = () => {
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState({
    matchTitle: '',
    tournament: '',
    venue: '',
    teamAName: '',
    teamBName: '',
    date: '',
    time: '',
    numSets: '5', // Default to best of 5 sets
    // Add more fields like officials, etc.
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatchDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Hosting Volleyball Match:', matchDetails);
    alert('Volleyball match hosting data (see console). Backend integration needed.');
    navigate('/host');
  };

  return (
    <VolleyballPageLayout title="Host New Volleyball Match">
      <div className="max-w-2xl mx-auto bg-slate-800/70 p-6 md:p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="matchTitle" className="block text-sm font-medium text-indigo-300 mb-1">Match Title</label>
            <input type="text" name="matchTitle" id="matchTitle" value={matchDetails.matchTitle} onChange={handleChange} required
                   className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
            <p className="text-xs text-slate-400 mt-1">E.g., National League: Team X vs Team Y</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tournament" className="block text-sm font-medium text-indigo-300 mb-1">Tournament/League</label>
              <input type="text" name="tournament" id="tournament" value={matchDetails.tournament} onChange={handleChange}
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-indigo-300 mb-1">Venue</label>
              <input type="text" name="venue" id="venue" value={matchDetails.venue} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="teamAName" className="block text-sm font-medium text-indigo-300 mb-1">Team A Name</label>
              <input type="text" name="teamAName" id="teamAName" value={matchDetails.teamAName} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="teamBName" className="block text-sm font-medium text-indigo-300 mb-1">Team B Name</label>
              <input type="text" name="teamBName" id="teamBName" value={matchDetails.teamBName} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="numSets" className="block text-sm font-medium text-indigo-300 mb-1">Number of Sets (Best of)</label>
              <select name="numSets" id="numSets" value={matchDetails.numSets} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="3">3 Sets</option>
                  <option value="5">5 Sets</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-indigo-300 mb-1">Date</label>
              <input type="date" name="date" id="date" value={matchDetails.date} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-indigo-300 mb-1">Start Time</label>
              <input type="time" name="time" id="time" value={matchDetails.time} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

          {/* TODO: Add team player inputs, officials etc. */}

          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={() => navigate('/host')} 
                    className="px-6 py-2 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition-colors">
              Create Volleyball Match
            </button>
          </div>
        </form>
      </div>
    </VolleyballPageLayout>
  );
};

export default HostVolleyballPage; 
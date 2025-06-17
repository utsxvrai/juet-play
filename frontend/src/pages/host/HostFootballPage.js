import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout'; // Or a generic HostPageLayout

const HostFootballPage = () => {
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState({
    matchTitle: '',
    league: '',
    venue: '',
    teamAName: '',
    teamBName: '',
    date: '',
    time: '',
    // Add more fields like referee, match duration (e.g. 90 mins), etc.
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatchDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Hosting Football Match:', matchDetails);
    alert('Football match hosting data (see console). Backend integration needed.');
    navigate('/host');
  };

  return (
    <FootballPageLayout title="Host New Football Match">
      <div className="max-w-2xl mx-auto bg-slate-800/70 p-6 md:p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="matchTitle" className="block text-sm font-medium text-teal-300 mb-1">Match Title</label>
            <input type="text" name="matchTitle" id="matchTitle" value={matchDetails.matchTitle} onChange={handleChange} required
                   className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            <p className="text-xs text-slate-400 mt-1">E.g., Manchester United vs Liverpool</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="league" className="block text-sm font-medium text-teal-300 mb-1">League/Competition</label>
              <input type="text" name="league" id="league" value={matchDetails.league} onChange={handleChange}
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-teal-300 mb-1">Venue</label>
              <input type="text" name="venue" id="venue" value={matchDetails.venue} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="teamAName" className="block text-sm font-medium text-teal-300 mb-1">Team A Name</label>
              <input type="text" name="teamAName" id="teamAName" value={matchDetails.teamAName} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="teamBName" className="block text-sm font-medium text-teal-300 mb-1">Team B Name</label>
              <input type="text" name="teamBName" id="teamBName" value={matchDetails.teamBName} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-teal-300 mb-1">Date</label>
              <input type="date" name="date" id="date" value={matchDetails.date} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-teal-300 mb-1">Kick-off Time</label>
              <input type="time" name="time" id="time" value={matchDetails.time} onChange={handleChange} required
                     className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>

          {/* TODO: Add team player inputs, referee details etc. */}

          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={() => navigate('/host')} 
                    className="px-6 py-2 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit"
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md transition-colors">
              Create Football Match
            </button>
          </div>
        </form>
      </div>
    </FootballPageLayout>
  );
};

export default HostFootballPage; 
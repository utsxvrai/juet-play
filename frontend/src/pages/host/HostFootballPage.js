import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import { FOOTBALL_SERVICE_URL } from '../../utils/api';

const HostFootballPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '',
    status: 'scheduled',
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/team`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data.data || []);
      }
    } catch (error) {
      setTeams([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.homeTeam || !formData.awayTeam) {
      setError('Please select both teams');
      setLoading(false);
      return;
    }
    if (formData.homeTeam === formData.awayTeam) {
      setError('Home and Away teams must be different');
      setLoading(false);
      return;
    }
    if (!formData.date || !formData.time) {
      setError('Please select date and time');
      setLoading(false);
      return;
    }

    // Combine date and time into ISO string
    const scheduledDateTime = new Date(`${formData.date}T${formData.time}`);
    const payload = {
      homeTeam: formData.homeTeam,
      awayTeam: formData.awayTeam,
      date: scheduledDateTime.toISOString(),
      status: formData.status,
    };

    try {
      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/football/match/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        navigate('/football');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create match');
      }
    } catch (error) {
      setError('Failed to create match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FootballPageLayout title="Host Football Match">
      <div className="max-w-2xl mx-auto bg-slate-800/70 p-6 md:p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Home Team Selection */}
          <div>
            <label htmlFor="homeTeam" className="block text-sm font-medium text-green-300 mb-1">
              Home Team
            </label>
            <select
              name="homeTeam"
              id="homeTeam"
              value={formData.homeTeam}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Home Team</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </div>

          {/* Away Team Selection */}
          <div>
            <label htmlFor="awayTeam" className="block text-sm font-medium text-green-300 mb-1">
              Away Team
            </label>
            <select
              name="awayTeam"
              id="awayTeam"
              value={formData.awayTeam}
              onChange={handleChange}
              required
              className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Away Team</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-green-300 mb-1">Date</label>
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-green-300 mb-1">Kick-off Time</label>
              <input
                type="time"
                name="time"
                id="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-green-300 mb-1">
              Match Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Match...' : 'Create Match'}
          </button>
        </form>
      </div>
    </FootballPageLayout>
  );
};

export default HostFootballPage; 
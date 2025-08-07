import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FootballPageLayout from '../../components/football/FootballPageLayout';
import { FOOTBALL_SERVICE_URL } from '../../utils/api';

const AddFootballPlayerPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    position: '',
    jerseyNumber: '',
    country: '',
    team: '',
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0
  });

  // Fetch teams for dropdown
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/team?page=1&limit=100`);
        if (response.ok) {
          const data = await response.json();
          setTeams(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
      }
    };
    fetchTeams();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate jersey number
      const jerseyNum = parseInt(formData.jerseyNumber);
      if (jerseyNum < 1 || jerseyNum > 99) {
        throw new Error('Jersey number must be between 1 and 99');
      }

      // Check if jersey number is already taken by the team
      if (formData.team) {
        const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/player?page=1&limit=100`);
        if (response.ok) {
          const data = await response.json();
          const existingPlayer = data.data?.find(player => 
            player.team === formData.team && 
            player.jerseyNumber === jerseyNum
          );
          if (existingPlayer) {
            throw new Error(`Jersey number ${jerseyNum} is already taken by ${existingPlayer.name}`);
          }
        }
      }

      const response = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/player/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          jerseyNumber: jerseyNum,
          goals: parseInt(formData.goals),
          assists: parseInt(formData.assists),
          yellowCards: parseInt(formData.yellowCards),
          redCards: parseInt(formData.redCards)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Player added successfully!');
        navigate('/football/players');
      } else {
        setError(data.message || 'Failed to add player');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FootballPageLayout title="Add Football Player">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/70 p-6 rounded-xl shadow-xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Player Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter player name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="16"
                max="50"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Position *
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select Position</option>
                <option value="goalkeeper">Goalkeeper</option>
                <option value="defender">Defender</option>
                <option value="midfielder">Midfielder</option>
                <option value="forward">Forward</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Jersey Number *
              </label>
              <input
                type="number"
                name="jerseyNumber"
                value={formData.jerseyNumber}
                onChange={handleInputChange}
                required
                min="1"
                max="99"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="1-99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Team
              </label>
              <select
                name="team"
                value={formData.team}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select Team (Optional)</option>
                {teams.map(team => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-600 pt-6">
            <h3 className="text-lg font-medium text-green-400 mb-4">Statistics (Optional)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Goals</label>
                <input
                  type="number"
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assists</label>
                <input
                  type="number"
                  name="assists"
                  value={formData.assists}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Yellow Cards</label>
                <input
                  type="number"
                  name="yellowCards"
                  value={formData.yellowCards}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Red Cards</label>
                <input
                  type="number"
                  name="redCards"
                  value={formData.redCards}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/football/players')}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              {loading ? 'Adding...' : 'Add Player'}
            </button>
          </div>
        </form>
      </div>
    </FootballPageLayout>
  );
};

export default AddFootballPlayerPage; 
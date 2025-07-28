import React, { useState } from 'react';
import BadmintonPageLayout from '../../components/badminton/BadmintonPageLayout';
import { useNavigate } from 'react-router-dom';
import { BADMINTON_SERVICE_URL } from '../../utils/api';

const AddBadmintonPlayerPage = () => {
  const [form, setForm] = useState({ name: '', age: '', gender: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const navigate = useNavigate();

  const CORRECT_PIN = '425';

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setPin(value);
      setPinError('');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BADMINTON_SERVICE_URL}/api/v1/player/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add player');
      navigate('/badminton/players');
    } catch (err) {
      setError('Failed to add player. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <BadmintonPageLayout title="Add Badminton Player">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-slate-800/50 rounded-lg p-8 shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-orange-300 mb-2">Authentication Required</h2>
              <p className="text-slate-400">Enter the 3-digit PIN to add a player</p>
            </div>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-slate-300 mb-2">
                  PIN Code
                </label>
                <input
                  type="password"
                  id="pin"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="Enter 3-digit PIN"
                  maxLength={3}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white text-center text-2xl font-bold tracking-widest rounded-md shadow-sm py-4 px-3 focus:ring-orange-500 focus:border-orange-500"
                  autoFocus
                />
              </div>
              {pinError && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-center">
                  {pinError}
                </div>
              )}
              <button
                type="submit"
                disabled={pin.length !== 3}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Access Add Player
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/badminton')}
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                ← Back to Badminton
              </button>
            </div>
          </div>
        </div>
      </BadmintonPageLayout>
    );
  }

  return (
    <BadmintonPageLayout title="Add Badminton Player">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-slate-800/80 p-8 rounded-xl shadow-lg space-y-6">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div>
          <label className="block text-orange-300 mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full p-2 rounded bg-slate-700 text-white" />
        </div>
        <div>
          <label className="block text-orange-300 mb-1">Age</label>
          <input name="age" type="number" value={form.age} onChange={handleChange} required className="w-full p-2 rounded bg-slate-700 text-white" />
        </div>
        <div>
          <label className="block text-orange-300 mb-1">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} required className="w-full p-2 rounded bg-slate-700 text-white">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-orange-300 mb-1">Country</label>
          <input name="country" value={form.country} onChange={handleChange} required className="w-full p-2 rounded bg-slate-700 text-white" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75">
          {loading ? 'Adding...' : 'Add Player'}
        </button>
      </form>
    </BadmintonPageLayout>
  );
};

export default AddBadmintonPlayerPage; 
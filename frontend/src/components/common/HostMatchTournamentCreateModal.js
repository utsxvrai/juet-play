import React, { useState } from 'react';

const HostMatchTournamentCreateModal = ({ show, onClose, onCreate }) => {
  const [form, setForm] = useState({ name: '', type: 'TOURNAMENT', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3002/api/v1/tournament/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onCreate(data);
        onClose();
      } else {
        alert(data.message || 'Failed to create tournament');
      }
    } catch (err) {
      alert('Error connecting to backend');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-sm relative">
        <h2 className="text-lg font-bold text-blue-400 mb-4">Create Tournament/Series</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-blue-300 mb-1">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full bg-slate-700 border-slate-600 text-white rounded-md py-2 px-3" />
          </div>
          <div>
            <label className="block text-sm text-blue-300 mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 text-white rounded-md py-2 px-3">
              <option value="TOURNAMENT">Tournament</option>
              <option value="SERIES">Series</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-blue-300 mb-1">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 text-white rounded-md py-2 px-3" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-blue-300 mb-1">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 text-white rounded-md py-2 px-3" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-1 border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md">{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostMatchTournamentCreateModal;

import React, { useState, useEffect } from 'react';

const TeamAutocompleteInput = ({ value, onChange, label, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value && value.length > 0) {
      setLoading(true);
      fetch(`http://localhost:3001/api/v1/team?name=${encodeURIComponent(value)}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setSuggestions([]);
    }
  }, [value]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-emerald-300 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-slate-800 border border-slate-600 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
          {loading && <li className="px-3 py-2 text-slate-400">Loading...</li>}
          {suggestions.map(team => (
            <li
              key={team._id}
              className="px-3 py-2 cursor-pointer hover:bg-emerald-600/30 text-white"
              onMouseDown={() => onChange(team.name)}
            >
              {team.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamAutocompleteInput;

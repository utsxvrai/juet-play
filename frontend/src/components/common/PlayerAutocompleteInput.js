import React, { useState, useEffect } from 'react';

const PlayerAutocompleteInput = ({ value, onChange, label, placeholder, sport, onPlayerSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value && value.length >= 3 && sport) {
      setLoading(true);
      fetch(`http://localhost:3002/api/v1/player?name=${encodeURIComponent(value)}&sport=${sport.toUpperCase()}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setSuggestions([]);
    }
  }, [value, sport]);

  const handlePlayerSelect = (player) => {
    onChange(player.name);
    if (onPlayerSelect) {
      onPlayerSelect(player);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium text-emerald-300 mb-1">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-600/50 border-slate-500 text-white rounded-md py-1 px-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-20 left-0 right-0 bg-slate-800 border border-slate-600 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
          {loading && <li className="px-3 py-2 text-slate-400">Loading...</li>}
          {suggestions.map(player => (
            <li
              key={player._id}
              className="px-3 py-2 cursor-pointer hover:bg-emerald-600/30 text-white border-b border-slate-700 last:border-b-0"
              onMouseDown={() => handlePlayerSelect(player)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{player.name}</span>
                <span className="text-xs text-slate-400">
                  {player.position || player.role} • #{player.jerseyNumber || player.number}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerAutocompleteInput;
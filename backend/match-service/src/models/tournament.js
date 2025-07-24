const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['SERIES', 'TOURNAMENT'], required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
  results: [{
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    summary: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tournament', TournamentSchema);

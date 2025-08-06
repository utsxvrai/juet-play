const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  homeScore: {
    type: Number,
    default: 0,
  },
  awayScore: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed'],
    default: 'scheduled',
  },
  events: [{
    minute: Number,
    type: {
      type: String,
      enum: ['goal', 'yellow_card', 'red_card', 'substitution'],
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    description: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Match', matchSchema); 
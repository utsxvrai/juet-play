const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: {
    type: String,
    enum: ['CRICKET', 'FOOTBALL', 'BASKETBALL', 'VOLLEYBALL'],
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'ended'],
    default: 'upcoming'
  },
  startTime: Date,
  endTime: Date,

  teams: [{
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    name: String, // for redundancy in case team is deleted
    score: {
      runs: Number,            // Cricket
      wickets: Number,         // Cricket
      overs: Number,           // Cricket

      goals: Number,           // Football
      cards: {
        yellow: Number,
        red: Number
      },

      points: Number,          // Volleyball/Basketball
      sets: [Number]           // For Volleyball (e.g., [25, 20, 25])
    }
  }],

  events: [{
    type: String, // e.g., 'goal', 'wicket', 'point', 'yellow-card', 'run'
    timestamp: Date,
    team: String,
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    detail: String // optional note
  }],

  location: String,
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);

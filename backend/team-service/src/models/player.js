const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },

  sport: {
    type: String,
    enum: ['CRICKET', 'FOOTBALL', 'VOLLEYBALL', 'BASKETBALL'],
    required: true
  },

  currentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },

  stats: {
    matchesPlayed: { type: Number, default: 0 },

    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    ballsFaced: { type: Number, default: 0 },
    ballsBowled: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },

    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },

    spikes: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    serves: { type: Number, default: 0 },
    digs: { type: Number, default: 0 },

    points: { type: Number, default: 0 },
    rebounds: { type: Number, default: 0 },
    steals: { type: Number, default: 0 },
    assistsBasketball: { type: Number, default: 0 },
    fouls: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);

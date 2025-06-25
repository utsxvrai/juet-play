const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },

  sport: {
    type: String,
    enum: ['CRICKET', 'FOOTBALL', 'VOLLEYBALL', 'BASKETBALL'],
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],

  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },

  manager: {
    type: String,
    required: false
  },

  

  logo: {
    type: String, // URL to logo image
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);

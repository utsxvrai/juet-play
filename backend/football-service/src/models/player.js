const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  position: {
    type: String,
    enum: ['goalkeeper', 'defender', 'midfielder', 'forward'],
    required: true,
  },
  jerseyNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 99,
  },
  country: {
    type: String,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false,
  },
  goals: {
    type: Number,
    default: 0,
  },
  assists: {
    type: Number,
    default: 0,
  },
  yellowCards: {
    type: Number,
    default: 0,
  },
  redCards: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Player', playerSchema); 
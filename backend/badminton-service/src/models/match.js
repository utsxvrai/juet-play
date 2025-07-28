const mongoose = require('mongoose');
const { validate } = require('./player');

function arrayLimit(val) {
  return val.length === 1 || val.length === 2;
}

const matchSchema = new mongoose.Schema({
  hostId: {
    type: String,
    required: true
  },
  format: {
    type: String,
    enum: ['singles', 'doubles'],
    default: 'singles',
    required: true
  },
  playerOneIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    required: true,
    validate: [arrayLimit, 'playerOneIds must contain 1 or 2 players']
  },
  playerTwoIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    required: true,
    validate: [arrayLimit, 'playerTwoIds must contain 1 or 2 players']
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed'],
    default: 'scheduled'
  },
  scheduledTime: {
    type: Date,
    default: null
  },
  startedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  sets: [{
    setNumber: Number,
    playerOneScore: Number,
    playerTwoScore: Number,
    
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      default: null
    }
  }],
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: { 
    type: Date, 
    default: Date.now
  }
});

// Middleware to update updatedAt on save
matchSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BadmintonMatch', matchSchema);

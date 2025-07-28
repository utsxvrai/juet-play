// Player model for Badminton using Mongoose
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
  country: {
    type: String,
    required: true,
  },
  Won: {
    type: Number,
    default: 0,
  },
    Lost: {
        type: Number,
        default: 0,
    },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Player', playerSchema);

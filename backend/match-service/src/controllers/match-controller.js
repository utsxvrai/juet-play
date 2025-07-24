// Get all matches (for displaying hosted matches)
const Match = require('../models/match');
exports.getAllMatches = async (req, res) => {
  try {
    const { sport } = req.query;
    let query = {};
    if (sport) query.sport = sport;
    const matches = await Match.find(query).sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const matchService = require('../services/match-service');

// Host a new match and link to tournament
exports.hostMatch = async (req, res) => {
  try {
    const match = await matchService.hostMatch(req.body);
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update match result and winner
exports.updateMatchResult = async (req, res) => {
  try {
    const match = await matchService.updateMatchResult(req.body);
    res.json(match);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

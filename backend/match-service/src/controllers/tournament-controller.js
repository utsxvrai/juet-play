
const tournamentService = require('../services/tournament-service');


// Create a new tournament/series
exports.createTournament = async (req, res) => {
  try {
    const tournament = await tournamentService.createTournament(req.body);
    res.status(201).json(tournament);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// List all tournaments
exports.getTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getTournaments();
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a match to a tournament (and add teams if not present)
exports.addMatchToTournament = async (req, res) => {
  try {
    const tournament = await tournamentService.addMatchToTournament(req.body);
    res.json(tournament);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add/update match result in tournament
exports.addMatchResult = async (req, res) => {
  try {
    const tournament = await tournamentService.addMatchResult(req.body);
    res.json(tournament);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

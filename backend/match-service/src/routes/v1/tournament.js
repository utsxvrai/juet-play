const express = require('express');
const router = express.Router();
const tournamentController = require('../../controllers/tournament-controller');

// Create tournament
router.post('/create', tournamentController.createTournament);
// List tournaments
router.get('/', tournamentController.getTournaments);
// Add match to tournament
router.post('/add-match', tournamentController.addMatchToTournament);
// Add/update match result
router.post('/add-result', tournamentController.addMatchResult);

module.exports = router;

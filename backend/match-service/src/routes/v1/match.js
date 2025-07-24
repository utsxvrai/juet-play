const express = require('express');
const router = express.Router();
const matchController = require('../../controllers/match-controller');

// Host a new match (optionally link to tournament)
router.post('/host', matchController.hostMatch);
// Update match result (optionally link to tournament)
router.post('/update-result', matchController.updateMatchResult);

// Get all matches (optionally filter by sport)
router.get('/', matchController.getAllMatches);

module.exports = router;

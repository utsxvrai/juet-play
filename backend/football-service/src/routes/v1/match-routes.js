const { MatchController } = require('../../controllers');
const express = require('express');
const router = express.Router();

// Create a new match
router.post('/create', MatchController.createMatch);

// Get match by ID
router.get('/:id', MatchController.getMatchById);

// Get all matches (with pagination)
router.get('/', MatchController.getAllMatches);

// Update match by ID
router.put('/:id', MatchController.updateMatch);

// Delete match by ID
router.delete('/:id', MatchController.deleteMatch);

module.exports = router;

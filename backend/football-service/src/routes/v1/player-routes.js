const { PlayerController } = require('../../controllers');
const express = require('express');
const router = express.Router();

// Create a new player
router.post('/create', PlayerController.createPlayer);

// Get player by ID
router.get('/:id', PlayerController.getPlayerById);

// Get all players (with pagination)
router.get('/', PlayerController.getAllPlayers);

// Update player by ID
router.put('/:id', PlayerController.updatePlayer);

// Delete player by ID
router.delete('/:id', PlayerController.deletePlayer);

// Get players by country
router.get('/country/:country', PlayerController.getPlayersByCountry);

module.exports = router;

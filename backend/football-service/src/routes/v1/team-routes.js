const { TeamController } = require('../../controllers');
const express = require('express');
const router = express.Router();

// Create a new team
router.post('/create', TeamController.createTeam);

// Get team by ID
router.get('/:id', TeamController.getTeamById);

// Get all teams (with pagination)
router.get('/', TeamController.getAllTeams);

// Update team by ID
router.put('/:id', TeamController.updateTeam);

// Delete team by ID
router.delete('/:id', TeamController.deleteTeam);

// Get teams by country
router.get('/country/:country', TeamController.getTeamsByCountry);

module.exports = router;

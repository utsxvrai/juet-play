const { PlayerController } = require('../../controllers');
const express = require('express');
const router = express.Router();


router.post('/create', PlayerController.createPlayer);


router.get('/:id', PlayerController.getPlayerById);


router.put('/:id', PlayerController.updatePlayer);


router.delete('/:id', PlayerController.deletePlayer);


router.get('/', PlayerController.getAllPlayers);

// example: /players/country/India

router.get('/country/:country', PlayerController.getPlayersByCountry);


module.exports = router;

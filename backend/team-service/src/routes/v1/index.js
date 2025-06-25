const express = require('express');
const teamRoute = require('./team-route');
const playerRoute = require('./player-route');
const {InfoController} = require('../../controllers');


const router = express.Router();

router.get('/info', InfoController.info);
router.use('/team', teamRoute);
router.use('/player', playerRoute);

module.exports = router;
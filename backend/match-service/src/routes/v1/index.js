const express = require('express');
// const teamRoute = require('./team-route');
// const playerRoute = require('./player-route');
const tournamentRoute = require('./tournament');
const matchRoute = require('./match');
const {InfoController} = require('../../controllers');


const router = express.Router();


router.get('/info', InfoController.info);
// router.use('/team', teamRoute);
// router.use('/player', playerRoute);
router.use('/tournament', tournamentRoute);
router.use('/match', matchRoute);

module.exports = router;
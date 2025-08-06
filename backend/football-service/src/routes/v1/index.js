const express = require('express');
const { InfoController } = require('../../controllers');
const playerRoutes = require('./player-routes');
const teamRoutes = require('./team-routes');
const matchRoutes = require('./match-routes');

const router = express.Router();

router.get('/info', InfoController.info);
router.use('/player', playerRoutes);
router.use('/team', teamRoutes);
router.use('/match', matchRoutes);

module.exports = router;
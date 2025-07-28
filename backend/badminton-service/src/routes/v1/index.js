const express = require('express');
const { InfoController,  } = require('../../controllers')
const playerRoute = require('./player-route');
const matchRoute = require('./match-route');

const router = express.Router();

router.get('/info' , InfoController.info);
router.use('/player', playerRoute);
router.use('/match', matchRoute);


module.exports  = router;
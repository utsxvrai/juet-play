const { MatchController } = require('../../controllers');
const express = require('express');
const router = express.Router();


router.post('/create', MatchController.createMatch);

router.get('/:id', MatchController.getMatchById);

router.get('/', MatchController.getAllMatches);

router.delete('/:id', MatchController.deleteMatch);

router.put('/:id', MatchController.updateMatch);

module.exports = router;
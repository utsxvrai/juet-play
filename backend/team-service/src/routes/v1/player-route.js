const { PlayerController } = require('../../controllers');
const { AddPlayerRequestMiddlewares } = require('../../middlewares');
const express = require('express');
const router = express.Router();


router.post('/create', 
    AddPlayerRequestMiddlewares.validatePlayerRequest, 
    PlayerController.createPlayer
);

router.get('/', 
    PlayerController.getAllPlayers,
);


router.get('/:playerId',
    PlayerController.getPlayerById
);

router.get('/sport/:sport', PlayerController.getPlayersBySport);


router.put('/:playerId',
    AddPlayerRequestMiddlewares.validateUpdatePlayerRequest,
    PlayerController.updatePlayer
);


module.exports = router;
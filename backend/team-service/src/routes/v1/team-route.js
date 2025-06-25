const { TeamController } = require('../../controllers');
const { CreateTeamMiddlewares } = require('../../middlewares');
const express = require('express');
const router = express.Router();


router.post('/create',
    CreateTeamMiddlewares.validateCreateTeamRequest, 
    TeamController.createTeam
)

router.get('/', 
    TeamController.getAllTeams
);

// Get a specific team by ID



// get a team by id with players
router.get('/:teamId',  
    TeamController.getTeamById
);

//get team by sport

router.get('/:sport',
    CreateTeamMiddlewares.validateGetTeamsBySportRequest,
    TeamController.getTeamsBySport
);

router.put('/:teamId',
    CreateTeamMiddlewares.validateUpdateTeamRequest,
    TeamController.updateTeam
);




module.exports = router;
const { StatusCodes } = require('http-status-codes');
const { TeamService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');


async function createTeam(req, res) {
    try {
        const team = await TeamService.create({
            name: req.body.name,
            sport: req.body.sport,
            players: req.body.players || [],
            captain: req.body.captain,
            manager: req.body.manager,
            logo: req.body.logo
        });
        SuccessResponse.data = team;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getAllTeams(req, res) {
    try {
        const teams = await TeamService.getAllTeams();
        SuccessResponse.data = teams;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}



async function getTeamById(req, res) { //with players
    try {
        
        const team = await TeamService.getTeamById(req.params.teamId);
        SuccessResponse.data = team;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getTeamsBySport(req, res) {
    try {
        const teams = await TeamService.getTeamsBySport(req.params.sport);
        SuccessResponse.data = teams;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function addPlayerToTeam(req, res) {
    try{
        const { teamId, playerId } = req.body;
        const team = await TeamService.addPlayerToTeam(teamId, playerId);
        SuccessResponse.data = team;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }
    catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function updateTeam(req, res) {
    try {
        const updatedTeam = await TeamService.updateTeam(req.params.teamId, req.body);
        SuccessResponse.data = updatedTeam;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


module.exports ={
    createTeam,
    getAllTeams,
    getTeamById,
    getTeamsBySport,
    addPlayerToTeam,
    updateTeam
}



const { StatusCodes } = require('http-status-codes');
const { TeamService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');


const { PlayerService } = require('../services');

async function createTeam(req, res) {
    try {
        // players: array of { name, jerseyNumber, role, sport }
        const playerObjs = req.body.players || [];
        const createdPlayers = [];
        for (const [i, player] of playerObjs.entries()) {
            // Validation for required fields
            if (!player.name || typeof player.jerseyNumber !== 'number' || !player.role || !player.sport) {
                console.error(`Player at index ${i} missing required fields:`, player);
                ErrorResponse.message = `Player at index ${i} missing required fields: name, jerseyNumber, role, sport`;
                return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
            }
            // console.log('Creating player:', player);
            const created = await PlayerService.create({
                name: player.name,
                jerseyNumber: player.jerseyNumber,
                role: player.role,
                sport: player.sport,
                stats: player.stats || {},
                currentTeam: null
            });
            createdPlayers.push(created._id);
        }
        // Determine captain ObjectId from index
        let captainId = createdPlayers[0];
        if (typeof req.body.captain === 'number' && req.body.captain >= 0 && req.body.captain < createdPlayers.length) {
            captainId = createdPlayers[req.body.captain];
        }
        // Create team
        const teamData = {
            name: req.body.name,
            sport: req.body.sport,
            players: createdPlayers,
            captain: captainId,
            manager: req.body.manager,
            logo: req.body.logo
        };
        const team = await TeamService.create(teamData);
        // Update each player's currentTeam
        for (const playerId of createdPlayers) {
            await PlayerService.update(playerId, { currentTeam: team._id });
        }
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



const { TeamService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse } = require('../utils/common');

// Create a new team
async function createTeam(req, res) {
    try {
        const team = await TeamService.createTeam({
            name: req.body.name,
            coach: req.body.coach,
            country: req.body.country,
            wins: req.body.wins,
            losses: req.body.losses,
            draws: req.body.draws,
            players: req.body.players
        });
        SuccessResponse.data = team;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Get team by ID
async function getTeamById(req, res) {
    try {
        const team = await TeamService.getTeamById(req.params.id);
        if (!team) {
            return res.status(StatusCodes.NOT_FOUND).json(new ErrorResponse('Team not found'));
        }
        SuccessResponse.data = team;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Get all teams
async function getAllTeams(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    try {
        const data = await TeamService.getAllTeams({ page, limit });
        SuccessResponse.data = data.results;
        SuccessResponse.total = data.total;
        SuccessResponse.page = data.page;
        SuccessResponse.pages = data.pages;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Update team by ID
async function updateTeam(req, res) {
    try {
        const team = await TeamService.updateTeam(req.params.id, req.body);
        if (!team) {
            return res.status(StatusCodes.NOT_FOUND).json(new ErrorResponse('Team not found'));
        }
        SuccessResponse.data = team;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Delete team by ID
async function deleteTeam(req, res) {
    try {
        const team = await TeamService.deleteTeam(req.params.id);
        if (!team) {
            return res.status(StatusCodes.NOT_FOUND).json(new ErrorResponse('Team not found'));
        }
        SuccessResponse.data = team;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Get teams by country
async function getTeamsByCountry(req, res) {
    try {
        const teams = await TeamService.getTeamsByCountry(req.params.country);
        SuccessResponse.data = teams;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    createTeam,
    getTeamById,
    getAllTeams,
    updateTeam,
    deleteTeam,
    getTeamsByCountry
}; 
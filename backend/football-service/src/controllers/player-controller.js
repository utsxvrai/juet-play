const { PlayerService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse } = require('../utils/common');

// Create a new player
async function createPlayer(req, res) {
    try {
        const player = await PlayerService.createPlayer({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            position: req.body.position,
            jerseyNumber: req.body.jerseyNumber,
            country: req.body.country,
            team: req.body.team,
            goals: req.body.goals,
            assists: req.body.assists,
            yellowCards: req.body.yellowCards,
            redCards: req.body.redCards
        });
        SuccessResponse.data = player;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Get player by ID
async function getPlayerById(req, res) {
    try {
        const player = await PlayerService.getPlayerById(req.params.id);
        if (!player) {
            return res.status(StatusCodes.NOT_FOUND).json(new ErrorResponse('Player not found'));
        }
        SuccessResponse.data = player;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Get all players
async function getAllPlayers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    // console.log(page, limit);
    try {
        const data = await PlayerService.getAllPlayers({ page, limit });
        // console.log(data);
        SuccessResponse.data = data.results || data;
        SuccessResponse.total = data.total;
        SuccessResponse.page = data.page;
        SuccessResponse.pages = data.pages;
        // console.log(SuccessResponse);
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Update player by ID
async function updatePlayer(req, res) {
    try {
        const player = await PlayerService.updatePlayer(req.params.id, req.body);
        if (!player) {
            return res.status(StatusCodes.NOT_FOUND).json(new ErrorResponse('Player not found'));
        }
        SuccessResponse.data = player;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Delete player by ID
async function deletePlayer(req, res) {
    try {
        const player = await PlayerService.deletePlayer(req.params.id);
        if (!player) {
            return res.status(StatusCodes.NOT_FOUND).json(new ErrorResponse('Player not found'));
        }
        SuccessResponse.data = player;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Get players by country
async function getPlayersByCountry(req, res) {
    try {
        const players = await PlayerService.getPlayersByCountry(req.params.country);
        SuccessResponse.data = players;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    createPlayer,
    getPlayerById,
    getAllPlayers,
    updatePlayer,
    deletePlayer,
    getPlayersByCountry
}; 
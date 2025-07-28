const {PlayerService} = require('../services');
const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse } = require('../utils/common');

/** * Create a new player
 * POST : /players
 */
async function createPlayer(req, res) {
    try {
        const player = await PlayerService.createPlayer({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            country: req.body.country
        });
        SuccessResponse.data = player;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        // console.log(error);
        ErrorResponse.message = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


/** * Get player by ID
 * GET : /players/:id
 */
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

/** * Get all players
 * GET : /players
 */

async function getAllPlayers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    try {
        const data = await PlayerService.getAllPlayers({ page, limit });
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

/** * Update player by ID
 * PUT : /players/:id
 * req-body: {name, age, gender, country, Won, Lost}
 */

async function updatePlayer(req, res) {
    try {
        const player = await PlayerService.updatePlayerById(req.params.id, req.body);
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

/** * Delete player by ID
 * DELETE : /players/:id
 */

async function deletePlayer(req, res) {
    try {
        const player = await PlayerService.deletePlayerById(req.params.id);
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

/** * Get players by country( country name is passed as query parameter)
 * GET : /players/country/:country 
 * req-params: country
 * example: /players/country/India
 */

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
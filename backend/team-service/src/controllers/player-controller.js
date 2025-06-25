const { StatusCodes } = require('http-status-codes');
const { PlayerService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

// Create a new player
async function createPlayer(req, res) {
  try {
    
    const player = await PlayerService.create({
      name: req.body.name,
      sport: req.body.sport,
      currentTeam : req.body.currTeam || null, 
      stats: req.body.stats || {} // optional
    });

    SuccessResponse.data = player;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

// Get all players
async function getAllPlayers(req, res) {
  try {
    const players = await PlayerService.getAllPlayers();
    SuccessResponse.data = players;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

// Get a player by ID
async function getPlayerById(req, res) {
  try {
    const player = await PlayerService.getById(req.params.playerId);
    SuccessResponse.data = player;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res.status(StatusCodes.NOT_FOUND).json(ErrorResponse);
  }
}

// Get players by sport
async function getPlayersBySport(req, res) {
  try {
    const sport = req.params.sport.toUpperCase().trim();
    const players = await PlayerService.getPlayersBySport(sport);
    SuccessResponse.data = players;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

// Update player stats or info
async function updatePlayer(req, res) {
  try {
    const updatedPlayer = await PlayerService.update(req.params.playerId, req.body);
    SuccessResponse.data = updatedPlayer;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

async function getPlayerStats(req, res) {
  try {
    const stats = await PlayerService.getPlayerStats(req.params.playerId);
    SuccessResponse.data = stats;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}   

module.exports = {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  getPlayersBySport,
  updatePlayer,
  getPlayerStats
};

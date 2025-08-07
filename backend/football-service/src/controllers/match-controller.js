const { MatchService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');

// Create a new match
async function createMatch(req, res) {
    try {
        const match = await MatchService.createMatch({
            homeTeam: req.body.homeTeam,
            awayTeam: req.body.awayTeam,
            homeScore: req.body.homeScore,
            awayScore: req.body.awayScore,
            date: req.body.date,
            status: req.body.status,
            events: req.body.events
        });
        SuccessResponse.data = match;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Get match by ID
async function getMatchById(req, res) {
    try {
        const match = await MatchService.getMatchById(req.params.id);
        if (!match) {
            return res.status(StatusCodes.NOT_FOUND).json(new ErrorResponse('Match not found'));
        }
        SuccessResponse.data = match;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Get all matches
async function getAllMatches(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const data = await MatchService.getAllMatches({ page, limit });
        SuccessResponse.data = data.results ;
        SuccessResponse.total = data.total;
        SuccessResponse.page = data.page;
        SuccessResponse.pages = data.pages;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Update match by ID
async function updateMatch(req, res) {
    try {
        const match = await MatchService.updateMatch(req.params.id, req.body);
        if (!match) {
            return res.status(StatusCodes.NOT_FOUND).json(new ErrorResponse('Match not found'));
        }
        SuccessResponse.data = match;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

// Delete match by ID
async function deleteMatch(req, res) {
    try {
        const match = await MatchService.deleteMatch(req.params.id);
        if (!match) {
            return res.status(StatusCodes.NOT_FOUND).json(new ErrorResponse('Match not found'));
        }
        SuccessResponse.data = match;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    createMatch,
    getMatchById,
    getAllMatches,
    updateMatch,
    deleteMatch
}; 
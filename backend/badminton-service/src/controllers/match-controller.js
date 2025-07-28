const { MatchService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');


async function createMatch(req, res){
    try {
        const match = await MatchService.createMatch({ 
            hostId: req.body.hostId,
            format: req.body.format,
            playerOneIds: req.body.playerOneIds,
            playerTwoIds: req.body.playerTwoIds,
            scheduledTime: req.body.scheduledTime,
            status: req.body.status,
        });
        SuccessResponse.data = match;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    }
    catch(error){
        console.log(error);
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getMatchById(req, res){
    try{
        const match = await MatchService.getMatchById(req.params.id);
        SuccessResponse.data = match;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }
    catch(error){
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getAllMatches(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    try {
        const data = await MatchService.getAllMatches({ page, limit });
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

async function deleteMatch(req, res){
    try{
        const match = await MatchService.deleteMatch(req.params.id);
        SuccessResponse.data = match;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }
    catch(error){
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function updateMatch(req, res){
    try{
        const match = await MatchService.updateMatch(req.params.id, req.body);
        // Fetch the fully populated match (with player details)
        const populatedMatch = await MatchService.getMatchById(req.params.id);
        SuccessResponse.data = populatedMatch;
        // Emit socket event for live updates
        const io = req.app.get('io');
        if (io) {
            io.to(req.params.id).emit('scoreUpdate', populatedMatch);
        }
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }
    catch(error){
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    createMatch,
    getMatchById,
    getAllMatches,
    deleteMatch,
    updateMatch,
}


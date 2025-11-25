const { MatchService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');


async function createMatch(req, res) {
    try {
        // Input validation
        const { hostId, format, playerOneIds, playerTwoIds, scheduledTime, status } = req.body;

        if (!hostId || !format || !playerOneIds || !playerTwoIds) {
            ErrorResponse.message = 'Missing required fields: hostId, format, playerOneIds, playerTwoIds';
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }

        console.log('Creating match with:', { hostId, format, playerOneIds, playerTwoIds });

        const match = await MatchService.createMatch({
            hostId,
            format,
            playerOneIds,
            playerTwoIds,
            scheduledTime,
            status: status || 'scheduled',
        });

        SuccessResponse.data = match;
        SuccessResponse.message = 'Match created successfully';
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    }
    catch (error) {
        console.error('Error in createMatch controller:', error);
        ErrorResponse.message = error.message || 'Failed to create match';
        ErrorResponse.error = error;
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).json(ErrorResponse);
    }
}

async function getMatchById(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            ErrorResponse.message = 'Match ID is required';
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }

        const match = await MatchService.getMatchById(id);
        SuccessResponse.data = match;
        SuccessResponse.message = 'Match retrieved successfully';
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }
    catch (error) {
        console.error('Error in getMatchById controller:', error);
        ErrorResponse.message = error.message || 'Failed to retrieve match';
        ErrorResponse.error = error;
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).json(ErrorResponse);
    }
}

async function getAllMatches(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
        ErrorResponse.message = 'Invalid pagination parameters. Page and limit must be positive, limit max 100';
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    try {
        console.log(`Fetching matches: page=${page}, limit=${limit}`);
        const data = await MatchService.getAllMatches({ page, limit });

        SuccessResponse.data = data.results;
        SuccessResponse.total = data.total;
        SuccessResponse.page = data.page;
        SuccessResponse.pages = data.pages;
        SuccessResponse.message = 'Matches retrieved successfully';
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        console.error('Error in getAllMatches controller:', error);
        ErrorResponse.message = error.message || 'Failed to retrieve matches';
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function deleteMatch(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            ErrorResponse.message = 'Match ID is required';
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }

        console.log('Deleting match:', id);
        const match = await MatchService.deleteMatch(id);

        SuccessResponse.data = match;
        SuccessResponse.message = 'Match deleted successfully';
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }
    catch (error) {
        console.error('Error in deleteMatch controller:', error);
        ErrorResponse.message = error.message || 'Failed to delete match';
        ErrorResponse.error = error;
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).json(ErrorResponse);
    }
}

async function updateMatch(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            ErrorResponse.message = 'Match ID is required';
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            ErrorResponse.message = 'Request body cannot be empty';
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }

        console.log('Updating match:', id, 'with data:', req.body);
        const match = await MatchService.updateMatch(id, req.body);

        // Fetch the fully populated match (with player details)
        const populatedMatch = await MatchService.getMatchById(id);
        SuccessResponse.data = populatedMatch;
        SuccessResponse.message = 'Match updated successfully';

        // Emit socket event for live updates
        const io = req.app.get('io');
        if (io) {
            io.to(id).emit('scoreUpdate', populatedMatch);
            console.log('Emitted scoreUpdate event to room:', id);
        }

        return res.status(StatusCodes.OK).json(SuccessResponse);
    }
    catch (error) {
        console.error('Error in updateMatch controller:', error);
        ErrorResponse.message = error.message || 'Failed to update match';
        ErrorResponse.error = error;
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).json(ErrorResponse);
    }
}

module.exports = {
    createMatch,
    getMatchById,
    getAllMatches,
    deleteMatch,
    updateMatch,
}


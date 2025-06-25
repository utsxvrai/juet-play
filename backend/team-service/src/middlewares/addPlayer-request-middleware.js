const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { ErrorResponse } = require('../utils/common');

function validatePlayerRequest(req, res, next) {
    const { name, sport } = req.body;

    if (!name || !sport) {
        ErrorResponse.message = 'name  and sport  required';
        ErrorResponse.error = new AppError(['name and sport must be provided'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}

function validateGetPlayersByTeamRequest(req, res, next) {
    const { teamId } = req.params;

    if (!teamId) {
        ErrorResponse.message = 'Team ID is required';
        ErrorResponse.error = new AppError(['teamId must be provided'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}

function validateUpdatePlayerRequest(req, res, next) {
    const { playerId } = req.params;
    const allowedFields = ['name', 'age', 'position', 'teamId'];
    const keys = Object.keys(req.body);

    if (keys.length === 0) {
        ErrorResponse.message = 'No fields provided for update';
        ErrorResponse.error = new AppError(['At least one field is required to update the player'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    const isValid = keys.every(field => allowedFields.includes(field));

    if (!isValid) {
        ErrorResponse.message = 'Invalid fields provided';
        ErrorResponse.error = new AppError([`Only the following fields are allowed: ${allowedFields.join(', ')}`], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}

module.exports = {
    validatePlayerRequest,
    validateGetPlayersByTeamRequest,
    validateUpdatePlayerRequest
};


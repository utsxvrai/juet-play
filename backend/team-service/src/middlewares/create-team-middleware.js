const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { ErrorResponse } = require('../utils/common');

function validateCreateTeamRequest(req, res, next) {
    const { name, sport, manager } = req.body;

    if (!name || !sport || !manager) {
        ErrorResponse.message = 'Missing required fields';
        ErrorResponse.error = new AppError(['name, sport, and manager are required'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    const validSports = ['CRICKET', 'FOOTBALL', 'VOLLEYBALL', 'BASKETBALL'];
    if (!validSports.includes(sport)) {
        ErrorResponse.message = 'Invalid sport type';
        ErrorResponse.error = new AppError(['Sport must be one of CRICKET, FOOTBALL, VOLLEYBALL, BASKETBALL'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}

function validateGetTeamsBySportRequest(req, res, next) {
    const { sport } = req.params;

    if (!sport) {
        ErrorResponse.message = 'Sport parameter is required';
        ErrorResponse.error = new AppError(['Sport parameter must be provided'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    const validSports = ['CRICKET', 'FOOTBALL', 'VOLLEYBALL', 'BASKETBALL'];
    if (!validSports.includes(sport)) {
        ErrorResponse.message = 'Invalid sport type';
        ErrorResponse.error = new AppError(['Sport must be one of CRICKET, FOOTBALL, VOLLEYBALL, BASKETBALL'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}


function validateUpdateTeamRequest(req, res, next) {
    const allowedFields = ['name', 'sport', 'manager', 'captain', 'logo', 'players'];
    const keys = Object.keys(req.body);

    if (keys.length === 0) {
        ErrorResponse.message = 'No fields provided for update';
        ErrorResponse.error = new AppError(['At least one field is required to update the team'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    const isValid = keys.every(field => allowedFields.includes(field));

    if (!isValid) {
        ErrorResponse.message = 'Invalid fields provided';
        ErrorResponse.error = new AppError([`Only the following fields are allowed: ${allowedFields.join(', ')}`], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    // Optional: Validate sport value if being updated
    if (req.body.sport) {
        const validSports = ['CRICKET', 'FOOTBALL', 'VOLLEYBALL', 'BASKETBALL'];
        if (!validSports.includes(req.body.sport)) {
            ErrorResponse.message = 'Invalid sport type';
            ErrorResponse.error = new AppError(['Sport must be one of CRICKET, FOOTBALL, VOLLEYBALL, BASKETBALL'], StatusCodes.BAD_REQUEST);
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }
    }

    next();
}

module.exports = {
    validateCreateTeamRequest,
    validateGetTeamsBySportRequest,
    validateUpdateTeamRequest
};

const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { ErrorResponse } = require('../utils/common');

function validateCreateTeamRequest(req, res, next) {
    const { name, sport, manager, players } = req.body;

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

    if (!Array.isArray(players) || players.length === 0) {
        ErrorResponse.message = 'Players array is required and cannot be empty';
        ErrorResponse.error = new AppError(['players array is required'], StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    for (const player of players) {
        if (!player.name || typeof player.jerseyNumber !== 'number' || !player.role || !player.sport) {
            ErrorResponse.message = 'Each player must have name, jerseyNumber (number), role, and sport';
            ErrorResponse.error = new AppError(['Each player must have name, jerseyNumber, role, and sport'], StatusCodes.BAD_REQUEST);
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }
        if (!validSports.includes(player.sport)) {
            ErrorResponse.message = 'Invalid sport type for player';
            ErrorResponse.error = new AppError(['Player sport must be one of CRICKET, FOOTBALL, VOLLEYBALL, BASKETBALL'], StatusCodes.BAD_REQUEST);
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }
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

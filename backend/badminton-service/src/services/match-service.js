const { MatchRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');


const matchRepository = new MatchRepository();

async function createMatch(data){
    try {
        console.log('Creating match with data:', data);
        const match = await matchRepository.create(data);
        return match;
    } catch (error) {
        console.error('Error creating match:', error);
        
        // Provide more specific error messages
        if (error.message.includes('duplicate key error')) {
            throw new AppError('Match creation failed due to database constraint. Please try again.', StatusCodes.INTERNAL_SERVER_ERROR);
        } else if (error.message.includes('validation failed')) {
            throw new AppError('Invalid match data provided. Please check all required fields.', StatusCodes.BAD_REQUEST);
        } else {
            throw new AppError(`Failed to create match: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

async function getMatchById(id){
    try {
        const match = await matchRepository.get(id);
        return match;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllMatches(){
    try {
        const matches = await matchRepository.getAll();
        return matches;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateMatch(id, data){
    try {
        const match = await matchRepository.update(id, data);
        return match;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteMatch(id){
    try {
        const match = await matchRepository.destroy(id);
        return match;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createMatch,
    getMatchById,
    updateMatch,
    deleteMatch,
    getAllMatches
}

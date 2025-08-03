const { MatchRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const redis = require('../config/redis-config');

const matchRepository = new MatchRepository();

async function createMatch(data){
    try {
        // console.log('Creating match with data:', data);
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
    const cacheKey = `match:${id}`;
    try {
        const cachedMatch = await redis.get(cacheKey);
        if(cachedMatch){
            console.log('Match found in cache');
            return JSON.parse(cachedMatch);
        }
        // console.log('Match not found in cache, fetching from database');
        const match = await matchRepository.get(id);
        await redis.set(cacheKey, JSON.stringify(match), 'EX', 3600);
        return match;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllMatches({ page, limit }){
    const cacheKey = `matches:page:${page}:limit:${limit}`;
    try {
        const cachedMatches = await redis.get(cacheKey);
        if(cachedMatches){
            console.log('Matches found in cache');
            return JSON.parse(cachedMatches);
        }
        // console.log('Matches not found in cache, fetching from database');
        const matches =  await matchRepository.getAll({}, { page, limit });
        await redis.set(cacheKey, JSON.stringify(matches), 'EX', 3600);
        // console.log('Matches fetched from database and cached');
        return matches;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateMatch(id, data){
    try {
        const cacheKey = `match:${id}`;
        const match = await matchRepository.update(id, data);
        await redis.del(cacheKey);
        return match;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteMatch(id){
    try {
        const cacheKey = `match:${id}`;
        await redis.del(cacheKey);
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

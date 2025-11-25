const { MatchRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const redis = require('../config/redis-config');

const matchRepository = new MatchRepository();

/**
 * Clear all paginated match cache keys
 * This ensures that new matches appear immediately in all pages
 */
async function clearAllMatchCaches() {
    try {
        // Get all cache keys matching the pattern
        const keys = await redis.keys('matches:page:*');
        if (keys && keys.length > 0) {
            await redis.del(...keys);
            console.log(`Cleared ${keys.length} match cache keys`);
        }
    } catch (error) {
        console.error('Error clearing match caches:', error);
        // Don't throw - cache clearing failure shouldn't break the operation
    }
}

async function createMatch(data){
    try {
        // Validate required fields
        if (!data.hostId || !data.format || !data.playerOneIds || !data.playerTwoIds) {
            throw new AppError('Missing required fields: hostId, format, playerOneIds, playerTwoIds', StatusCodes.BAD_REQUEST);
        }

        // Validate player IDs arrays
        if (!Array.isArray(data.playerOneIds) || !Array.isArray(data.playerTwoIds)) {
            throw new AppError('playerOneIds and playerTwoIds must be arrays', StatusCodes.BAD_REQUEST);
        }

        // Validate format and player count match
        if (data.format === 'singles' && (data.playerOneIds.length !== 1 || data.playerTwoIds.length !== 1)) {
            throw new AppError('Singles format requires exactly 1 player per side', StatusCodes.BAD_REQUEST);
        }

        if (data.format === 'doubles' && (data.playerOneIds.length !== 2 || data.playerTwoIds.length !== 2)) {
            throw new AppError('Doubles format requires exactly 2 players per side', StatusCodes.BAD_REQUEST);
        }

        console.log('Creating match with data:', data);
        const match = await matchRepository.create(data);
        
        // CRITICAL FIX: Clear all paginated match caches so new match appears immediately
        await clearAllMatchCaches();
        console.log('Match created successfully, caches cleared');
        
        return match;
    } catch (error) {
        console.error('Error creating match:', error);
        
        // Provide more specific error messages
        if (error instanceof AppError) {
            throw error;
        } else if (error.message.includes('duplicate key error')) {
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
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new AppError('Invalid match ID format', StatusCodes.BAD_REQUEST);
        }

        const cachedMatch = await redis.get(cacheKey);
        if(cachedMatch){
            console.log('Match found in cache');
            return JSON.parse(cachedMatch);
        }
        
        console.log('Match not found in cache, fetching from database');
        const match = await matchRepository.get(id);
        await redis.set(cacheKey, JSON.stringify(match), 'EX', 3600);
        return match;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
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
        
        console.log('Matches not found in cache, fetching from database');
        const matches =  await matchRepository.getAll({}, { page, limit });
        await redis.set(cacheKey, JSON.stringify(matches), 'EX', 3600);
        console.log('Matches fetched from database and cached');
        return matches;
    } catch (error) {
        console.error('Error retrieving matches:', error);
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateMatch(id, data){
    try {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new AppError('Invalid match ID format', StatusCodes.BAD_REQUEST);
        }

        // Update timestamps based on status changes
        if (data.status === 'ongoing' && !data.startedAt) {
            data.startedAt = new Date();
        }
        if (data.status === 'completed' && !data.completedAt) {
            data.completedAt = new Date();
        }

        const cacheKey = `match:${id}`;
        const match = await matchRepository.update(id, data);
        
        // Clear individual match cache
        await redis.del(cacheKey);
        
        // CRITICAL FIX: Clear all paginated caches when match is updated
        // This ensures updated matches appear correctly in lists
        await clearAllMatchCaches();
        console.log('Match updated successfully, caches cleared');
        
        return match;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error updating match:', error);
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteMatch(id){
    try {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new AppError('Invalid match ID format', StatusCodes.BAD_REQUEST);
        }

        const cacheKey = `match:${id}`;
        await redis.del(cacheKey);
        
        const match = await matchRepository.destroy(id);
        
        // CRITICAL FIX: Clear paginated caches when match is deleted
        await clearAllMatchCaches();
        console.log('Match deleted successfully, caches cleared');
        
        return match;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Error deleting match:', error);
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

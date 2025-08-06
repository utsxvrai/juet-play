const { MatchRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const Team = require('../models/team');
const Match = require('../models/match');
const redis = require('../config/redis-config');

const matchRepository = new MatchRepository();

async function createMatch(data) {
    try {
        const match = await matchRepository.create(data);
        return match;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getMatchById(id) {
    const cacheKey = `match:${id}`;
    try {
        const cachedMatch = await redis.get(cacheKey);
        if (cachedMatch) return JSON.parse(cachedMatch);
        const match = await matchRepository.get(id);
        await redis.set(cacheKey, JSON.stringify(match), 'EX', 3600);
        return match;
    } catch (error) {
        throw new AppError('Error fetching match', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllMatches({ page, limit }) {
    const cacheKey = `matches:page:${page}:limit:${limit}`;
    try {
        const cachedMatches = await redis.get(cacheKey);
        if (cachedMatches) return JSON.parse(cachedMatches);
        const matches = await matchRepository.getAll({}, { page, limit });
        await redis.set(cacheKey, JSON.stringify(matches), 'EX', 3600);
        return matches;
    } catch (error) {
        throw new AppError('Error fetching matches', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateMatch(id, data) {
    const cacheKey = `match:${id}`;
    try {
        // Get current match to preserve existing events
        const currentMatch = await Match.findById(id);
        if (!currentMatch) {
            throw new AppError('Match not found', StatusCodes.NOT_FOUND);
        }

        // Handle events properly - append new events to existing ones
        let updatedData = { ...data };
        if (data.events && Array.isArray(data.events)) {
            // If events are provided, append them to existing events
            const existingEvents = currentMatch.events || [];
            updatedData.events = [...existingEvents, ...data.events];
        }

        const match = await matchRepository.update(id, updatedData);
        await redis.del(cacheKey);

        // Business logic: update team stats if match is completed
        if (data.status === 'completed') {
            const homeTeam = await Team.findById(match.homeTeam);
            const awayTeam = await Team.findById(match.awayTeam);
            if (!homeTeam || !awayTeam) throw new AppError('Teams not found', StatusCodes.NOT_FOUND);
            
            if (match.homeScore > match.awayScore) {
                homeTeam.wins += 1;
                awayTeam.losses += 1;
            } else if (match.homeScore < match.awayScore) {
                awayTeam.wins += 1;
                homeTeam.losses += 1;
            } else {
                homeTeam.draws += 1;
                awayTeam.draws += 1;
            }
            await homeTeam.save();
            await awayTeam.save();
        }
        
        return match;
    } catch (error) {
        throw new AppError('Error updating match', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteMatch(id) {
    const cacheKey = `match:${id}`;
    try {
        const match = await matchRepository.destroy(id);
        await redis.del(cacheKey);
        return match;
    } catch (error) {
        throw new AppError('Error deleting match', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createMatch,
    getMatchById,
    getAllMatches,
    updateMatch,
    deleteMatch
}; 
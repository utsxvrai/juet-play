const { PlayerRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const Team = require('../models/team');
const Match = require('../models/match');
const redis = require('../config/redis-config');

const playerRepository = new PlayerRepository();

async function createPlayer(data) {
    try {
        const player = await playerRepository.create(data);

        // Invalidate player lists cache
        const keys = await redis.keys('players:page:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }

        return player;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function getPlayerById(id) {
    const cacheKey = `player:${id}`;
    try {
        const cachedPlayer = await redis.get(cacheKey);
        if (cachedPlayer) return JSON.parse(cachedPlayer);
        const player = await playerRepository.get(id);
        await redis.set(cacheKey, JSON.stringify(player), 'EX', 3600);
        return player;
    } catch (error) {
        throw new AppError('Error fetching player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllPlayers({ page, limit }) {
    const cacheKey = `players:page:${page}:limit:${limit}`;
    // console.log(cacheKey);
    try {
        const cachedPlayers = await redis.get(cacheKey);
        // console.log(cachedPlayers);
        if (cachedPlayers) return JSON.parse(cachedPlayers);
        const players = await playerRepository.getAll({}, { page, limit });
        // console.log(players);
        await redis.set(cacheKey, JSON.stringify(players), 'EX', 3600);
        return players;
    } catch (error) {
        throw new AppError('Error fetching players', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updatePlayer(id, data) {
    const cacheKey = `player:${id}`;
    try {
        const player = await playerRepository.update(id, data);
        
        // Invalidate individual player cache
        await redis.del(cacheKey);
        
        // Invalidate all players list caches to ensure fresh data
        const keys = await redis.keys('players:page:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        
        return player;
    } catch (error) {
        throw new AppError('Error updating player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deletePlayer(id) {
    const cacheKey = `player:${id}`;
    try {
        // Prevent deletion if referenced in any team
        const teamRef = await Team.findOne({ players: id });
        if (teamRef) {
            throw new AppError('Cannot delete player: referenced in a team', StatusCodes.BAD_REQUEST);
        }
        // Prevent deletion if referenced in any match event
        const matchRef = await Match.findOne({ 'events.player': id });
        if (matchRef) {
            throw new AppError('Cannot delete player: referenced in a match event', StatusCodes.BAD_REQUEST);
        }
        const player = await playerRepository.destroy(id);
        
        // Invalidate individual player cache
        await redis.del(cacheKey);
        
        // Invalidate all players list caches to ensure fresh data
        const keys = await redis.keys('players:page:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        
        return player;
    } catch (error) {
        throw new AppError(error.message || 'Error deleting player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getPlayersByCountry(country) {
    try {
        const players = await playerRepository.getPlayersByCountry(country);
        return players;
    } catch (error) {
        throw new AppError('Error fetching players by country', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// Batch operations
async function bulkCreatePlayers(players) {
    try {
        const created = await Promise.all(players.map(createPlayer));
        return created;
    } catch (error) {
        throw new AppError('Error in bulk player creation', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function bulkUpdatePlayerStats(updates) {
    // updates: [{id, goals, assists, yellowCards, redCards}]
    try {
        const results = await Promise.all(updates.map(async (u) => {
            return await updatePlayer(u.id, u);
        }));
        return results;
    } catch (error) {
        throw new AppError('Error in bulk player stat update', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createPlayer,
    getPlayerById,
    getAllPlayers,
    updatePlayer,
    deletePlayer,
    getPlayersByCountry,
    bulkCreatePlayers,
    bulkUpdatePlayerStats
}; 
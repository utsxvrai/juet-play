const { TeamRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const Team = require('../models/team');
const redis = require('../config/redis-config');

const teamRepository = new TeamRepository();

async function createTeam(data) {
    try {
        // Enforce unique team name
        const existing = await Team.findOne({ name: data.name });
        if (existing) {
            throw new AppError('Team name must be unique', StatusCodes.BAD_REQUEST);
        }
        const team = await teamRepository.create(data);
        const keys = await redis.keys('teams:page:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        return team;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getTeamById(id) {
    const cacheKey = `team:${id}`;
    try {
        const cachedTeam = await redis.get(cacheKey);
        if (cachedTeam) return JSON.parse(cachedTeam);
        const team = await teamRepository.get(id);
        await redis.set(cacheKey, JSON.stringify(team), 'EX', 3600);
        return team;
    } catch (error) {
        throw new AppError('Error fetching team', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllTeams({ page, limit }) {
    const cacheKey = `teams:page:${page}:limit:${limit}`;
    try {
        const cachedTeams = await redis.get(cacheKey);
        if (cachedTeams) return JSON.parse(cachedTeams);
        const teams = await teamRepository.getAll({}, { page, limit });
        await redis.set(cacheKey, JSON.stringify(teams), 'EX', 3600);
        return teams;
    } catch (error) {
        throw new AppError('Error fetching teams', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateTeam(id, data) {
    const cacheKey = `team:${id}`;
    try {
        // Enforce unique team name on update
        if (data.name) {
            const existing = await Team.findOne({ name: data.name, _id: { $ne: id } });
            if (existing) {
                throw new AppError('Team name must be unique', StatusCodes.BAD_REQUEST);
            }
        }
        const team = await teamRepository.update(id, data);
        
        // Invalidate individual team cache
        await redis.del(cacheKey);
        
        // Invalidate all teams list caches to ensure fresh data
        const keys = await redis.keys('teams:page:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        
        return team;
    } catch (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteTeam(id) {
    const cacheKey = `team:${id}`;
    try {
        const team = await teamRepository.destroy(id);
        
        // Invalidate individual team cache
        await redis.del(cacheKey);
        
        // Invalidate all teams list caches to ensure fresh data
        const keys = await redis.keys('teams:page:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        
        return team;
    } catch (error) {
        throw new AppError('Error deleting team', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getTeamsByCountry(country) {
    try {
        const teams = await teamRepository.getTeamsByCountry(country);
        return teams;
    } catch (error) {
        throw new AppError('Error fetching teams by country', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// Batch operations
async function bulkCreateTeams(teams) {
    try {
        const created = await Promise.all(teams.map(createTeam));
        return created;
    } catch (error) {
        throw new AppError('Error in bulk team creation', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function bulkUpdateTeams(updates) {
    // updates: [{id, ...fields}]
    try {
        const results = await Promise.all(updates.map(async (u) => {
            return await updateTeam(u.id, u);
        }));
        return results;
    } catch (error) {
        throw new AppError('Error in bulk team update', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createTeam,
    getTeamById,
    getAllTeams,
    updateTeam,
    deleteTeam,
    getTeamsByCountry,
    bulkCreateTeams,
    bulkUpdateTeams
}; 
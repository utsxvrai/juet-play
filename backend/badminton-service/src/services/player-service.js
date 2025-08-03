const {PlayerRepository} = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const redis = require('../config/redis-config');



const playerRepository = new PlayerRepository();


async function createPlayer(data){
    try {
        const player = await playerRepository.create(data);
        return player;
    } catch (error) {
        // console.log(error);
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getPlayerById(id) {
    const cacheKey = `player:${id}`;
    try {
        const cachedPlayer = await redis.get(cacheKey);
        if(cachedPlayer){
            // console.log('Player found in cache');
            return JSON.parse(cachedPlayer);
        }
        // console.log('Player not found in cache, fetching from database');
        const player = await playerRepository.get(id);
        await redis.set(cacheKey, JSON.stringify(player), 'EX', 3600);
        return player;
    } catch (error) {
        throw new AppError('Error fetching player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllPlayers({ page, limit }) {
    const cacheKey = `players:page:${page}:limit:${limit}`;
    try {
        const cachedPlayers = await redis.get(cacheKey);
        if(cachedPlayers){
            // console.log('Players found in cache');
            return JSON.parse(cachedPlayers);
        }
        // console.log('Players not found in cache, fetching from database');
        const players = await playerRepository.getAll({}, { page, limit });
        await redis.set(cacheKey, JSON.stringify(players), 'EX', 3600);
        // console.log('Players fetched from database and cached');
        return players;
    } catch (error) {
        throw new AppError('Error fetching players', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updatePlayer(id, data) {
    const cacheKey = `player:${id}`;
    try {
        const player = await playerRepository.update(id, data);
        await redis.del(cacheKey);
        return player;
    } catch (error) {
        throw new AppError('Error updating player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deletePlayer(id) {
    const cacheKey = `player:${id}`;
    try {
        const player = await playerRepository.destroy(id);
        await redis.del(cacheKey);
        return player;
    } catch (error) {
        throw new AppError('Error deleting player', StatusCodes.INTERNAL_SERVER_ERROR);
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

module.exports = {
    createPlayer,
    getPlayerById,
    getAllPlayers,
    updatePlayer,
    deletePlayer,
    getPlayersByCountry
};
const { StatusCodes} = require('http-status-codes');
const { PlayerRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');


async function create(data){
    try{
        const player = await PlayerRepository.create(data);
        return player;   
    }
    catch(error){
        console.error("Error creating player:", error);
        throw new AppError('Error creating player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllPlayers(){
    try {
        const players = await PlayerRepository.getAll();
        return players;
    }
    catch (error) {
        throw new AppError('Error fetching players', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getPlayer(id) {
    try {
        const player = await PlayerRepository.get(id);
        if (!player) {
            throw new AppError('Player not found', StatusCodes.NOT_FOUND);
        }
        return player;
    } catch (error) {
        throw new AppError('Error fetching player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function searchPlayersByName(name, sport) {
    try {
        const players = await PlayerRepository.searchPlayersByName(name, sport);
        return players;
    } catch (error) {
        throw new AppError('Error searching players by name', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getPlayersBySport(sport) {
    try {
        const normalizedSport = sport.toUpperCase().trim();
        const players = await PlayerRepository.getPlayersBySport(normalizedSport);
        return players;
    } catch (error) {
        throw new AppError('Error fetching players by sport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getPlayerStats(id) {
    try {
        const stats = await PlayerRepository.getPlayerStats(id);
        if (!stats) {
            throw new AppError('Player stats not found', StatusCodes.NOT_FOUND);
        }
        return stats;
    } catch (error) {
        throw new AppError('Error fetching player stats', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updatePlayer(id, data) {
    try {
        const updatedPlayer = await PlayerRepository.update(id, data);
        if (!updatedPlayer) {
            throw new AppError('Player not found', StatusCodes.NOT_FOUND);
        }
        return updatedPlayer;
    } catch (error) {
        throw new AppError('Error updating player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    create,
    getAllPlayers,
    getPlayer,
    searchPlayersByName,
    getPlayersBySport,
    getPlayerStats,
    updatePlayer
};
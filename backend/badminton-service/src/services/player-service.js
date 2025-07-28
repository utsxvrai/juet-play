const {PlayerRepository} = require('../repositories');
const {StatusCodes} = require('http-status-codes');
const AppError = require('../utils/errors/app-error');




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
    try {
        const player = await playerRepository.get(id);
        return player;
    } catch (error) {
        throw new AppError('Error fetching player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllPlayers({ page, limit }) {
    try {
        const players = await playerRepository.getAll({}, { page, limit });
        return players;
    } catch (error) {
        throw new AppError('Error fetching players', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updatePlayer(id, data) {
    try {
        const player = await playerRepository.update(id, data);
        return player;
    } catch (error) {
        throw new AppError('Error updating player', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deletePlayer(id) {
    try {
        const player = await playerRepository.destroy(id);
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
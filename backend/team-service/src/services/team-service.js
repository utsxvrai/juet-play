const { StatusCodes} = require('http-status-codes');
const { TeamRepository, PlayerRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');


async function create(data){
    try{
        const team = await TeamRepository.create(data);
        return team;   
    }
    catch{
        throw new AppError('Error creating team', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllTeams() {
    try {
        const teams = await TeamRepository.getAll();
        return teams;
    }
    catch (error) {
        throw new AppError('Error fetching teams', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function getTeamById(id) {
    try{
        const team = await TeamRepository.getTeamWithPlayers(id);
        if (!team) {
            throw new AppError('Team not found', StatusCodes.NOT_FOUND);
        }
        return team;
    }
    catch (error) {
        throw new AppError('Error fetching team', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getTeamsBySport(sport) {
    try {
        const teams = await TeamRepository.getTeamsBySport(sport);
        return teams;
    }
    catch (error) {
        throw new AppError('Error fetching teams by sport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addPlayerToTeam(teamId, playerId) {
    try {
        // Check if player exists
        const player = await PlayerRepository.get(playerId);
        if (!player) {
            throw new AppError('Player not found', StatusCodes.NOT_FOUND);
        }
        const updatedTeam = await TeamRepository.addPlayerToTeam(teamId, playerId);
        if (!updatedTeam) {
            throw new AppError('Team not found', StatusCodes.NOT_FOUND);
        }
        return updatedTeam;
    } catch (error) {
        throw new AppError('Error adding player to team', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    create,
    getAllTeams,
    getTeamById,
    getTeamsBySport,
    addPlayerToTeam
};
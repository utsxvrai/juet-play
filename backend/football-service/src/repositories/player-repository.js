const CrudRepository = require('./crud-repository');
const Player = require('../models/player');

class PlayerRepository extends CrudRepository {
    constructor() {
        super(Player);
    }

    async getPlayersByCountry(country) {
        const players = await Player.find({ country: country });
        return players;
    }
}

module.exports = PlayerRepository; 
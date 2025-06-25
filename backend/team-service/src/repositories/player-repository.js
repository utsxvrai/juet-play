const CrudRepository = require('./crud-repository');
const Player = require('../models/player');

class PlayerRepository extends CrudRepository {
  constructor() {
    super(Player);
  }

  async getPlayersBySport(sport) {
    return Player.find({ sport });
  }

  async searchPlayersByName(name, sport) {
    return Player.find({
      sport,
      name: { $regex: new RegExp(name, 'i') }
    });
  }

  async getPlayerStats(id) {
    return Player.findById(id).select('name sport stats');
  }
}

module.exports = PlayerRepository;

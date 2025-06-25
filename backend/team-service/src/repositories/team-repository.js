const CrudRepository = require('./crud-repository');
const Team = require('../models/team');

class TeamRepository extends CrudRepository {
  constructor() {
    super(Team);
  }

  async getTeamsBySport(sport) {
    return Team.find({ sport }).populate('players captain manager');
  }

  async getTeamWithPlayers(teamId) {
    return Team.findById(teamId).populate('players captain manager');
  }

  async addPlayerToTeam(teamId, playerId) {
    return Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { players: playerId } }, // avoid duplicates
      { new: true }
    ).populate('players captain manager');
  }
}

module.exports = TeamRepository;

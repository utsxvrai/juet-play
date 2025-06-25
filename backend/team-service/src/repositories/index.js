const PlayerRepository = require('./player-repository');
const TeamRepository = require('./team-repository');

module.exports = {
  PlayerRepository: new PlayerRepository(),  // ✅ Must be an INSTANCE
  TeamRepository: new TeamRepository()
};

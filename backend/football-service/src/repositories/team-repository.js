const CrudRepository = require('./crud-repository');
const Team = require('../models/team');

class TeamRepository extends CrudRepository {
    constructor() {
        super(Team);
    }

    async getTeamsByCountry(country) {
        const teams = await Team.find({ country: country });
        return teams;
    }
}

module.exports = TeamRepository; 
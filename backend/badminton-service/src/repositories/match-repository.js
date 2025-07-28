const  CrudRepository  = require('./crud-repository');
const  Match  = require('../models/match');


class MatchRepository extends CrudRepository{
    constructor(){
        super(Match);
    }
}

module.exports = MatchRepository;



const Tournament = require('../models/tournament');

async function create(data) {
  const tournament = new Tournament(data);
  await tournament.save();
  return tournament;
}

async function findAll() {
  return Tournament.find().populate('teams').populate('matches');
}

async function findById(id) {
  return Tournament.findById(id).populate('teams').populate('matches');
}

async function save(tournament) {
  return tournament.save();
}

module.exports = {
  create,
  findAll,
  findById,
  save
};

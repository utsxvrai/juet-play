const Match = require('../models/match');

async function create(data) {
  const match = new Match(data);
  await match.save();
  return match;
}

async function findById(id) {
  return Match.findById(id);
}

async function updateById(id, update) {
  return Match.findByIdAndUpdate(id, update, { new: true });
}

module.exports = {
  create,
  findById,
  updateById
};

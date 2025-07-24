const Tournament = require('../models/tournament');

async function createTournament(data) {
  const tournament = new Tournament(data);
  await tournament.save();
  return tournament;
}

async function getTournaments() {
  return Tournament.find(); // Do not populate teams or matches
}

async function addMatchToTournament({ tournamentId, matchId, teamAId, teamBId }) {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) throw new Error('Tournament not found');
  if (!tournament.teams.includes(teamAId)) tournament.teams.push(teamAId);
  if (!tournament.teams.includes(teamBId)) tournament.teams.push(teamBId);
  tournament.matches.push(matchId);
  await tournament.save();
  return tournament;
}

async function addMatchResult({ tournamentId, matchId, winnerId, summary }) {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) throw new Error('Tournament not found');
  const resultIndex = tournament.results.findIndex(r => r.match.toString() === matchId);
  if (resultIndex > -1) {
    tournament.results[resultIndex] = { match: matchId, winner: winnerId, summary };
  } else {
    tournament.results.push({ match: matchId, winner: winnerId, summary });
  }
  await tournament.save();
  return tournament;
}

module.exports = {
  createTournament,
  getTournaments,
  addMatchToTournament,
  addMatchResult
};

const Match = require('../models/match');
const Tournament = require('../models/tournament');

async function hostMatch({ tournamentId, ...matchData }) {
  const match = new Match(matchData);
  await match.save();
  if (tournamentId) {
    const teamAId = match.teams[0]?.teamId;
    const teamBId = match.teams[1]?.teamId;
    await Tournament.findByIdAndUpdate(
      tournamentId,
      {
        $addToSet: {
          matches: match._id,
          teams: { $each: [teamAId, teamBId] }
        }
      }
    );
  }
  return match;
}

async function updateMatchResult({ matchId, winnerId, summary, tournamentId }) {
  const match = await Match.findByIdAndUpdate(matchId, { winner: winnerId }, { new: true });
  if (tournamentId) {
    const Tournament = require('../models/tournament');
    const tournament = await Tournament.findById(tournamentId);
    if (tournament) {
      const resultIndex = tournament.results.findIndex(r => r.match.toString() === matchId);
      if (resultIndex > -1) {
        tournament.results[resultIndex] = { match: matchId, winner: winnerId, summary };
      } else {
        tournament.results.push({ match: matchId, winner: winnerId, summary });
      }
      await tournament.save();
    }
  }
  return match;
}

module.exports = {
  hostMatch,
  updateMatchResult
};

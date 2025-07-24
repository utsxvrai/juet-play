const fetch = require('node-fetch');

const TEAM_SERVICE_URL = process.env.TEAM_SERVICE_URL || 'http://localhost:3001/api/v1/team'; // team-service runs on 3001

async function getAllTeams() {
  const res = await fetch(TEAM_SERVICE_URL);
  if (!res.ok) throw new Error('Failed to fetch teams');
  const data = await res.json();
  return data.data;
}

async function searchTeamsByName(name) {
  const res = await fetch(`${TEAM_SERVICE_URL}?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Failed to search teams');
  const data = await res.json();
  return data.data;
}

module.exports = { getAllTeams, searchTeamsByName };

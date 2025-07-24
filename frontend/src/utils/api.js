export const MATCH_SERVICE_URL = 'http://localhost:3002/api/v1';
export const TEAM_SERVICE_URL = 'http://localhost:3001/api/v1';

export async function fetchMatchesBySport(sport) {
  const res = await fetch(`${MATCH_SERVICE_URL}/match?sport=${sport}`);
//   console.log(res);
  if (!res.ok) throw new Error('Failed to fetch matches');
  const data = await res.json();
//   console.log(data);
  return data || [];
}

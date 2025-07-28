export const BADMINTON_SERVICE_URL = 'https://juet-play.onrender.com/api/v1';
export const FOOTBALL_SERVICE_URL = 'http://localhost:3003/api/v1';
export const VOLLEYBALL_SERVICE_URL = 'http://localhost:3004/api/v1';
export const BASKETBALL_SERVICE_URL = 'http://localhost:3005/api/v1';

export async function fetchPlayers(sport) {
  let url;
  switch(sport.toLowerCase()) {
    case 'badminton':
      url = `${BADMINTON_SERVICE_URL}/player`;
      break;
    case 'football':
      url = `${FOOTBALL_SERVICE_URL}/player`;
      break;
    case 'volleyball':
      url = `${VOLLEYBALL_SERVICE_URL}/player`;
      break;
    case 'basketball':
      url = `${BASKETBALL_SERVICE_URL}/player`;
      break;
    default:
      throw new Error('Invalid sport');
  }
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log(`API Response for ${sport} players:`, data);
    
    // Handle different response structures
    if (data && data.data) {
      return data.data; // If response has a data property
    } else if (Array.isArray(data)) {
      return data; // If response is directly an array
    } else {
      return []; // Return empty array if unexpected structure
    }
  } catch (error) {
    console.error(`Error fetching ${sport} players:`, error);
    throw error;
  }
}

export async function fetchMatchesBySport(sport) {
  let url;
  switch(sport.toLowerCase()) {
    case 'badminton':
      url = `${BADMINTON_SERVICE_URL}/match`;
      break;
    case 'football':
      url = `${FOOTBALL_SERVICE_URL}/match`;
      break;
    case 'volleyball':
      url = `${VOLLEYBALL_SERVICE_URL}/match`;
      break;
    case 'basketball':
      url = `${BASKETBALL_SERVICE_URL}/match`;
      break;
    default:
      throw new Error('Invalid sport');
  }
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log(`API Response for ${sport} matches:`, data);
    
    // Handle different response structures
    if (data && data.data) {
      return data.data; // If response has a data property
    } else if (Array.isArray(data)) {
      return data; // If response is directly an array
    } else {
      return []; // Return empty array if unexpected structure
    }
  } catch (error) {
    console.error(`Error fetching ${sport} matches:`, error);
    throw error;
  }
}



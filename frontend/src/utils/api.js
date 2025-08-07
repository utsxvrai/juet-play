// export const BADMINTON_SERVICE_URL = 'http://localhost:3002';
export const BADMINTON_SERVICE_URL = 'https://juet-play.onrender.com';
export const FOOTBALL_SERVICE_URL = 'http://localhost:3002';
export const VOLLEYBALL_SERVICE_URL = 'http://localhost:3004/api/v1';
export const BASKETBALL_SERVICE_URL = 'http://localhost:3005/api/v1';

export async function fetchPlayers(sport , { page = 1, limit = 6 } = {}) {
  let url;
  switch(sport.toLowerCase()) {
    case 'badminton':
      url = `${BADMINTON_SERVICE_URL}/api/v1/player?page=${page}&limit=${limit}`;
      // console.log(url);
      break;
    case 'football':
      url = `${FOOTBALL_SERVICE_URL}/api/v1/player`;
      break;
    case 'volleyball':
      url = `${VOLLEYBALL_SERVICE_URL}/api/v1/player`;
      break;
    case 'basketball':
      url = `${BASKETBALL_SERVICE_URL}/api/v1/player`;
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
    // console.log(`API Response for ${sport} players:`, data);
    
    // Handle different response structures
    if (data && data.data) {
      return data; // If response has a data property
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
export async function fetchMatchesBySport(sport, { page = 1, limit = 6 } = {}) {
  let url;
  switch(sport.toLowerCase()) {
    case 'badminton':
      url = `${BADMINTON_SERVICE_URL}/api/v1/match?page=${page}&limit=${limit}`;
      break;
    case 'football':
      url = `${FOOTBALL_SERVICE_URL}/match?page=${page}&limit=${limit}`;
      break;
    case 'volleyball':
      url = `${VOLLEYBALL_SERVICE_URL}/match?page=${page}&limit=${limit}`;
      break;
    case 'basketball':
      url = `${BASKETBALL_SERVICE_URL}/match?page=${page}&limit=${limit}`;
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

    // Always return the whole response object for pagination (contains data, total, page, pages)
    if (data && data.data && Array.isArray(data.data)) {
      return data;
    } else if (Array.isArray(data)) {
      // Fallback: wrap as expected
      return { data, total: data.length, page: 1, pages: 1 };
    } else {
      // Fallback: always return an object
      return { data: [], total: 0, page: 1, pages: 1 };
    }
  } catch (error) {
    console.error(`Error fetching ${sport} matches:`, error);
    throw error;
  }
}

// BADMINTON_SERVICE_URL can it be exported to be used in other files? 
// Yes, BADMINTON_SERVICE_URL is exported and can be used in other files

// Calculate the distance between two coordinates using the Haversine formula
export function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
}

// Helper function to get color based on PSI value
export function getPSIColor(psi) {
  if (psi >= 101) return '#ff4d4d'; // Unhealthy
  if (psi >= 51) return '#ffe066';  // Moderate
  return '#b7e778';                 // Good
}

export function getRegionFromCoords(lat, lon) {
  if (lat > 1.38 && lon < 103.85) return 'north';
  if (lat > 1.38 && lon >= 103.85) return 'central';
  if (lat < 1.32 && lon > 103.9) return 'east';
  if (lat < 1.32 && lon < 103.8) return 'west';
  if (lat < 1.28) return 'south';
}
export interface OSRMRouteResponse {
  code: string;
  routes: {
    geometry: GeoJSON.LineString;
    duration: number;
    distance: number;
    legs: any[];
  }[];
  waypoints: any[];
}

export async function fetchOSRMRoute(
  start: [number, number],
  end: [number, number]
): Promise<OSRMRouteResponse> {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch route from OSRM");
  }
  
  return response.json();
}

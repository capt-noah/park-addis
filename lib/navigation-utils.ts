"use client";

/**
 * Calculates the distance between two points in meters using the Haversine formula.
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaphi = ((lat2 - lat1) * Math.PI) / 180;
  const deltalambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaphi / 2) * Math.sin(deltaphi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltalambda / 2) * Math.sin(deltalambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculates the bearing between two points in degrees.
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const lambda1 = (lon1 * Math.PI) / 180;
  const lambda2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  const theta = Math.atan2(y, x);
  const brng = ((theta * 180) / Math.PI + 360) % 360; // in degrees

  return brng;
}

/**
 * Finds the minimum distance from a point to a polyline (LineString).
 */
export function getDistanceToPolyline(
  point: [number, number],
  polyline: [number, number][]
): { distance: number; index: number } {
  let minDistance = Infinity;
  let closestIndex = 0;

  for (let i = 0; i < polyline.length; i++) {
    const dist = getDistance(point[1], point[0], polyline[i][1], polyline[i][0]);
    if (dist < minDistance) {
      minDistance = dist;
      closestIndex = i;
    }
  }

  return { distance: minDistance, index: closestIndex };
}

/**
 * Slices a polyline from a given index to the end.
 */
export function sliceRoute(polyline: [number, number][], index: number): [number, number][] {
  return polyline.slice(index);
}

/**
 * Calculates the total distance of a polyline in meters.
 */
export function calculateTotalDistance(polyline: [number, number][]): number {
  let totalDist = 0;
  for (let i = 0; i < polyline.length - 1; i++) {
    totalDist += getDistance(
      polyline[i][1],
      polyline[i][0],
      polyline[i + 1][1],
      polyline[i + 1][0]
    );
  }
  return totalDist;
}

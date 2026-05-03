import { getCachedRoute, setRouteCache } from "./cache/route-cache";

export async function getRoute(
  start: { lng: number; lat: number } | null,
  end: [number, number] | null,
) {
  if (!start || !end) return;

  // Round to 4 decimal places for cache efficiency
  const sLat = Number(start.lat.toFixed(4));
  const sLng = Number(start.lng.toFixed(4));
  const eLat = Number(end[1].toFixed(4));
  const eLng = Number(end[0].toFixed(4));

  const cache = await getCachedRoute(sLat, sLng, eLat, eLng);
  if (cache) return cache;

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end[0]},${end[1]}?overview=full&geometries=geojson`,
  );

  const data = (await response.json()) as { routes?: { geometry: any }[] };

  if (!data?.routes || data.routes.length === 0) {
    throw new Error("No Route Found");
  }

  const geometry = data.routes[0].geometry;
  
  if (geometry) {
    await setRouteCache(sLat, sLng, eLat, eLng, geometry);
  }

  return geometry;
}

export async function getRouteBoounds(coords: number[][]) {
  const bounds = coords.reduce(
    (acc, [lng, lat]) => ({
      minLng: Math.min(acc.minLng, lng),
      maxLng: Math.max(acc.maxLng, lng),
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
    }),
    {
      minLng: coords[0][0],
      maxLng: coords[0][0],
      minLat: coords[0][1],
      maxLat: coords[0][1],
    },
  );

  return [
    [bounds.minLng, bounds.minLat],
    [bounds.maxLng, bounds.maxLat],
  ];
}

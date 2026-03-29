"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../MapContext";
import { fetchOSRMRoute } from "@/lib/osrm";
import maplibregl from "maplibre-gl";

export function RouteManager() {
  const { map, coords, navigation, actions } = useMap();
  const lastDestination = useRef<string | null>(null);

  useEffect(() => {
    if (!map || !coords || !navigation.destination || navigation.status === "IDLE") {
      if (navigation.status === "IDLE" && navigation.routeGeometry) {
        actions.setRouteGeometry(null);
      }
      return;
    }

    const { lng, lat } = navigation.userCoords || coords;
    const dest = navigation.destination as { lng: number; lat: number };
    const destKey = `${dest.lng},${dest.lat}`;

    // Only refetch if destination changed or we don't have a route yet
    if (lastDestination.current === destKey && navigation.routeGeometry) return;

    const updateRoute = async () => {
      try {
        const response = await fetchOSRMRoute([lng, lat], [dest.lng, dest.lat]);
        if (response.routes.length > 0) {
          const route = response.routes[0];
          actions.setRouteGeometry(route.geometry as any);
          actions.updateNavigationMetrics(route.distance, route.duration);
          lastDestination.current = destKey;

          // Fit bounds if in PREVIEW mode
          if (navigation.status === "PREVIEW") {
            const bounds = new maplibregl.LngLatBounds();
            route.geometry.coordinates.forEach((coord: any) => {
              bounds.extend(coord as [number, number]);
            });
            
            map.fitBounds(bounds, {
              padding: { top: 100, bottom: 250, left: 50, right: 50 },
              duration: 1000,
            });
          }
        }
      } catch (error) {
        console.error("RouteManager error:", error);
      }
    };

    updateRoute();
  }, [map, coords, navigation.destination, navigation.status, navigation.userCoords, actions]);

  return null;
}

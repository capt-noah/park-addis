"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../MapContext";
import { fetchOSRMRoute } from "@/lib/osrm";
import maplibregl from "maplibre-gl";

import { useSession } from "../../session/AppSessionProvider"

export function RouteManager() {
  const { map, coords, navigation, actions } = useMap();
  const { activeReservation } = useSession();
  const lastDestination = useRef<string | null>(null);

  useEffect(() => {
    // Auto-trigger preview for active reservation if IDLE
    if (activeReservation && navigation.status === "IDLE" && !navigation.destination) {
       // Note: This logic depends on MapView/LocationsContainer setting the destination.
       // I'll handle the auto-preview in MapView.tsx for better control.
    }
  }, [activeReservation, navigation.status, navigation.destination]);

  useEffect(() => {
    // If we are in PREVIEW/NAVIGATING but have no route, force a clear of the cache to trigger fetch
    if (navigation.destination && !navigation.routeGeometry && (navigation.status === "PREVIEW" || navigation.status === "NAVIGATING")) {
      lastDestination.current = null;
    }
  }, [navigation.destination, navigation.routeGeometry, navigation.status]);

  useEffect(() => {
    // If no destination, ensure route is cleared if we are in IDLE
    if (!navigation.destination) {
      if (navigation.routeGeometry) {
        actions.setRouteGeometry(null);
      }
      lastDestination.current = null;
      return;
    }

    // We need map and coords to fetch a route
    if (!map || !coords) return;

    const { lng, lat } = navigation.userCoords || coords;
    const dest = navigation.destination as { lng: number; lat: number };
    const destKey = `${dest.lng},${dest.lat}`;

    // Optimization: Only refetch if destination changed OR we don't have a route yet.
    // This ensures that even if we are in PREVIEW, we fetch the route as soon as a destination is set.
    if (lastDestination.current === destKey && navigation.routeGeometry) return;
    
    // If route is cleared manually (reroute), allow fetch
    if (!navigation.routeGeometry && (navigation.status === "PREVIEW" || navigation.status === "NAVIGATING")) {
      lastDestination.current = null;
    }

    // Only fetch if we have a destination and we are in PREVIEW or NAVIGATING
    const shouldFetch = (navigation.status === "PREVIEW" || navigation.status === "NAVIGATING") && navigation.destination;
    
    if (shouldFetch) {
      const updateRoute = async () => {
        if (!lng || !lat || !dest) return;

        try {
          console.log("RouteManager: Fetching...", { status: navigation.status });
          const response = await fetchOSRMRoute([lng, lat], [dest.lng, dest.lat]);
          
          if (response.code === "Ok" && response.routes.length > 0) {
            const route = response.routes[0];
            actions.setRouteGeometry(route.geometry as any);
            actions.updateNavigationMetrics(route.distance, route.duration);
            lastDestination.current = destKey;

            // Fit bounds ONLY in PREVIEW mode and ONLY if status hasn't changed since fetch started
            if (navigation.status === "PREVIEW") {
                console.log("RouteManager: Fitting bounds for PREVIEW");
                const bounds = new maplibregl.LngLatBounds();
                route.geometry.coordinates.forEach((coord: any) => bounds.extend(coord));
                
                // Dynamic padding based on UI visibility (carousel/search)
                const padding = activeReservation 
                  ? { top: 80, bottom: 80, left: 60, right: 60 }
                  : { top: 120, bottom: 260, left: 60, right: 60 };

                map.fitBounds(bounds, { 
                  padding, 
                  duration: 1000 
                });
            }
          }
        } catch (error) {
          console.error("RouteManager: Fetch failed", error);
        }
      };

      updateRoute();
    }
  }, [map, coords, navigation.destination, navigation.status, navigation.userCoords, navigation.routeGeometry, actions, activeReservation]);

  return null;
}

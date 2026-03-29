"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../MapContext";
import { getDistance, getDistanceToPolyline } from "@/lib/navigation-utils";

export function NavigationController() {
  const { coords, navigation, actions } = useMap();
  const lastRerouteTime = useRef<number>(0);

  useEffect(() => {
    // Only active during NAVIGATING
    if (navigation.status !== "NAVIGATING" || !navigation.userCoords || !navigation.destination || !navigation.routeGeometry) return;

    const user = navigation.userCoords;
    const dest = navigation.destination as { lng: number; lat: number };
    const route = navigation.routeGeometry.coordinates as [number, number][];

    // 1. Arrival Detection (<20m from destination)
    const distToDest = getDistance(user.lat, user.lng, dest.lat, dest.lng);
    if (distToDest < 20) {
      actions.setNavigationStatus("ARRIVED");
      return;
    }

    // 2. Deviation Detection (>40m from route)
    // Throttle reroute checks to every 3 seconds to avoid OSRM spam
    const now = Date.now();
    if (now - lastRerouteTime.current > 3000) {
      const { distance: distToRoute } = getDistanceToPolyline([user.lng, user.lat], route);
      
      if (distToRoute > 40) {
        console.warn("User deviated! Triggering reroute...");
        // Setting routeGeometry to null triggers the RouteManager refetch
        actions.setRouteGeometry(null);
        lastRerouteTime.current = now;
      }
    }
  }, [navigation.status, navigation.userCoords, navigation.destination, navigation.routeGeometry, actions]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useMap } from "../MapContext";
import { getDistanceToPolyline, calculateTotalDistance } from "@/lib/navigation-utils";

export function useRouteProgress() {
  const { navigation, actions } = useMap();

  useEffect(() => {
    if (navigation.status !== "NAVIGATING" || !navigation.userCoords || !navigation.routeGeometry) return;

    const user = navigation.userCoords;
    const route = navigation.routeGeometry.coordinates as [number, number][];

    // 1. Find closest point index on route
    const { index } = getDistanceToPolyline([user.lng, user.lat], route);

    // 2. Calculate remaining distance
    const remainingRoute = route.slice(index);
    const distance = calculateTotalDistance(remainingRoute);

    // 3. Estimate remaining duration
    // Simple linear interpolation based on initial total distance/duration
    // If we have totalDistance and totalDuration from OSRM, we can estimate speed.
    // For now, we'll just use a rough estimate (e.g. 5m/s or 18km/h which is typical for city driving in Addis)
    // Or we can try to derive speed from the initial OSRM route if we stored total values.
    
    // Let's assume a default speed of 8m/s (~30km/h) for urban driving.
    const duration = distance / 8;

    actions.updateNavigationMetrics(distance, duration);

  }, [navigation.status, navigation.userCoords, navigation.routeGeometry, actions]);

  return null;
}

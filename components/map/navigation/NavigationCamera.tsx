"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../MapContext";
import { useBearingSmoothing } from "../hooks/useBearingSmoothing";

export function NavigationCamera() {
  const { map, navigation } = useMap();
  const { smoothedBearing, updateBearing } = useBearingSmoothing();
  const lastUpdate = useRef<number>(0);

  // Sync bearing to smoothing hook
  useEffect(() => {
    if (navigation.status === "NAVIGATING") {
      updateBearing(navigation.bearing);
    }
  }, [navigation.bearing, navigation.status, updateBearing]);

  // Main camera follow effect
  useEffect(() => {
    if (!map || navigation.status !== "NAVIGATING" || !navigation.userCoords) {
        // Reset camera pitch/bearing when stopping navigation
        if (navigation.status === "IDLE" && map) {
            // Only reset if we were navigating (check pitch)
            if (map.getPitch() > 0) {
                map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
            }
        }
        return;
    }

    const now = Date.now();
    // Throttle camera updates to ~700ms for smoothness and performance
    if (now - lastUpdate.current < 700) return;

    const { lng, lat } = navigation.userCoords;

    map.easeTo({
      center: [lng, lat],
      pitch: 70, // Deep 3D perspective
      zoom: 18.5, // Closer to the action
      bearing: smoothedBearing,
      duration: 1200, // Slightly longer for maximum smoothness
      padding: { bottom: 200 }, // Shift user to the bottom of the screen
      easing: (t) => t, 
    });

    lastUpdate.current = now;
  }, [map, navigation.status, navigation.userCoords, smoothedBearing]);

  return null;
}

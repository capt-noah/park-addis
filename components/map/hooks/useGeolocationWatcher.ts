import { useEffect, useRef } from "react";
import { useMap } from "../MapContext";
import { getDistance, calculateBearing } from "@/lib/navigation-utils";

export function useGeolocationWatcher() {
  const { navigation, actions } = useMap();
  const lastCoords = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigation.status !== "NAVIGATING") return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lng, accuracy } = position.coords;

        if (lastCoords.current) {
          const distance = getDistance(
            lastCoords.current.lat,
            lastCoords.current.lng,
            lat,
            lng
          );

          // Ignore movement < 5m to reduce jitter
          if (distance < 5) return;

          // Calculate bearing
          const bearing = calculateBearing(
            lastCoords.current.lat,
            lastCoords.current.lng,
            lat,
            lng
          );
          actions.setBearing(bearing);
        }

        lastCoords.current = { lat, lng };
        actions.setUserCoords({ lat, lng, accuracy });
      },
      (error) => {
        console.error("GeolocationWatcher error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [navigation.status, actions]);

  return null;
}

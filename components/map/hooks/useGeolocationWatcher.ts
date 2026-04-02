import { useEffect, useRef } from "react";
import { useMap } from "../MapContext";
import { getDistance, calculateBearing } from "@/lib/navigation-utils";

export function useGeolocationWatcher() {
  const { navigation, actions } = useMap();
  const lastCoords = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigation.status !== "NAVIGATING") return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading is iOS specific, alpha is for Android (absolute)
      const heading = (event as any).webkitCompassHeading || (360 - (event.alpha || 0));
      
      if (heading !== undefined && heading !== null) {
        // If speed is very low or unavailable, use compass for bearing
        // Note: speed is usually in m/s. 1 m/s ~= 3.6 km/h.
        // We'll trust compass more when stationary.
        actions.setBearing(heading);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lng, accuracy, speed } = position.coords;

        if (lastCoords.current) {
          const distance = getDistance(
            lastCoords.current.lat,
            lastCoords.current.lng,
            lat,
            lng
          );

          // If moving fast enough, use GPS bearing for more stability
          if (distance > 2 && speed && speed > 1.5) {
            const gpsBearing = calculateBearing(
              lastCoords.current.lat,
              lastCoords.current.lng,
              lat,
              lng
            );
            actions.setBearing(gpsBearing);
          }
        }

        lastCoords.current = { lat, lng };
        actions.setUserCoords({ lat, lng, accuracy });
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    // Listen for orientation if available
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation", handleOrientation as any);
    }

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientationabsolute", handleOrientation as any);
      window.removeEventListener("deviceorientation", handleOrientation as any);
    };
  }, [navigation.status, actions]);

  return null;
}

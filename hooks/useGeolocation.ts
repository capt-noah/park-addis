"use client";

import { useState, useEffect, useRef } from "react";

interface GeolocationState {
  coords: [number, number] | null;
  isLocating: boolean;
  error: string | null;
  accuracy: 'high' | 'low' | null;
}

export function useGeolocation(options = { timeout: 15000, highAccuracyTimeout: 8000 }) {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    isLocating: true,
    error: null,
    accuracy: null,
  });

  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setState(s => ({ ...s, isLocating: false, error: "Not supported" }));
      return;
    }

    const startWatching = (highAccuracy: boolean) => {
      // Clear any existing watcher before starting a new one
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }

      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          setState({
            coords: [position.coords.latitude, position.coords.longitude],
            isLocating: false,
            error: null,
            accuracy: highAccuracy ? 'high' : 'low',
          });
        },
        (error) => {
          // If high accuracy fails (often happens with kCLErrorLocationUnknown), 
          // try falling back to low accuracy which is more reliable.
          if (highAccuracy) {
            console.warn("High accuracy geolocation failed, retrying with low accuracy...", error.message);
            startWatching(false);
          } else {
            setState(s => ({ 
              ...s, 
              isLocating: false, 
              error: error.message 
            }));
          }
        },
        { 
          enableHighAccuracy: highAccuracy, 
          // Give it a bit more time for the initial fix
          timeout: options.highAccuracyTimeout,
          maximumAge: 0 
        }
      );
    };

    startWatching(true);

    // Safety timeout to prevent indefinite "Locating..." state
    const globalTimeoutId = setTimeout(() => {
      setState(s => {
        if (s.isLocating) {
          return { ...s, isLocating: false, error: "Timeout reached" };
        }
        return s;
      });
    }, options.timeout);

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      clearTimeout(globalTimeoutId);
    };
  }, [options.timeout, options.highAccuracyTimeout]);

  return state;
}

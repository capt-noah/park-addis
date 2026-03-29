"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import maplibregl from "maplibre-gl";

import { ADDIS_ABABA_CENTER } from "@/lib/location";

interface Coords {
  lng: number;
  lat: number;
  accuracy?: number;
}

interface MapContextType {
  map: maplibregl.Map | null;
  setMap: (map: maplibregl.Map | null) => void;
  coords: Coords | null;
  locateUser: () => void;
  isLoading: boolean;
}

export const MapContext = createContext<MapContextType>({
  map: null,
  setMap: () => {},
  coords: null,
  locateUser: () => {},
  isLoading: true,
});

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const locateUser = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
          accuracy: position.coords.accuracy,
        });
        setIsLoading(false);
      },
      (err) => {
        // console.error("Geolocation error:", err.message);
        setCoords({
          lng: ADDIS_ABABA_CENTER.lng,
          lat: ADDIS_ABABA_CENTER.lat,
          accuracy: 10
        })
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    locateUser();
  }, [locateUser]);

  const contextValue = useMemo(() => ({
    map,
    setMap,
    coords,
    locateUser,
    isLoading,
  }), [map, coords, locateUser, isLoading]);

  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
}

export const useMap = () => useContext(MapContext);
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import maplibregl from "maplibre-gl";

import { ADDIS_ABABA_CENTER } from "@/lib/location";
import { NavigationState, NavigationActions, NavigationStatus } from "./navigation/NavigationTypes";
import { useNavigationState } from "./hooks/useNavigationState";

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
  
  // Navigation
  navigation: NavigationState;
  actions: NavigationActions;
}

export const MapContext = createContext<MapContextType | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    navigation,
    setNavigationStatus,
    setDestination,
    setRouteGeometry,
    updateNavigationMetrics,
    setBearing,
    setUserCoords,
    setWatchId,
    startNavigation,
    stopNavigation,
  } = useNavigationState();

  const locateUser = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lng: position.coords.longitude,
          lat: position.coords.latitude,
          accuracy: position.coords.accuracy,
        };
        setCoords(newCoords);
        setUserCoords(newCoords);
        setIsLoading(false);
      },
      (err) => {
        const defaultCoords = {
          lng: ADDIS_ABABA_CENTER.lng,
          lat: ADDIS_ABABA_CENTER.lat,
          accuracy: 10
        };
        setCoords(defaultCoords);
        setUserCoords(defaultCoords);
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, [setUserCoords]);

  useEffect(() => {
    locateUser();
  }, [locateUser]);

  const actions = useMemo(() => ({
    setNavigationStatus,
    setDestination,
    setRouteGeometry,
    updateNavigationMetrics,
    setBearing,
    setUserCoords,
    startNavigation,
    stopNavigation,
  }), [
    setNavigationStatus,
    setDestination,
    setRouteGeometry,
    updateNavigationMetrics,
    setBearing,
    setUserCoords,
    startNavigation,
    stopNavigation,
  ]);

  const contextValue = useMemo(() => ({
    map,
    setMap,
    coords,
    locateUser,
    isLoading,
    navigation,
    actions,
  }), [map, coords, locateUser, isLoading, navigation, actions]);

  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
}

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
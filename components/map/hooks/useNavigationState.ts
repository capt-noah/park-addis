"use client";

import { NavigationStatus, NavigationState } from "../navigation/NavigationTypes";
import { useState, useCallback } from "react";
import { LngLatLike } from "maplibre-gl";

export function useNavigationState() {
  const [navigation, setNavigation] = useState<NavigationState>({
    status: "IDLE",
    destination: null,
    routeGeometry: null,
    remainingDistance: null,
    remainingDuration: null,
    bearing: 0,
    watchId: null,
    userCoords: null,
  });

  const setNavigationStatus = useCallback((status: NavigationStatus) => {
    setNavigation((prev) => ({ ...prev, status }));
  }, []);

  const setDestination = useCallback((destination: LngLatLike | null) => {
    setNavigation((prev) => ({ ...prev, destination }));
  }, []);

  const setRouteGeometry = useCallback((routeGeometry: GeoJSON.LineString | null) => {
    setNavigation((prev) => ({ ...prev, routeGeometry }));
  }, []);

  const updateNavigationMetrics = useCallback((distance: number, duration: number) => {
    setNavigation((prev) => ({
      ...prev,
      remainingDistance: distance,
      remainingDuration: duration,
    }));
  }, []);

  const setBearing = useCallback((bearing: number) => {
    setNavigation((prev) => ({ ...prev, bearing }));
  }, []);

  const setUserCoords = useCallback((coords: { lng: number; lat: number; accuracy?: number } | null) => {
    setNavigation((prev) => ({ ...prev, userCoords: coords }));
  }, []);

  const setWatchId = useCallback((id: number | null) => {
    setNavigation((prev) => ({ ...prev, watchId: id }));
  }, []);

  const previewDestination = useCallback((dest: LngLatLike) => {
    setNavigation((prev) => ({
      ...prev,
      status: "PREVIEW",
      destination: dest,
      routeGeometry: null, // Clear old route
    }));
  }, []);

  const clearNavigation = useCallback(() => {
    setNavigation((prev) => {
      if (prev.watchId !== null) {
        navigator.geolocation.clearWatch(prev.watchId);
      }
      return {
        ...prev,
        status: "IDLE",
        destination: null,
        routeGeometry: null,
        remainingDistance: null,
        remainingDuration: null,
        watchId: null,
      };
    });
  }, []);

  const startNavigation = useCallback(() => {
    setNavigation((prev) => ({ ...prev, status: "NAVIGATING" }));
  }, []);

  const stopNavigation = clearNavigation;

  return {
    navigation,
    setNavigationStatus,
    setDestination,
    setRouteGeometry,
    updateNavigationMetrics,
    setBearing,
    setUserCoords,
    setWatchId,
    previewDestination,
    clearNavigation,
    startNavigation,
    stopNavigation,
  };
}

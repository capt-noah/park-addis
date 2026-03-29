"use client";

import { LngLatLike } from "maplibre-gl";

export type NavigationStatus = "IDLE" | "PREVIEW" | "NAVIGATING" | "ARRIVED";

export interface NavigationState {
  status: NavigationStatus;
  destination: LngLatLike | null;
  routeGeometry: GeoJSON.LineString | null;
  remainingDistance: number | null; // in meters
  remainingDuration: number | null; // in seconds
  bearing: number;
  watchId: number | null;
  userCoords: { lng: number; lat: number; accuracy?: number } | null;
}

export interface NavigationActions {
  setNavigationStatus: (status: NavigationStatus) => void;
  setDestination: (coords: LngLatLike | null) => void;
  setRouteGeometry: (geometry: GeoJSON.LineString | null) => void;
  updateNavigationMetrics: (distance: number, duration: number) => void;
  setBearing: (bearing: number) => void;
  setUserCoords: (coords: { lng: number; lat: number; accuracy?: number } | null) => void;
  previewDestination: (dest: LngLatLike) => void;
  clearNavigation: () => void;
  startNavigation: () => void;
  stopNavigation: () => void;
}

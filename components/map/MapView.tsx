"use client"

import { useEffect } from "react"
import ParkingLayer from "./layers/ParkingLayer"
import UserLayer from "./layers/UserLayer"
import RouteLayer from "./layers/RouteLayer"
import { MapControls } from "./controls/MapControls"
import MapRoot from "./MapRoot"
import { useMap } from "./MapContext"
import { RouteManager } from "./navigation/RouteManager"
import { ActiveReservationCard } from "./ui/ActiveReservationCard"
import { NavigationController } from "./navigation/NavigationController"
import { useGeolocationWatcher } from "./hooks/useGeolocationWatcher"
import { NavigationCamera } from "./navigation/NavigationCamera"
import { useRouteProgress } from "./hooks/useRouteProgress"

interface MapViewProps {
  displayedLocations: any[]
  onLocationClick: (id: string | null) => void
  selectedLocation: any
}

function MapView({ displayedLocations, onLocationClick, selectedLocation }: MapViewProps) {
  const { actions, navigation } = useMap();
  
  // High-frequency GPS and state watchers
  useGeolocationWatcher();
  useRouteProgress();

  useEffect(() => {
    if (selectedLocation) {
      actions.setDestination({
        lng: selectedLocation.geometry.coordinates[0],
        lat: selectedLocation.geometry.coordinates[1]
      });
      actions.setNavigationStatus("PREVIEW");
    } else if (navigation.status === "PREVIEW") {
      actions.setNavigationStatus("IDLE");
      actions.setDestination(null);
    }
  }, [selectedLocation, actions]);

  return (
    <MapRoot>
        <MapControls />
        <UserLayer />
        <ParkingLayer 
          locations={displayedLocations} 
          onLocationClick={onLocationClick}
        />
        <RouteLayer />
        <RouteManager />
        <NavigationController />
        <NavigationCamera />
        
        {/* Navigation UI Overlay */}
        {navigation.destination && navigation.status !== "IDLE" && (
          <div className="absolute top-24 left-6 z-[600] pointer-events-auto">
            <ActiveReservationCard 
              title={selectedLocation?.properties?.p_name || selectedLocation?.properties?.name || "Parking Location"}
              address={selectedLocation?.properties?.p_address || selectedLocation?.properties?.address || "Addis Ababa, Ethiopia"}
              status="ACTIVE"
              distance={navigation.remainingDistance}
              duration={navigation.remainingDuration}
              onDirectionsClick={() => actions.startNavigation()}
            />
          </div>
        )}
    </MapRoot>
  )
}

export default MapView
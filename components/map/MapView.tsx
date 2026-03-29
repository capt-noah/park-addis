"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
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
import { useSession } from "../session/AppSessionProvider"

interface MapViewProps {
  displayedLocations: any[]
  onLocationClick: (id: string | null) => void
  selectedLocation: any
}

function MapView({ displayedLocations, onLocationClick, selectedLocation }: MapViewProps) {
  const { actions, navigation } = useMap();
  const { activeReservation } = useSession();
  
  // High-frequency GPS and state watchers
  useGeolocationWatcher();
  useRouteProgress();

  useEffect(() => {
    if (selectedLocation) {
      actions.previewDestination({
        lng: selectedLocation.geometry.coordinates[0],
        lat: selectedLocation.geometry.coordinates[1]
      });
    } else {
      actions.clearNavigation();
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
        
        {/* Navigation UI Overlay - Only show during active navigation or arriving */}
        {navigation.destination && (navigation.status === "NAVIGATING" || navigation.status === "ARRIVED") && (
          <div className="absolute top-6 left-6 z-[600] flex flex-col gap-3 pointer-events-auto">
            <ActiveReservationCard 
              title={selectedLocation?.properties?.name || activeReservation?.locationName || "Parking Location"}
              address={selectedLocation?.properties?.address || activeReservation?.locationAddress || "Addis Ababa, Ethiopia"}
              status="ACTIVE"
              distance={navigation.remainingDistance}
              duration={navigation.remainingDuration}
              onDirectionsClick={() => actions.startNavigation()}
            />
            
            {/* Dedicated Close Navigation Button */}
            <button
              onClick={() => {
                actions.clearNavigation();
              }}
              className="group flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-xl border border-slate-200 hover:bg-white transition-all active:scale-95 w-fit"
            >
              <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-red-50 transition-colors">
                <X className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-500" />
              </div>
              <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Close Navigation</span>
            </button>
          </div>
        )}
    </MapRoot>
  )
}

export default MapView
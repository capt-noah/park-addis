"use client"

import ParkingLayer from "./layers/ParkingLayer"
import UserLayer from "./layers/UserLayer"
import RouteLayer from "./layers/RouteLayer"
import { MapControls } from "./controls/MapControls"
import MapRoot from "./MapRoot"

function MapView({ displayedLocations, onLocationClick, selectedLocation }: any) {
  
  return (
    <MapRoot>
        <MapControls />
        <UserLayer />
        <ParkingLayer 
          locations={displayedLocations} 
          onLocationClick={onLocationClick}
        />
        <RouteLayer destination={selectedLocation?.geometry?.coordinates ?? null} />
    </MapRoot>
  )
}

export default MapView
"use client"

import ParkingLayer from "./layers/ParkingLayer"
import UserLayer from "./layers/UserLayer"
import { MapControls } from "./controls/MapControls"
import MapRoot from "./MapRoot"

function MapView({ displayedLocations, onLocationClick }: any) {
  
  return (
    <MapRoot>
        <MapControls />
        <UserLayer />
        <ParkingLayer 
          locations={displayedLocations} 
          onLocationClick={onLocationClick}
        />
    </MapRoot>
  )
}

export default MapView
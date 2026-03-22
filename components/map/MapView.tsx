"use client"

import UserLayer from "./layers/UserLayer"
import { MapControls } from "./MapControls"
import MapRoot from "./MapRoot"

function MapView() {

  return (
    <MapRoot>
        <MapControls />
        <UserLayer />
    </MapRoot>
  )
}

export default MapView
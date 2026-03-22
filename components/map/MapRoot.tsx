"use client"

import { useRef, useEffect, useState } from "react"
import { MapContext } from "./MapContext"
import maplibregl from "maplibre-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import useGeolocation from "./hooks/useGeolocation"

interface MapRootProps {
    children?: React.ReactNode,
    center?: [number, number],
    zoom?: number
}

function MapRoot({ children, center = [38.7525, 9.0190], zoom = 13 }: MapRootProps){

    const mapContainer = useRef<HTMLDivElement | null>(null)
    const [map, setMap] = useState<maplibregl.Map | null>(null)
    const { coords, locateUser } = useGeolocation(map)

    useEffect(() => {
        if (map || !mapContainer.current) return
        
        const newMap = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", 
            center,
            zoom
        })

        setMap(newMap)

        return (() => {
            newMap.remove()
            setMap(null)
        })
    }, [])

  return (
      <div className="w-full h-full relative">
        <div ref={mapContainer} className="w-full h-full" />
        <MapContext.Provider value={{ map, coords, locateUser }}>
            {children}
        </MapContext.Provider>
      </div>
  )
}

export default MapRoot










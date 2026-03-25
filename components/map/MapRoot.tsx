"use client"

import { useRef, useEffect } from "react"
import { useMap } from "./MapContext"
import maplibregl from "maplibre-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import { DEFAULT_LAT, DEFAULT_LNG } from "@/src/constants/location";

interface MapRootProps {
    children?: React.ReactNode,
    center?: [number, number],
    zoom?: number
}

const DEFAULT_CENTER: [number, number] = [DEFAULT_LNG, DEFAULT_LAT];

function MapRoot({ 
    children, 
    center = DEFAULT_CENTER, 
    zoom = 13 
}: MapRootProps){

    const mapContainer = useRef<HTMLDivElement | null>(null)
    const { map, setMap } = useMap()

    useEffect(() => {
        if (map || !mapContainer.current) return
        
        const newMap = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", 
            center,
            zoom
        })

        newMap.once('load', () => {
            setMap(newMap)
        })

        return (() => {
            newMap.remove()
            setMap(null)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapContainer.current])

  return (
      <div className="w-full h-full relative">
        <div ref={mapContainer} className="w-full h-full" />
        {children}
      </div>
  )
}

export default MapRoot










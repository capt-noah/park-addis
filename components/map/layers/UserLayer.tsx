"use client"

import { useEffect } from "react"
import maplibregl from "maplibre-gl"
import { useMap } from "../MapContext"

import { useRef } from "react"

export default function UserLayer() {
    const { map, coords } = useMap()
    const hasAutoZoomed = useRef(false)
    
    useEffect(() => {
        if (!map || !coords || hasAutoZoomed.current) return
        
        hasAutoZoomed.current = true
        
        const performFlyTo = () => {
            map.flyTo({
                center: [coords.lng, coords.lat],
                zoom: 15,
                essential: true,
                duration: 2000
            })
        }

        if (map.loaded()) {
            performFlyTo()
        } else {
            map.once('load', performFlyTo)
        }
    }, [map, coords])

    return null
}

"use client"

import { useEffect, useRef } from "react"
import { useMap } from "../MapContext"

import maplibregl from "maplibre-gl"

export default function UserLayer() {
    const { map, coords } = useMap()
    const markerRef = useRef<maplibregl.Marker | null>(null)
    const hasAutoZoomed = useRef(false)
    
    // Auto-zoom to user location once when first acquired
    useEffect(() => {
        if (!map || !coords || hasAutoZoomed.current) return
        
        map.flyTo({
            center: [coords.lng, coords.lat],
            zoom: 15,
            essential: true,
            duration: 1500
        })
        
        hasAutoZoomed.current = true
    }, [map, coords])

    useEffect(() => {
        if (!map || !coords) return
        
        const updateMarker = () => {
            if (!markerRef.current) {
                const el = document.createElement('div')
                el.className = 'user-location-custom'
                markerRef.current = new maplibregl.Marker({ element: el })
                    .setLngLat([coords.lng, coords.lat])
                    .addTo(map)
            } else {
                markerRef.current.setLngLat([coords.lng, coords.lat])
            }
        }

        updateMarker()

    }, [map, coords])


    useEffect(() => {
        return () => {
            markerRef.current?.remove()
            markerRef.current = null
        }
    }, [])

    return null
}

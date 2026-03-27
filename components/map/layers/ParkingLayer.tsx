"use client"

import { useEffect, useRef } from "react"
import { useMap } from "../MapContext"
import maplibregl from "maplibre-gl"

export default function ParkingLayer({ locations, onLocationClick }: any) {
    const { map } = useMap()
    const markersRef = useRef<maplibregl.Marker[]>([])
    const onLocationClickRef = useRef(onLocationClick)

    useEffect(() => {
        onLocationClickRef.current = onLocationClick
    }, [onLocationClick])

    useEffect(() => {
        if (!map) return

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []

        const rawFeatures = Array.isArray(locations) ? locations : (locations?.features || [])
        
        console.log("ParkingLayer (Markers): Rendering", rawFeatures.length, "markers")

        rawFeatures.forEach((feature: any) => {
            const coords = feature.geometry.coordinates as [number, number]
            const id = feature.properties.id

            // Create HTML element for the marker
            const el = document.createElement('div')
            el.className = 'parking-pin'
            
            const span = document.createElement('span')
            span.className = 'pin-logo-text'
            span.innerText = 'P'
            el.appendChild(span)

            // Click handler
            el.addEventListener('click', (e) => {
                e.stopPropagation() // Prevent map click
                if (onLocationClickRef.current) {
                    onLocationClickRef.current(id)
                }
            })

            // Add marker to map
            try {
                const marker = new maplibregl.Marker({ 
                    element: el, 
                    anchor: 'bottom',
                    offset: [0, -16] // Shift up so the terminal green dot (16px below bubble) is at the coordinates
                })
                .setLngLat(coords)
                .addTo(map)

                markersRef.current.push(marker)
            } catch (err) {
                console.error("Error adding marker for location", id, err)
            }
        })

        return () => {
            markersRef.current.forEach(marker => marker.remove())
            markersRef.current = []
        }
    }, [map, locations])

    return null
}
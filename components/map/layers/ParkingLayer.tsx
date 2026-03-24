"use client"

import { useEffect, useRef } from "react"
import { useMap } from "../MapContext"
import maplibregl from "maplibre-gl"

export default function ParkingLayer({ locations, onLocationClick }: any) {
    const { map } = useMap()
    const markersRef = useRef<maplibregl.Marker[]>([])
    
    useEffect(() => {
        if (!map) return

        // Clear existing markers to prevent duplication
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []

        if (!locations) return

        const updateMarkers = () => {
            const features = Array.isArray(locations) ? locations : (locations.features || [])
            if (!Array.isArray(features)) return

            features.forEach((feature: any) => {
                const coordinates = feature.geometry.coordinates
                const id = feature.properties.id

                // Create custom element for the pill marker
                const el = document.createElement('div')
                el.className = 'parking-pin'
                
                // Add click handler
                el.onclick = () => {
                    if (onLocationClick) onLocationClick(id)
                }
                
                const logoText = document.createElement('span')
                logoText.className = 'pin-logo-text'
                logoText.innerText = 'P'
                
                el.appendChild(logoText)

                // Create and add the marker to the map
                const marker = new maplibregl.Marker({
                    element: el,
                    anchor: 'bottom',
                    offset: [0, -5]
                })
                .setLngLat(coordinates as [number, number])
                .addTo(map)

                markersRef.current.push(marker)
            })
        }

        updateMarkers()

        return (() => {
            markersRef.current.forEach(marker => marker.remove())
            markersRef.current = []
        })
    }, [map, locations, onLocationClick])
    
    return null
}
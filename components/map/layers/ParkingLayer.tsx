"use client"

import { useEffect, useRef } from "react"
import { useMap } from "../MapContext"
import { useSession } from "../../session/AppSessionProvider"
import maplibregl from "maplibre-gl"

export default function ParkingLayer({ locations, onLocationClick }: any) {
    const { map, navigation } = useMap()
    const { activeReservation, isLoading: sessionLoading } = useSession()
    const markersRef = useRef<maplibregl.Marker[]>([])
    const onLocationClickRef = useRef(onLocationClick)

    useEffect(() => {
        onLocationClickRef.current = onLocationClick
    }, [onLocationClick])

    useEffect(() => {
        if (!map || sessionLoading) return

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []

        let rawFeatures = Array.isArray(locations) ? locations : (locations?.features || [])

        // Hiding/Filtering logic: Hide other pins if reservation exists or navigating
        if (activeReservation || navigation.status === "NAVIGATING" || navigation.status === "ARRIVED") {
            rawFeatures = rawFeatures.filter((f: any) => {
                const name = f.properties.name || f.properties.p_name;
                // If we have an active reservation, only show that one
                if (activeReservation) return name === activeReservation.locationName;
                // If navigating (without active reservation context), only show the one matching our current destination coords
                if (navigation.destination && navigation.status === "NAVIGATING") {
                    const dest = navigation.destination as { lng: number, lat: number };
                    return Math.abs(f.geometry.coordinates[0] - dest.lng) < 0.00001 && 
                           Math.abs(f.geometry.coordinates[1] - dest.lat) < 0.00001;
                }
                return false;
            });
        }

        console.log("ParkingLayer: Rendering", rawFeatures.length, "markers");

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
                e.stopPropagation()
                if (onLocationClickRef.current) {
                    onLocationClickRef.current(id)
                }
            })

            try {
                const marker = new maplibregl.Marker({ 
                    element: el, 
                    anchor: 'bottom',
                    offset: [0, -16]
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
    }, [map, locations, activeReservation, navigation.status, navigation.destination, sessionLoading])

    return null
}
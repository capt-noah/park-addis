"use client"

import { useEffect, useRef } from "react"
import { useMap } from "../MapContext"
import maplibregl from "maplibre-gl"

const PIN_SVG = `
<svg width="80" height="108" viewBox="0 0 80 108" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M40 104 L28 72 C12 68 0 52 0 40C0 18 18 0 40 0C62 0 80 18 80 40C80 52 68 68 52 72 L40 104 Z" fill="#064E3B" stroke="white" stroke-width="4" stroke-linejoin="round"/>
  <text x="40" y="55" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="900" font-size="44">P</text>
  <circle cx="40" cy="104" r="6" fill="#064E3B" stroke="white" stroke-width="3"/>
</svg>
`.trim();

export default function ParkingLayer({ locations, onLocationClick }: any) {
    const { map } = useMap()
    const onLocationClickRef = useRef(onLocationClick)
    const resourcesReady = useRef(false)

    useEffect(() => {
        onLocationClickRef.current = onLocationClick
    }, [onLocationClick])
    
    // Core setup effect
    useEffect(() => {
        if (!map) return

        const sourceId = 'parking-source'
        const layerId = 'parking-layer'
        const imageId = 'parking-icon'

        const updateData = () => {
            const source = map.getSource(sourceId) as maplibregl.GeoJSONSource
            if (source) {
                const rawFeatures = Array.isArray(locations) ? locations : (locations?.features || [])
                const features = rawFeatures.length > 0 ? rawFeatures : [
                    {
                        type: 'Feature' as const,
                        geometry: { type: 'Point' as const, coordinates: [38.7525, 9.0190] },
                        properties: { id: 'debug-pin' }
                    }
                ]
                source.setData({ type: 'FeatureCollection', features })
                console.log("ParkingLayer: Source data updated with", features.length, "features")
            }
        }

        const setupLayer = () => {
            if (!map.getSource(sourceId)) {
                map.addSource(sourceId, {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: [] }
                })
            }

            if (!map.getLayer(layerId)) {
                map.addLayer({
                    id: layerId,
                    type: 'symbol',
                    source: sourceId,
                    layout: {
                        'icon-image': imageId,
                        'icon-anchor': 'bottom',
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                        'icon-size': 0.5 // Scale down high-res SVG for maximum sharpness
                    }
                })

                map.on('click', layerId, (e) => {
                    const feature = e.features?.[0]
                    if (feature && onLocationClickRef.current) {
                        onLocationClickRef.current(feature.properties.id)
                    }
                })

                map.on('mouseenter', layerId, () => {
                    map.getCanvas().style.cursor = 'pointer'
                })
                map.on('mouseleave', layerId, () => {
                    map.getCanvas().style.cursor = ''
                })
            }
            resourcesReady.current = true
            updateData()
        }

        const addResources = () => {
            if (map.hasImage(imageId)) {
                setupLayer()
                return
            }

            const img = new Image()
            img.onload = () => {
                if (!map.hasImage(imageId)) {
                    map.addImage(imageId, img)
                }
                setupLayer()
            }
            img.onerror = (e) => console.error("ParkingLayer: SVG Load Error", e)
            img.src = 'data:image/svg+xml;base64,' + btoa(PIN_SVG)
        }

        const styleHandler = () => {
            resourcesReady.current = false
            addResources()
        }

        map.on('styledata', styleHandler)

        if (map.loaded()) {
            addResources()
        } else {
            map.once('load', addResources)
        }

        return () => {
            map.off('styledata', styleHandler)
            resourcesReady.current = false
        }
    }, [map]) // Map instance is the driver for setup

    // Reliable data sync effect
    useEffect(() => {
        if (!map || !resourcesReady.current) return
        
        const sourceId = 'parking-source'
        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource
        if (source) {
            const rawFeatures = Array.isArray(locations) ? locations : (locations?.features || [])
            const features = rawFeatures.length > 0 ? rawFeatures : [
                {
                    type: 'Feature' as const,
                    geometry: { type: 'Point' as const, coordinates: [38.7525, 9.0190] },
                    properties: { id: 'debug-pin' }
                }
            ]
            source.setData({ type: 'FeatureCollection', features })
            console.log("ParkingLayer: Dynamic data sync", features.length, "features")
        }
    }, [map, locations])
    
    return null
}
"use client"

import maplibregl from "maplibre-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState, useRef, useEffect } from "react"


export default function useGeolocation(map: maplibregl.Map | null) {
    const geolocationRef = useRef<maplibregl.GeolocateControl | null>(null)
    const [coords, setCoords] = useState<{ lng: number; lat: number; accuracy?: number } | null>(null)

    useEffect(() => {
        if (!map || geolocationRef.current) return
        
        const geolocate = new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserLocation: false
        })

        geolocationRef.current = geolocate
        map.addControl(geolocate)

        geolocate.on("geolocate", (e: any) => {
            const newCoords = {
                lng: e.coords.longitude, 
                lat: e.coords.latitude, 
                accuracy: e.coords.accuracy
            }
            setCoords(newCoords)
            
        })

        const triggerGeolocate = () => {
            geolocate.trigger()
        }

        if (map.loaded()) {
            triggerGeolocate()
        } else {
            map.once("load", triggerGeolocate)
        }

        return (() => {
            if (map.hasControl(geolocate)) {
                map.removeControl(geolocate)
            }
            geolocationRef.current = null
        })
    }, [map])

    const locateUser = () => {
        if (geolocationRef.current) {
            geolocationRef.current.trigger()
        }
    }

    return {coords, locateUser}
}
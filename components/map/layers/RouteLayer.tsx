"use client"

import { useEffect } from "react";
import { useMap } from "../MapContext";
import { getRoute, getRouteBoounds } from "@/src/services/routing.service";
import { LngLatLike } from "maplibre-gl";

export default function RouteLayer({ destination }: { destination: [number, number] | null }) {
    const { map, coords } = useMap();

    useEffect(() => {
        if (!map || !coords || !destination) return;

        async function drawRoute() {

            const geometry = await getRoute(coords, destination);
            
            const bounds = await getRouteBoounds(geometry.coordinates)

            const geojson: GeoJSON.Feature = {
                type: "Feature",
                geometry,
                properties: {},
            };

            if (!map) return;

            if (map.getSource("route")) {
                (map.getSource("route") as any).setData(geojson);
                return;
            }

            map.addSource("route", {
                type: "geojson",
                data: geojson,
            })
            
            map.addLayer({
                id: 'route-layer',
                type: 'line',
                source: 'route',
            layout: {
            "line-join": "round",
            "line-cap": "round",
            },
            paint: {
            "line-width": 3,
            "line-color": "#40c091",
                },    
            })

        
        map.fitBounds(bounds as [LngLatLike, LngLatLike], {
            padding: {top: 150, bottom: 250, left: 0, right: 0},
            duration: 1000,
            maxZoom: 15
        })
    }
      
        drawRoute()

      return (() => {
          if (!map || !map.loaded()) return
          
        if (map.getLayer("route-layer"))
        map.removeLayer("route-layer")

        if (map.getSource("route"))
        map.removeSource("route")
    
    })

  }, [map, coords, destination]);
    
    return null
}

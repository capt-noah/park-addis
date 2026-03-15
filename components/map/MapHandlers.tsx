"use client";

import { useEffect, useState } from "react";
import { useMap, useMapEvents, Polyline } from "react-leaflet";
import { ParkingLocation } from "@/types/location";
import L from "leaflet";

// Handler to fetch route, fit bounds, and draw polyline
export function RouteHandler({ locations, selectedLocationId, userPosition }: {
  locations: ParkingLocation[],
  selectedLocationId: string | null,
  userPosition: [number, number] | null
}) {
  const map = useMap();
  const [routePath, setRoutePath] = useState<[number, number][] | null>(null);

  useEffect(() => {
    if (!selectedLocationId) {
      setRoutePath(null);
      return;
    }

    const location = locations.find(loc => loc.id === selectedLocationId);
    if (!location) return;

    if (!userPosition) {
      // Just fly to location if no user position
      map.flyTo([location.lat, location.lng], 16, { duration: 1.5, easeLinearity: 0.25 });
      setRoutePath(null);
      return;
    }

    // Fetch route from OSRM
    const fetchRoute = async () => {
      try {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${userPosition[1]},${userPosition[0]};${location.lng},${location.lat}?overview=full&geometries=geojson`);
        const routeData = await response.json();
        
        if (routeData.routes && routeData.routes.length > 0) {
          // OSRM returns coordinates in [lng, lat], Leaflet wants [lat, lng]
          const coords = routeData.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
          setRoutePath(coords);

          // Zoom out to fit both user and destination with padding
          const bounds = L.latLngBounds([userPosition, [location.lat, location.lng]]);
          map.flyToBounds(bounds, { 
            paddingTopLeft: [50, 100], 
            paddingBottomRight: [50, 220], 
            duration: 1 
          });
        } else {
          map.flyTo([location.lat, location.lng], 16, { duration: 1.5 });
          setRoutePath(null);
        }
      } catch (error) {
        console.error("Failed to fetch route", error);
        map.flyTo([location.lat, location.lng], 16, { duration: 1.5 });
        setRoutePath(null);
      }
    };

    fetchRoute();
  }, [selectedLocationId, locations, userPosition, map]);

  return routePath ? (
    <Polyline 
      positions={routePath} 
      pathOptions={{ color: '#10b981', weight: 3, opacity: 0.8 }} 
    />
  ) : null;
}

// Robust Geolocation Handler using Leaflet native events
export function LocationHandler({ setUserPosition, initialCoords, defaultCenter }: { 
  setUserPosition: (pos: [number, number]) => void, 
  initialCoords: [number, number] | null,
  defaultCenter: [number, number]
}) {
  const [hasCentered, setHasCentered] = useState(
    !!initialCoords && (initialCoords[0] !== defaultCenter[0] || initialCoords[1] !== defaultCenter[1])
  );

  const map = useMapEvents({
    locationfound(e) {
      const pos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setUserPosition(pos);
      if (!hasCentered) {
        map.flyTo(e.latlng, 16);
        setHasCentered(true);
      }
    },
    locationerror(e) {
      if (e.message.includes("unavailable") || e.message.includes("unknown") || e.message.includes("timeout")) {
        return; 
      }
      map.stopLocate();
    }
  });

  useEffect(() => {
    map.locate({ 
      setView: false, 
      enableHighAccuracy: true, 
      watch: true 
    });
    
    return () => {
      map.stopLocate();
    };
  }, [map]);

  return null;
}

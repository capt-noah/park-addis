"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";
import { Navigation } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { ParkingLocation } from "@/types/location";
import { MapControls } from "./map/MapControls";
import { RouteHandler, LocationHandler } from "./map/MapHandlers";
import { createCustomIcon, userLocationIcon } from "./map/MapIcons";

interface MapComponentProps {
  locations: ParkingLocation[];
  zoom: number;
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
}

const DEFAULT_CENTER: [number, number] = [9.0190, 38.7525];

export default function MapComponent({ locations, zoom, selectedLocationId, setSelectedLocationId }: MapComponentProps) {
  const { theme } = useTheme();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  
  const { coords: initialCoords, isLocating } = useGeolocation();

  useEffect(() => {
    if (initialCoords && !userPosition) {
      setUserPosition(initialCoords);
    }
  }, [initialCoords, userPosition]);

  if (isLocating && !userPosition) {
    return (
      <div className="h-full w-full bg-background flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute -inset-8 bg-primary/20 rounded-full animate-ping"></div>
          <div className="relative w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
            <Navigation className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-black uppercase tracking-[0.3em] text-primary">ParkAddis</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest animate-shimmer">Initializing Navigation System...</span>
        </div>
      </div>
    );
  }

  // Use dark theme tiles if theme is dark
  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={initialCoords || DEFAULT_CENTER}
        zoom={initialCoords ? 16 : zoom}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />
        <LocationHandler setUserPosition={setUserPosition} initialCoords={initialCoords} defaultCenter={DEFAULT_CENTER} />
        <RouteHandler locations={locations} selectedLocationId={selectedLocationId} userPosition={userPosition} />
        <MapControls userPosition={userPosition} />
        
        {/* User Location Marker */}
        {userPosition && (
          <Marker position={userPosition} icon={userLocationIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]}
            icon={createCustomIcon(loc.price, selectedLocationId === loc.id)}
            eventHandlers={{
              click: () => {
                setSelectedLocationId(loc.id);
              },
            }}
          >
          </Marker>
        ))}
      </MapContainer>
      
      <style jsx global>{`
        .leaflet-container {
          background: ${theme === 'dark' ? '#111827' : '#f8fafc'} !important;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 1.5rem !important;
          padding: 0 !important;
          border: 1px solid var(--border);
          background: var(--card) !important;
          color: var(--card-foreground) !important;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5) !important;
          backdrop-filter: blur(12px);
        }
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: inherit !important;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: var(--card) !important;
          border: 1px solid var(--border);
        }
        
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }

        .user-location-icon {
          background: transparent !important;
          border: none !important;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

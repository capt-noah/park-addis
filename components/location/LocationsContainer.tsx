"use client";

import { useState, useEffect } from "react";
import Locations from "./Locations";
import { Search, SlidersHorizontal, Ticket } from "lucide-react";
import { Skeleton } from "@/components/Skeleton";
import { GeoJSONFeature, ParkingFeatures } from "@/types/geojson";
import MapView from "../map/MapView";
import { useMap } from "../map/MapContext";
import { ADDIS_ABABA_CENTER } from "@/lib/location";
import { useSession } from "../session/AppSessionProvider";
import Link from "next/link";

export default function LocationsContainer({
  locationsData,
}: {
  locationsData: GeoJSONFeature;
}) {
  const {
    selectedLocationId,
    setSelectedLocationId,
    activeReservation,
    userLocation: sessionLocation,
    setUserLocation: setSessionLocation,
  } = useSession();

  const [distanceFilter, setDistanceFilter] = useState<"All" | 200 | 400 | 600>(
    "All",
  );
  const { coords: mapLocation } = useMap();
  const [displayedLocations, setDisplayedLocations] = useState<
    ParkingFeatures[]
  >(locationsData?.features || []);
  const [isLoading, setIsLoading] = useState(false);

  const selectedLocation = displayedLocations.find((loc: ParkingFeatures) => loc.properties.id == selectedLocationId)

  // Sync map location to session
  useEffect(() => {
    if (mapLocation) {
      setSessionLocation(mapLocation);
    }
  }, [mapLocation, setSessionLocation]);

  const handleFilterClick = async (filter: "All" | 200 | 400 | 600) => {
    setDistanceFilter(filter);
    setIsLoading(true);

    const lat = sessionLocation?.lat || ADDIS_ABABA_CENTER.lat;
    const lng = sessionLocation?.lng || ADDIS_ABABA_CENTER.lng;

    try {
      const res = await fetch(
        `/api/locations?distance=${filter}&lat=${lat}&lng=${lng}`,
      );

      if (res.ok) {
        const data = await res.json();
        const features = data.locations?.features || data.locations || [];
        setDisplayedLocations(Array.isArray(features) ? features : []);
      }
    } catch (error) {
      console.error("Failed to fetch filtered locations", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-background">
      {/* Search Bar Overlay */}
      <div className="absolute top-6 left-6 right-6 z-[500] flex justify-center pointer-events-none">
        <div className="w-full max-w-lg flex items-center gap-3 bg-card/90 dark:bg-card/60 backdrop-blur-xl border border-border px-5 py-3 rounded-3xl shadow-xl pointer-events-auto transition-all duration-300 hover:border-primary/50 group">
          <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search location..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-muted-foreground/50"
          />
          <div className="w-px h-6 bg-border mx-2" />
          <button className="p-1 hover:bg-muted rounded-lg transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Active Session Notification (Phase C) */}
      {activeReservation && ( 
        <div className="absolute top-24 left-6 right-6 z-[500] pointer-events-none flex justify-center">
          <Link
            href="/reservations"
            className="pointer-events-auto flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-500 hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase opacity-80 leading-none mb-1">
                Active Session
              </p>
              <p className="text-sm font-black leading-none">
                {activeReservation.locationName}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <MapView
          displayedLocations={displayedLocations}
          onLocationClick={setSelectedLocationId}
          selectedLocation={selectedLocation}
        />
      </div>

      {/* Bottom Carousel Card Overlay + Filters */}
      <div className="absolute bottom-4 left-0 w-full z-[500] pointer-events-none flex flex-col items-start px-4 md:px-8">
        {/* Filter Pills - Bottom Left above cards */}
        <div className="w-full h-[40px]">
          <div className="flex gap-2 pointer-events-auto overflow-x-auto max-w-lg w-full no-scrollbar pb-3">
            {["All", 200, 400, 600].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter as any)}
                disabled={isLoading}
                className={`px-4 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all border shadow-sm ${
                  distanceFilter === filter
                    ? "bg-primary border-primary text-white"
                    : "bg-card/90 border-border/50 text-foreground hover:border-primary/50 hover:bg-card"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {filter === "All" ? "All" : `${filter}m`}
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-auto w-full h-[175px]">
          {isLoading ? (
            <div className="flex gap-4 overflow-hidden w-full pb-2">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="flex-shrink-0 w-[90vw] sm:w-[320px] md:w-[340px] h-[150px] bg-card/90 backdrop-blur-xl border border-border"
                  style={{ borderRadius: "1.5rem" }}
                />
              ))}
            </div>
          ) : (
            <Locations
              locationsData={displayedLocations}
              selectedLocationId={selectedLocationId}
              setSelectedLocationId={setSelectedLocationId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

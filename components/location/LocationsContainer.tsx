"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Locations from "./Locations";
import { Search, SlidersHorizontal, Ticket, Navigation, X } from "lucide-react";
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
  const { coords: mapLocation, navigation, actions } = useMap();
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

  const searchParams = useSearchParams();
  const selectedParam = searchParams.get("selected");

  // Handle 'selected' URL parameter
  useEffect(() => {
    if (selectedParam && displayedLocations.length > 0 && (navigation.status as string) === "IDLE") {
      const matchingLoc = displayedLocations.find(l => 
        l.properties.name === selectedParam
      );
      if (matchingLoc) {
        console.log("LocationsContainer: URL-triggered selection for", selectedParam);
        setSelectedLocationId(matchingLoc.properties.id);
        actions.previewDestination({
          lng: matchingLoc.geometry.coordinates[0],
          lat: matchingLoc.geometry.coordinates[1]
        });
      }
    }
  }, [selectedParam, displayedLocations, navigation.status, setSelectedLocationId, actions]);

  // Auto-trigger preview for active reservation once data is ready
  useEffect(() => {
    if (!isLoading && activeReservation && navigation.status === "IDLE" && displayedLocations.length > 0) {
      const matchingLoc = displayedLocations.find(l => 
        l.properties.name === activeReservation.locationName
      );
      if (matchingLoc) {
        console.log("LocationsContainer: Auto-triggering preview for", activeReservation.locationName);
        actions.previewDestination({
          lng: matchingLoc.geometry.coordinates[0],
          lat: matchingLoc.geometry.coordinates[1]
        });
      }
    }
  }, [isLoading, activeReservation, navigation.status, displayedLocations, actions]);

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

  // Show Search/Carousel only if no active reservation AND in IDLE/PREVIEW
  const showSearchAndCarousel = !activeReservation && (["IDLE", "PREVIEW"] as string[]).includes(navigation.status);

  return (
    <div className="h-full w-full relative overflow-hidden bg-background">
      {/* Search Bar Overlay */}
      {showSearchAndCarousel && (
        <div className="absolute top-6 left-0 right-0 z-[500] flex justify-center pointer-events-none px-6">
          <div className="w-full max-w-lg flex items-center gap-3 bg-card/90 dark:bg-card/60 backdrop-blur-xl border border-border px-5 py-3 rounded-3xl shadow-xl pointer-events-auto transition-all duration-300 hover:border-primary/50 group">
            <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <input
              type="text"
              placeholder={isLoading ? "Loading locations..." : "Search location..."}
              disabled={isLoading}
              className={`flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-muted-foreground/50 ${isLoading ? "opacity-50" : ""}`}
            />
            <div className="w-px h-6 bg-border mx-2" />
            <button className="p-1 hover:bg-muted rounded-lg transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      )}

      {/* Unified Top Left Control (Session & Navigation) */}
      <div className="absolute top-6 left-6 z-[600] flex flex-col items-start gap-2 pointer-events-auto">
        {/* Active Session Card */}
        {activeReservation && !isLoading && (["IDLE", "PREVIEW"] as string[]).includes(navigation.status) && ( 
          <div className="bg-primary text-white p-4 rounded-3xl shadow-2xl flex flex-col gap-3 min-w-[220px] animate-in slide-in-from-left duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-tight opacity-70 leading-none mb-0.5">Active Session</span>
                <span className="text-sm font-black leading-tight truncate max-w-[140px]">{activeReservation.locationName}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/reservations"
                className="flex-1 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold py-2.5 rounded-xl text-center transition-colors"
              >
                View
              </Link>
              <button
                onClick={() => {
                  if (navigation.status === "PREVIEW" && navigation.destination) {
                    actions.startNavigation();
                    return;
                  }

                  const matchingLoc = displayedLocations.find(l => 
                    l.properties.name === activeReservation.locationName
                  );
                  if (matchingLoc) {
                    actions.previewDestination({
                      lng: matchingLoc.geometry.coordinates[0],
                      lat: matchingLoc.geometry.coordinates[1]
                    });
                    setTimeout(() => actions.startNavigation(), 100);
                  }
                }}
                className="flex-1 bg-white text-primary text-[11px] font-bold py-2.5 rounded-xl text-center hover:bg-white/90 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3 h-3 fill-current" />
                Start
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <MapView
          displayedLocations={displayedLocations}
          onLocationClick={setSelectedLocationId}
          selectedLocation={selectedLocation}
        />
      </div>

      {/* Bottom Carousel */}
      {showSearchAndCarousel && (
        <div className="absolute bottom-4 left-0 right-0 z-[500] pointer-events-none flex flex-col items-start px-6 animate-in slide-in-from-bottom duration-500 overflow-hidden">
          {/* Filter Pills */}
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
      )}
    </div>
  );
}

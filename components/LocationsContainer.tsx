"use client";

import { useState } from "react";
import Locations from "./Locations";
import MapWrapper from "./MapWrapper";
import { Search, SlidersHorizontal } from "lucide-react";
import { ParkingLocation } from "@/types/location";

export default function LocationsContainer({ locationsData }: {  locationsData: ParkingLocation[] }) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  return (
    <div className="h-full w-full relative overflow-hidden bg-background">
      {/* Search Bar Overlay */}
      <div className="absolute top-6 left-6 right-6 z-[500] flex justify-center pointer-events-none">
        <div className="w-full max-w-lg flex items-center gap-3 bg-card/80 dark:bg-card/40 backdrop-blur-xl border border-border px-5 py-3.5 rounded-3xl shadow-2xl pointer-events-auto transition-all duration-300 hover:border-primary/50 group">
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

      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <MapWrapper 
          locations={locationsData}
          zoom={13}
          selectedLocationId={selectedLocationId}
          setSelectedLocationId={setSelectedLocationId}
        />
      </div>

      {/* Bottom Carousel Card Overlay */}
      <div className="absolute bottom-10 left-6 z-[500] pointer-events-none max-w-[calc(100vw-100px)] lg:max-w-4xl">
        <div className="pointer-events-auto">
          <Locations 
            locationsData={locationsData} 
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
          />
        </div>
      </div>
    </div>
  );
}

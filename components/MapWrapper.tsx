"use client";

import dynamic from "next/dynamic";
import { ParkingLocation } from "@/types/location";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center">
      <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Loading Map...</div>
    </div>
  ),
});

interface MapWrapperProps {
  locations: ParkingLocation[];
  zoom: number;
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <MapComponent {...props} />;
}

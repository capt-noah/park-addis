"use client";

import { Sidebar } from "@/components/Sidebar";
import { MapProvider } from "@/components/map/MapContext";
import LocationsContainer from "./LocationsContainer";
import { useSession } from "../session/AppSessionProvider";
import { GeoJSONFeature } from "@/types/geojson";

export default function LocationsLayout({ user, locations }: { user: any, locations: GeoJSONFeature }) {
  const { isSidebarCollapsed } = useSession();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar user={user} />
      <div className={`flex-1 relative h-screen overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-60"}`}>
        <MapProvider>
          <LocationsContainer locationsData={locations} />
        </MapProvider>
      </div>
    </div>
  );
}

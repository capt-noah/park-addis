"use client";

import { useMap } from "../MapContext";
import { Plus, Minus, Target } from "lucide-react";

export function MapControls() {
  const { map, coords, locateUser } = useMap();

  if (!map) {
    return null
  }

  const handleZoomIn = () => {
    if (!map) return

    map?.zoomIn({ duration: 500 });
  }

  const handleZoomOut = () => {
    if (!map) return
    
    map?.zoomOut({ duration: 500 })
  }

  const handleCenterUser = () => {
    if (!map) return
    
    if (coords) {
      // If we already have coords, just fly to them. 
      // This avoids re-triggering the control and prevents the marker from disappearing.
      map.flyTo({
        center: [coords.lng, coords.lat],
        zoom: 15,
        essential: true,
        duration: 1000
      })
    } else {
      // If no coords yet, trigger the geolocation flow
      locateUser()
    }
  }


  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[400] pointer-events-none">
       <button onClick={handleCenterUser}
        className="w-12 h-12 bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center justify-center border border-border hover:bg-muted transition-all pointer-events-auto hover:scale-105 active:scale-95 group"
      >
        <Target className={`w-6 h-6 ${coords ? 'text-primary' : 'text-muted-foreground'} group-hover:text-primary transition-colors`} />
      </button>

      <div className="bg-card/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-border overflow-hidden pointer-events-auto flex flex-col">
        <button 
          onClick={handleZoomIn}
          className="w-12 h-14 flex items-center justify-center hover:bg-muted transition-all border-b border-border group"
        >
          <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-12 h-14 flex items-center justify-center hover:bg-muted transition-all group"
        >
          <Minus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
}

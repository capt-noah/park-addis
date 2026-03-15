"use client";

import { useMap } from "react-leaflet";
import { Plus, Minus, Target } from "lucide-react";

export function MapControls({ userPosition }: { userPosition: [number, number] | null }) {
  const map = useMap();

  const handleZoomIn = () => map.setZoom(map.getZoom() + 1);
  const handleZoomOut = () => map.setZoom(map.getZoom() - 1);
  const handleRecenter = () => {
    if (userPosition) {
      map.flyTo(userPosition, 16);
    }
  };

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[400] pointer-events-none">
       <button 
        onClick={handleRecenter}
        className="w-12 h-12 bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center justify-center border border-border hover:bg-muted transition-all pointer-events-auto hover:scale-105 active:scale-95 group"
      >
        <Target className={`w-6 h-6 ${userPosition ? 'text-primary' : 'text-muted-foreground'} group-hover:text-primary transition-colors`} />
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

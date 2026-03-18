"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock } from "lucide-react";
import { useEffect, useRef } from "react";
import { ParkingLocation } from "@/types/location";

export default function Locations({ locationsData, selectedLocationId, setSelectedLocationId }: { 
  locationsData: ParkingLocation[], 
  selectedLocationId: string | null, 
  setSelectedLocationId: (id: string) => void 
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to selected location
  useEffect(() => {
    if (selectedLocationId && scrollRef.current) {
      const element = document.getElementById(`location-card-${selectedLocationId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedLocationId]);

  return (
    <div className="w-full">
      {locationsData.length === 0 ? (
        <div className="flex gap-4 overflow-hidden w-full pb-2">
          <div className="flex items-center justify-center w-[90vw] sm:w-[320px] md:w-[340px] h-[150px] bg-card/90 dark:bg-muted/40 backdrop-blur-md rounded-3xl border border-dashed border-border flex-col">
              <span className="text-sm font-bold text-muted-foreground">No locations found</span>
              <span className="text-[10px] text-muted-foreground/70">within the selected range</span>
          </div>
        </div>
      ) : (
      <>
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar snap-x"
        >
          {locationsData.map((loc) => (
            <div 
              id={`location-card-${loc.id}`}
              key={loc.id}
              onClick={() => setSelectedLocationId(loc.id)}
              className={`flex-shrink-0 w-[91vw] sm:w-[335px] md:w-[360px] snap-center cursor-pointer transition-transform duration-300 ${
                selectedLocationId === loc.id ? 'scale-100' : 'scale-95 hover:scale-[0.98]'
              }`}
            >
              <div className={`bg-card/90 dark:bg-card/70 backdrop-blur-xl border rounded-3xl p-3 flex gap-3 h-[150px] ${
                selectedLocationId === loc.id ? 'border-primary' : 'border-border/50'
              }`}>
                {/* Image Section */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-white p-1 border border-border flex-shrink-0 self-center">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image src={loc.image} alt={loc.name} fill className="object-cover" />
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0 pt-1 flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="text-base font-black text-foreground truncate">{loc.name}</h3>
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-[11px] font-bold text-foreground">{loc.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-[11px] font-medium text-muted-foreground truncate mb-1.5 leading-tight">{loc.address}</p>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
                      {loc.status === 'Available' ? 'OPEN' : 'FULL'}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{loc.eta} min</span>
                      </div>
                      <span className="text-muted-foreground/30">•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{Number(loc.distance || 0).toFixed(1)}km</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-1 px-1">
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-foreground leading-none">
                          {Number(loc.price || 0).toFixed(2)}<span className="text-[10px] text-muted-foreground font-bold ml-1">ETB/hr</span>
                        </span>
                    </div>
                    <Link 
                      href={`/locations/${loc.id}`} 
                      className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-xl text-[11px] font-black transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95 shrink-0"
                    >
                      RESERVE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-1.5 mt-2">
          {locationsData.map((loc) => (
            <div 
              key={loc.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedLocationId === loc.id ? 'w-6 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
      </>
      )}
    </div>
  );
}

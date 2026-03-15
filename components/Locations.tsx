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
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar snap-x px-2"
      >
        {locationsData.map((loc) => (
          <div 
            id={`location-card-${loc.id}`}
            key={loc.id}
            onClick={() => setSelectedLocationId(loc.id)}
            className={`flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[380px] snap-center cursor-pointer transition-transform duration-300 ${
              selectedLocationId === loc.id ? 'scale-100' : 'scale-95 hover:scale-[0.98]'
            }`}
          >
            <div className={`bg-card/80 dark:bg-card/60 backdrop-blur-xl border-2 rounded-[2rem] p-4 shadow-2xl flex gap-4 ${
              selectedLocationId === loc.id ? 'border-primary' : 'border-border/50'
            }`}>
              {/* Image Section */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-white p-1.5 border border-border shadow-inner flex-shrink-0">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image src={loc.image} alt={loc.name} fill className="object-cover" />
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex justify-between items-start mb-1">
                   <h3 className="text-sm md:text-base font-black text-foreground truncate pr-2">{loc.name}</h3>
                   <div className="flex items-center gap-1 shrink-0">
                     <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                     <span className="text-xs font-bold text-foreground">{loc.rating}</span>
                   </div>
                </div>
                
                <p className="text-[10px] md:text-[11px] font-medium text-muted-foreground truncate mb-3 leading-tight">{loc.address}</p>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-wider border border-primary/20">
                    {loc.status === 'Available' ? 'OPEN' : 'FULL'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{loc.distance} min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                   <div className="flex flex-col">
                      <span className="text-lg font-black text-foreground">
                        {loc.price.toFixed(2)}<span className="text-[10px] text-muted-foreground font-bold ml-1">ETB /hr</span>
                      </span>
                   </div>
                   <Link 
                     href={`/locations/${loc.id}`} 
                     className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
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
            className={`h-1 rounded-full transition-all duration-300 ${
              selectedLocationId === loc.id ? 'w-6 bg-primary' : 'w-2 bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

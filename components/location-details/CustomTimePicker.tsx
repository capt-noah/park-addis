"use client";

import { useEffect, useRef } from "react";

export function CustomTimePicker({ value, onSelect }: { value: string; onSelect: (time: string) => void }) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ["00", "15", "30", "45"];
  
  const [selectedH, selectedM] = value.split(':');
  
  const hourRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hourRef.current) {
        const activeItem = hourRef.current.querySelector(`[data-hour="${selectedH}"]`) as HTMLElement;
        if (activeItem) {
          hourRef.current.scrollTop = activeItem.offsetTop;
        }
    }
  }, [selectedH]);

  return (
    <div className="bg-card border border-border rounded-[2rem] p-6 shadow-2xl w-full max-w-[280px] mx-auto overflow-hidden flex flex-col gap-4">
      <div className="text-center font-extrabold text-muted-foreground uppercase text-[10px] tracking-widest border-b border-border pb-4">
        Select Time
      </div>
      
      <div className="flex gap-4 h-[200px]">
        <div ref={hourRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth space-y-1 pr-1 relative">
           {hours.map(h => (
             <button
               key={h}
               data-hour={h}
               onClick={() => onSelect(`${h}:${selectedM}`)}
               className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                 h === selectedH ? "bg-black text-white shadow-lg" : "text-foreground hover:bg-primary/10 hover:text-primary"
               }`}
             >
               {h}
             </button>
           ))}
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
           {minutes.map(m => (
             <button
               key={m}
               onClick={() => onSelect(`${selectedH}:${m}`)}
               className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                 m === selectedM ? "bg-black text-white shadow-lg" : "text-foreground hover:bg-primary/10 hover:text-primary"
               }`}
             >
               {m}
             </button>
           ))}
        </div>
      </div>
      
      <div className="flex items-center justify-center pt-4 border-t border-border">
          <span className="text-2xl font-black text-primary">{selectedH}</span>
          <span className="mx-2 text-muted-foreground font-black">:</span>
          <span className="text-2xl font-black text-primary">{selectedM}</span>
      </div>
    </div>
  );
}

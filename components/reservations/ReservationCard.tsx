"use client";

import { MapPin, Clock, Calendar, Ticket, ChevronRight } from "lucide-react";
import Image from "next/image";

export function ReservationCard({ status, name, address, startTime, endTime, price, active, image, onViewTicket, onCancel }: any) {
  const dateStr = startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
  const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const hours = Math.floor(durationInHours);
  const minutes = Math.round((durationInHours - hours) * 60);
  const durationStr = `${hours}h ${minutes}m`;

  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm flex flex-col md:flex-row h-full md:min-h-[220px] group hover:shadow-lg transition-all duration-500">
      <div className="w-full md:w-[240px] relative shrink-0 overflow-hidden bg-slate-900">
        <Image src={image} alt={name} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-card/95 backdrop-blur-md rounded-full text-[8px] font-extrabold text-foreground border border-border shadow-sm">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          {status === 'ATIVE' ? 'ACTIVE' : status}
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground leading-tight">{name}</h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
              {address}
            </div>
          </div>
          <div className="text-left sm:text-right shrink-0">
             <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Estimated Price</p>
             <p className="text-2xl font-black text-primary leading-none">ETB {price}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
           <div className="p-3 bg-muted/50 rounded-2xl border border-border flex items-center gap-3 hover:bg-muted transition-colors">
              <Calendar className="w-4 h-4 text-primary/60" />
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                <p className="text-[10px] font-bold text-foreground">{dateStr}</p>
              </div>
           </div>
           <div className="p-3 bg-muted/50 rounded-2xl border border-border flex items-center gap-3 hover:bg-muted transition-colors">
              <Clock className="w-4 h-4 text-primary/60" />
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Time Slot</p>
                <p className="text-[10px] font-bold text-foreground">{timeStr}</p>
              </div>
           </div>
           <div className="p-3 bg-muted/50 rounded-2xl border border-border flex items-center gap-3 hover:bg-muted transition-colors">
              <HistoryIcon className="w-4 h-4 text-primary/60" />
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Duration</p>
                <p className="text-[10px] font-bold text-foreground">{durationStr}</p>
              </div>
           </div>
        </div>

        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
           {active ? (
             <div className="flex items-center gap-4 w-full justify-between">
               <button 
                 onClick={onCancel}
                 className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-red-50/50 hover:text-red-600 hover:border-red-200 transition-all text-[10px] font-bold"
               >
                 Cancel Reservation
               </button>
               <button 
                 onClick={onViewTicket}
                 className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
               >
                 <Ticket className="w-4 h-4" /> View Ticket
               </button>
             </div>
           ) : (
             <div className="flex items-center gap-4 w-full justify-end">
               <button className="bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted px-6 py-3 rounded-xl font-bold text-[10px] transition-all flex items-center gap-2">
                 View Details <ChevronRight className="w-4 h-4" />
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 8v4l3 3" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

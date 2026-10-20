"use client";

import { MapPin, Clock, Calendar, Ticket, ChevronRight } from "lucide-react";
import Link from "next/link";

export function ReservationCard({ status, name, address, startTime, endTime, price, active, onViewTicket, onCancel }: any) {
  const dateStr = startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
  const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const hours = Math.floor(durationInHours);
  const minutes = Math.round((durationInHours - hours) * 60);
  const durationStr = `${hours}h ${minutes}m`;

  const hourlyRate = parseFloat(price || "0");
  const estimatedTotal = (durationInHours * hourlyRate).toFixed(2);

  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm flex flex-col md:flex-row h-full md:min-h-[220px] group hover:shadow-lg transition-all duration-500">
      <div className="w-full md:w-[220px] shrink-0 p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-border/40">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400">
            PARK ADDIS PASS
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-mono font-bold text-white border border-white/10 uppercase tracking-wider">
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
            {status}
          </div>
        </div>

        <div className="my-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xl mb-2 shadow-inner">
            P
          </div>
          <p className="text-xs font-mono font-bold text-slate-200 truncate">{name}</p>
          <p className="text-[10px] font-mono text-emerald-400/90 font-medium">FAST-PASS QR VERIFIED</p>
        </div>

        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>GATE 01</span>
          <span>ETH-MOBILITY</span>
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
             <p className="text-2xl font-black text-primary leading-none">ETB {estimatedTotal}</p>
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
              <div className="flex items-center gap-3 w-full justify-between">
                <button 
                  onClick={onCancel}
                  className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-red-50/50 hover:text-red-600 hover:border-red-200 transition-all text-[10px] font-bold"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  {(status?.toUpperCase() === "ACTIVE" || status?.toUpperCase() === "RESERVED") && (
                    <Link
                      href={`/locations?selected=${encodeURIComponent(name)}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 text-primary hover:bg-primary/5 transition-all text-[10px] font-bold"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Map
                    </Link>
                  )}
                  <button 
                    onClick={onViewTicket}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
                  >
                    <Ticket className="w-3.5 h-3.5" /> View Ticket
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full justify-end">
                {(status?.toUpperCase() === "ACTIVE" || status?.toUpperCase() === "RESERVED") && (
                  <Link
                    href={`/locations?selected=${encodeURIComponent(name)}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-all text-[10px] font-bold"
                  >
                    <MapPin className="w-3.5 h-3.5" /> View on Map
                  </Link>
                )}
                <button 
                  onClick={onViewTicket}
                  className="bg-[#004D40] text-white px-5 py-2.5 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-[#004D40]/20 hover:scale-[1.02] active:scale-95"
                >
                  Details <ChevronRight className="w-4 h-4" />
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

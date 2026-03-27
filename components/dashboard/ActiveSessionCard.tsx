"use client";

import { useState } from "react";
import { Clock, MapPin, Car, Plus, QrCode } from "lucide-react";
import { TicketModal } from "@/components/reservations/TicketModal";
import { ExtendSessionModal } from "./ExtendSessionModal";

export function ActiveSessionCard({ reservation }: { reservation: any }) {
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  if (!reservation || (reservation.status !== "ACTIVE" && reservation.status !== "RESERVED")) {
    return null;
  }

  const isReserved = reservation.status === "RESERVED";
  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <>
      <div className="relative w-full rounded-3xl overflow-hidden mb-8 group">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#004D40] via-emerald-400 to-[#004D40] opacity-20 animate-bg-pan z-0" />
        
        <div className="relative z-10 m-[2px] bg-white rounded-[22px] p-6 shadow-sm border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Status indicator */}
            <div className="relative w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
              <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white translate-x-1 -translate-y-1 animate-pulse" />
              <Clock size={24} className="text-[#004D40] opacity-80" />
            </div>

            {/* Session Info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#004D40] bg-[#004D40]/10 px-2 py-0.5 rounded-full">
                  {isReserved ? "Upcoming Reservation" : "Active Parking Session"}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {reservation.locationName}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                  <Clock size={12} className="text-[#004D40]/60" />
                  <span>{fmt(startTime)} – {fmt(endTime)}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                  <Car size={12} className="text-[#004D40]/60" />
                  <span>{reservation.plateNumber || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {!isReserved && (
              <button 
                onClick={() => setShowExtendModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 min-w-[120px] rounded-xl bg-emerald-50 text-[#004D40] font-bold text-sm border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all active:scale-95"
              >
                <Plus size={16} strokeWidth={3} />
                Extend
              </button>
            )}
            <button 
              onClick={() => setShowTicketModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 min-w-[120px] rounded-xl bg-[#004D40] text-white font-bold text-sm hover:bg-[#004D40]/90 shadow-md shadow-[#004D40]/20 transition-all active:scale-95"
            >
              <QrCode size={16} strokeWidth={3} />
              View Ticket
            </button>
          </div>
        </div>
      </div>

      {showTicketModal && (
        <TicketModal 
          reservation={reservation} 
          onClose={() => setShowTicketModal(false)} 
        />
      )}

      {showExtendModal && (
        <ExtendSessionModal 
          reservation={reservation} 
          onClose={() => setShowExtendModal(false)} 
        />
      )}
    </>
  );
}

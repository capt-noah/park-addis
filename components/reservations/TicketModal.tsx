"use client";

import { Clock } from "lucide-react";
import Image from "next/image";

export function TicketModal({ reservation, onClose }: { reservation: any; onClose: () => void }) {
  if (!reservation) return null;

  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);
  const dateStr = startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-2 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#004D40] rounded-[0.6rem] flex items-center justify-center shadow-lg shadow-emerald-900/20">
               <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="text-xl font-black tracking-tight text-[#004D40]">ParkAddis</span>
          </div>

          <div className="w-[180px] aspect-square bg-[#F8F9FA] rounded-[1.5rem] border border-slate-100 p-6 flex flex-col items-center justify-center mb-4 relative group">
             <div className="w-full h-full relative">
               <Image src="/qr-placeholder.png" alt="QR Code" fill className="object-contain" />
             </div>
          </div>
          
          <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2">Scan at Entrance</p>
        </div>

        {/* Perforated Line */}
        <div className="relative h-4 flex items-center">
          <div className="absolute left-0 -translate-x-1/2 w-5 h-5 bg-slate-900/40 rounded-full" />
          <div className="absolute right-0 translate-x-1/2 w-5 h-5 bg-slate-900/40 rounded-full" />
          <div className="w-full border-t-2 border-dashed border-slate-100" />
        </div>

        {/* Details - Scrollable if needed */}
        <div className="p-6 pt-4 space-y-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Parking Location</p>
            <p className="text-sm font-black text-[#004D40] leading-tight">{reservation.locationName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-0.5">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Plate Number</p>
               <p className="text-sm font-black text-[#004D40]">ET 2-A12345</p>
             </div>
             <div className="space-y-0.5">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Date</p>
               <p className="text-sm font-black text-[#004D40]">{dateStr}</p>
             </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Time Slot</p>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#004D40]" />
              <p className="text-sm font-black text-[#004D40]">{timeStr}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
            <div className="space-y-0.5">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Total Price</p>
               <p className="text-xl font-black text-primary">ETB {reservation.pricePerHour}</p>
            </div>
            <div className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black border border-emerald-100 uppercase tracking-wide">
               Paid
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-xs tracking-wide hover:opacity-90 transition-all shadow-lg shadow-slate-900/20 active:scale-95 mt-2"
          >
            Close Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

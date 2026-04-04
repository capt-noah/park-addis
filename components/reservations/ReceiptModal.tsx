"use client";

import {
  Download,
  X,
  Car,
  CreditCard,
  Clock,
} from "lucide-react";

export function ReceiptModal({ reservation, onClose }: { reservation: any; onClose: () => void }) {
  if (!reservation) return null;

  const startTime = new Date(reservation.actualStartTime ?? reservation.startTime);
  const endTime   = new Date(reservation.actualEndTime   ?? reservation.endTime);
  const reservationDate = startTime;
  const dateStr = reservationDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const timeStr = `${formatTime(startTime)} - ${formatTime(endTime)}`;

  const durationMs  = Math.max(0, endTime.getTime() - startTime.getTime());
  const durationHrs = durationMs / (1000 * 60 * 60);
  const durationDisplay = `${Math.floor(durationHrs)}h ${Math.round((durationHrs % 1) * 60)}m`;
  const baseFeePerHour = parseFloat(reservation.pricePerHour || "0");
  const parkingFee     = parseFloat((durationHrs * baseFeePerHour).toFixed(2));
  const reservationFee = 0.00;
  const serviceFee     = 0.00;
  const totalFee       = (parkingFee + reservationFee + serviceFee).toFixed(2);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-[360px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border-0 dark:border dark:border-slate-800/80 animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-100/80 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors z-50"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* Top Section: Branding & Receipt Summary - FIXED HEADER */}
        <div className="pt-8 pb-6 px-8 flex flex-col items-center border-b border-dashed border-slate-200 dark:border-slate-800/80 relative bg-white dark:bg-slate-900 z-20">
          {/* Side Notches */}
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-900/40 rounded-full z-10" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-900/40 rounded-full z-10" />

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 mt-2">
            <div className="w-8 h-8 bg-[#004D40] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#004D40] dark:text-emerald-400">ParkAddis</h1>
          </div>

          {/* Receipt Title + Total */}
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.2em] mb-2">Payment Receipt</p>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
            <span className="text-xl text-slate-400 dark:text-slate-500 mr-1">ETB</span>{totalFee}
          </h2>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Details Section */}
          <div className="px-8 py-5 space-y-3 relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              {/* PAID Watermark — diagonal at top */}
              <div className="absolute top-2 left-0 right-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden h-24">
                <span className="text-emerald-500/[0.13] font-black text-7xl uppercase tracking-[0.25em] select-none whitespace-nowrap -rotate-[25deg]">
                  PAID
                </span>
              </div>

              {/* Reservation + Receipt IDs */}
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">Receipt No</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">#{reservation.id?.substring(0, 6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{dateStr}</p>
                </div>
              </div>

              {/* Location + Time */}
              <div className="relative z-10 grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{reservation.locationName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">Time Slot</p>
                  <div className="flex items-center justify-end gap-1 text-[#004D40] dark:text-emerald-400">
                    <Clock size={12} />
                    <p className="text-xs font-bold">{timeStr}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle + Payment Method */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <Car size={18} className="text-[#004D40] dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                      {reservation.carModel
                        ? `${reservation.carModel}${reservation.carColor ? ` · ${reservation.carColor}` : ""}`
                        : "Registered Vehicle"}
                    </p>
                    <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{reservation.plateNumber || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <CreditCard size={18} className="text-[#004D40] dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white">ParkAddis Wallet</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400">Paid securely</p>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="relative z-10 bg-emerald-50/50 dark:bg-emerald-900/10 px-5 py-3 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/40">
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700/60 dark:text-emerald-400/60">Parking ({durationDisplay})</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ETB {parkingFee.toFixed(2)}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-400 mt-0.5">{durationHrs.toFixed(2)} hrs × ETB {baseFeePerHour.toFixed(2)}/hr</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700/60 dark:text-emerald-400/60">Reservation Fee</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ETB {reservationFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-100/50 dark:border-emerald-800/20">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700/60 dark:text-emerald-400/60">Service Fee</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ETB {serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#004D40] dark:text-emerald-400">Total Paid</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">ETB {totalFee}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FIXED FOOTER */}
        <div className="px-8 pb-10 pt-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-20">
          <button className="w-full bg-[#004D40] hover:bg-[#004D40]/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#004D40]/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]">
            <Download size={18} className="group-hover:scale-110 transition-transform" />
            Download Receipt
          </button>
        </div>

        {/* Perforated Tear-off Edge */}
        <div className="absolute -bottom-2.5 left-0 right-0 h-4 flex items-center justify-center overflow-visible pointer-events-none z-0">
          <div className="w-full h-4 flex gap-2 px-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 h-4 bg-slate-900/40 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

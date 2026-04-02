"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Banknote, X, Car, CreditCard, CheckCircle2, Timer, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function TicketModal({ reservation, onClose }: { reservation: any; onClose: () => void }) {
  if (!reservation) return null;

  const status = (reservation.status || "").toUpperCase();
  const isReserved        = status === "RESERVED";
  const isActive          = status === "ACTIVE";
  const isCancelled       = status === "CANCELLED";
  const isCompletedUnpaid = status === "COMPLETED";
  const isCompletedPaid   = status === "PAID";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-[360px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border-0 dark:border dark:border-slate-800/80 animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-100/80 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors z-20"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* Top: Branding + QR */}
        <div className="pt-8 pb-6 px-8 flex flex-col items-center border-b border-dashed border-slate-200 dark:border-slate-800/80 relative">
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-900/40 rounded-full z-10" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-900/40 rounded-full z-10" />

          <div className="flex items-center gap-2 mb-5 mt-2">
            <div className="w-8 h-8 bg-[#004D40] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#004D40] dark:text-emerald-400">ParkAddis</h1>
          </div>

          {/* Status pill */}
          {isCompletedPaid && (
            <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
              <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Transaction Successful</span>
            </div>
          )}

          {/* QR Code */}
          <div className="z-10">
            <div className="bg-slate-50 dark:bg-white p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner">
              <QRCodeSVG
                value={reservation.qrToken || "park-addis"}
                size={120}
                level="L"
                includeMargin={false}
                fgColor="#004D40"
              />
            </div>
          </div>

          <p className="mt-3 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.2em]">
            {isReserved        && "Scan at Entrance"}
            {isActive          && "Scan to Exit"}
            {isCompletedUnpaid && "Session Ended"}
            {isCompletedPaid   && "Session Ended"}
            {isCancelled       && "Reservation Cancelled"}
          </p>
        </div>

        {/* Details body — switches by status */}
        {isReserved        && <ReservedDetails   reservation={reservation} onClose={onClose} />}
        {isActive          && <ActiveDetails     reservation={reservation} onClose={onClose} />}
        {isCompletedUnpaid && <UnpaidDetails     reservation={reservation} onClose={onClose} />}
        {isCompletedPaid   && <PaidDetails       reservation={reservation} onClose={onClose} />}
        {isCancelled       && <CancelledDetails  reservation={reservation} onClose={onClose} />}

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

/* ─── RESERVED ─── */
function ReservedDetails({ reservation, onClose }: any) {
  const startTime = new Date(reservation.startTime);
  const endTime   = new Date(reservation.endTime);
  const dateStr   = startTime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const fmt       = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const timeStr   = `${fmt(startTime)} – ${fmt(endTime)}`;

  return (
    <>
      <div className="px-8 py-6 space-y-5 flex-1">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Parking Location</p>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{reservation.locationName}</h3>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Plate Number</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{reservation.plateNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Date</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{dateStr}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Time Slot</p>
          <div className="flex items-center gap-2 text-[#004D40] dark:text-emerald-500">
            <Clock size={15} />
            <p className="text-sm font-bold">{timeStr}</p>
          </div>
        </div>
      </div>
      <div className="px-8 pb-10 pt-2">
        <button onClick={onClose} className="w-full bg-[#004D40] text-white font-bold py-4 rounded-2xl hover:bg-[#004D40]/90 transition-all text-sm active:scale-[0.98] shadow-lg shadow-[#004D40]/20">
          Close Ticket
        </button>
      </div>
    </>
  );
}

/* ─── ACTIVE ─── */
function ActiveDetails({ reservation, onClose }: any) {
  const startTime    = new Date(reservation.actualStartTime ?? reservation.startTime);
  const endTime      = new Date(reservation.endTime);
  const pricePerHour = parseFloat(reservation.pricePerHour || "0");

  const BILLING_MINS = 15;

  // Use functional updater + useRef so the interval never becomes stale
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const now         = new Date();
  const totalMs     = Math.max(1, endTime.getTime() - startTime.getTime());
  const elapsedMs   = Math.max(0, now.getTime() - startTime.getTime());
  const remainingMs = Math.max(0, endTime.getTime() - now.getTime());
  const progress    = Math.min(100, (elapsedMs / totalMs) * 100);

  // Cost ticks in 15-min increments
  const billingIntervals = Math.floor(elapsedMs / (BILLING_MINS * 60 * 1000));
  const billedHrs        = (billingIntervals * BILLING_MINS) / 60;
  const costSoFar        = (billedHrs * pricePerHour).toFixed(2);

  // Countdown HH:MM:SS
  const rh = Math.floor(remainingMs / 3_600_000);
  const rm = Math.floor((remainingMs % 3_600_000) / 60_000);
  const rs = Math.floor((remainingMs % 60_000) / 1_000);
  const countdown = `${String(rh).padStart(2, "0")}:${String(rm).padStart(2, "0")}:${String(rs).padStart(2, "0")}`;

  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <>
      <div className="px-8 py-5 space-y-4 flex-1">
        {/* Countdown + progress */}
        <div className="bg-[#004D40]/5 dark:bg-[#10B981]/5 rounded-2xl p-4 border border-[#004D40]/10 dark:border-[#10B981]/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[#004D40] dark:text-emerald-500">
              <Timer size={15} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Time Remaining</span>
            </div>
            <span className="font-mono text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">{countdown}</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#004D40] dark:bg-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">Entry: {fmt(startTime)}</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">Exit by: {fmt(endTime)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Location</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{reservation.locationName}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Plate</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{reservation.plateNumber || "N/A"}</p>
          </div>
        </div>

          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl px-5 py-3 border border-slate-100 dark:border-slate-700/50">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Cost So Far</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">ETB {costSoFar}</p>
          </div>
      </div>
      <div className="px-8 pb-10 pt-2">
        <button onClick={onClose} className="w-full bg-[#004D40] text-white font-bold py-4 rounded-2xl hover:bg-[#004D40]/90 transition-all text-sm active:scale-[0.98] shadow-lg shadow-[#004D40]/20">
          Close Ticket
        </button>
      </div>
    </>
  );
}

/* ─── COMPLETED + UNPAID ─── */
function UnpaidDetails({ reservation, onClose }: any) {
  const startTime = new Date(reservation.actualStartTime ?? reservation.startTime);
  const endTime   = new Date(reservation.actualEndTime   ?? reservation.endTime);
  const dateStr   = startTime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const fmt       = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const timeStr   = `${fmt(startTime)} – ${fmt(endTime)}`;

  const durationMs  = Math.max(0, endTime.getTime() - startTime.getTime());
  const durationHrs = durationMs / (1000 * 60 * 60);
  const durationDisplay = `${Math.floor(durationHrs)}h ${Math.round((durationHrs % 1) * 60)}m`;
  const baseRate    = parseFloat(reservation.pricePerHour || "0");
  const parkingFee  = parseFloat((durationHrs * baseRate).toFixed(2));
  const resFee      = 5.00;
  const svcFee      = 2.50;
  const totalDue = (parkingFee + resFee + svcFee).toFixed(2);
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayNow = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const paymentResponse = await fetch(`/api/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({qrToken: reservation.qrToken})
      })

      if (!paymentResponse.ok) {
        let errorMsg = "Payment initialization failed."
        try {
          const errorData = await paymentResponse.json()
          errorMsg = errorData.error || errorMsg
        } catch (e) {
          // If not JSON, it might be HTML or empty
          errorMsg = `Server error: ${paymentResponse.status}`
        }
        throw new Error(errorMsg)
      }

      const payment = await paymentResponse.json()

      if (payment.status === "success" && payment.data?.checkout_url) {
        window.location.href = payment.data.checkout_url
      } else {
        throw new Error(payment.message || "Unable to initiate payment session.")
      }
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="px-8 py-5 space-y-4 flex-1 relative overflow-hidden">
        {/* UNPAID watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
          <span className="text-red-500/10 font-black text-6xl uppercase tracking-[0.3em] -rotate-[35deg] select-none scale-125 whitespace-nowrap">
            UNPAID
          </span>
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Date</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{dateStr}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Plate Number</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{reservation.plateNumber || "N/A"}</p>
            </div>
          </div>

          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Location</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{reservation.locationName}</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50">
              <Clock size={16} className="text-[#004D40] dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-900 dark:text-white">{timeStr}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Actual Parking Time</p>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-red-50/30 dark:bg-red-950/20 p-4 rounded-2xl border border-red-100/50 dark:border-red-900/20">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] font-bold uppercase tracking-wider text-red-600/60 dark:text-red-400/60">Parking ({durationDisplay})</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ETB {parkingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-red-600/60 dark:text-red-400/60">Reservation Fee</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ETB {resFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-red-100/30 dark:border-red-900/20">
                <span className="text-[9px] font-bold uppercase tracking-wider text-red-600/60 dark:text-red-400/60">Service Fee</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ETB {svcFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 dark:text-red-400">Total Due</span>
                <span className="text-xl font-extrabold text-red-600 dark:text-red-400">ETB {totalDue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 pb-10 pt-2">
        {error && (
          <p className="text-[10px] text-red-500 font-bold text-center mb-3 animate-shake">
            {error}
          </p>
        )}
        <button 
          onClick={handlePayNow} 
          disabled={isLoading}
          className="w-full bg-[#004D40] hover:bg-[#004D40]/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#004D40]/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Banknote size={20} className="group-hover:scale-110 transition-transform" />
          )}
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </>
  );
}

/* ─── COMPLETED + PAID ─── */
function PaidDetails({ reservation, onClose }: any) {
  const startTime = new Date(reservation.actualStartTime ?? reservation.startTime);
  const endTime   = new Date(reservation.actualEndTime   ?? reservation.endTime);
  const dateStr   = startTime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const fmt       = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const timeStr   = `${fmt(startTime)} – ${fmt(endTime)}`;
  const durationMs  = Math.max(0, endTime.getTime() - startTime.getTime());
  const durationHrs = durationMs / (1000 * 60 * 60);
  const durationDisplay = `${Math.floor(durationHrs)}h ${Math.round((durationHrs % 1) * 60)}m`;
  const baseRate    = parseFloat(reservation.pricePerHour || "0");
  const parkingFee  = parseFloat((durationHrs * baseRate).toFixed(2));
  const resFee      = 5.00;
  const svcFee      = 2.50;
  const totalPaid   = (parkingFee + resFee + svcFee).toFixed(2);

  return (
    <>
      <div className="px-8 py-5 space-y-4 flex-1 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
          <span className="text-emerald-500/10 font-black text-6xl uppercase tracking-[0.3em] -rotate-[35deg] select-none scale-125 whitespace-nowrap">
            PAID
          </span>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Date</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{dateStr}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Time</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{timeStr}</p>
            </div>
          </div>
          <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                <Car size={17} className="text-[#004D40] dark:text-emerald-400" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">Plate: {reservation.plateNumber || "N/A"}</p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{reservation.locationName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                <CreditCard size={17} className="text-[#004D40] dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">ParkAddis Wallet</p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400">Paid securely</p>
              </div>
            </div>
          </div>
          {/* Mini receipt summary */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/60 dark:text-emerald-400/60">Parking ({durationDisplay})</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ETB {parkingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/60 dark:text-emerald-400/60">Reservation Fee</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ETB {resFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-emerald-100/50 dark:border-emerald-900/20">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700/60 dark:text-emerald-400/60">Service Fee</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ETB {svcFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#004D40] dark:text-emerald-500">Total Paid</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">ETB {totalPaid}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 pb-10 pt-2">
        <button onClick={onClose} className="w-full bg-[#004D40] text-white font-bold py-4 rounded-2xl hover:bg-[#004D40]/90 transition-all text-sm active:scale-[0.98] shadow-lg shadow-[#004D40]/20">
          Close Ticket
        </button>
      </div>
    </>
  );
}

/* ─── CANCELLED ─── */
function CancelledDetails({ reservation, onClose }: any) {
  const startTime = new Date(reservation.startTime);
  const endTime   = new Date(reservation.endTime);
  const dateStr   = startTime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const fmt       = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const timeStr   = `${fmt(startTime)} – ${fmt(endTime)}`;

  return (
    <>
      <div className="px-8 py-6 space-y-5 flex-1 relative overflow-hidden">
        {/* CANCELLED watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
          <span className="text-[#004D40]/5 font-black text-5xl uppercase tracking-[0.2em] -rotate-[35deg] select-none scale-125 whitespace-nowrap">
            CANCELLED
          </span>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 bg-[#004D40]/5 dark:bg-emerald-500/10 p-3 rounded-2xl border border-[#004D40]/10 dark:border-emerald-500/20">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#004D40]/10 dark:border-emerald-500/20">
              <Clock size={16} className="text-[#004D40] dark:text-emerald-400 opacity-80" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#004D40] dark:text-emerald-400">{dateStr}</p>
              <p className="text-[10px] text-[#004D40]/70 dark:text-emerald-400/70 font-medium">{timeStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#004D40]/5 dark:bg-emerald-500/10 p-3 rounded-2xl border border-[#004D40]/10 dark:border-emerald-500/20">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#004D40]/10 dark:border-emerald-500/20">
              <Car size={16} className="text-[#004D40] dark:text-emerald-400 opacity-80" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[11px] font-bold text-[#004D40] dark:text-emerald-400 truncate">{reservation.locationName}</p>
              <p className="text-[10px] text-[#004D40]/70 dark:text-emerald-400/70 font-medium">{reservation.plateNumber || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-red-50/50 dark:bg-red-900/10 p-3 rounded-2xl border border-red-100 dark:border-red-800/40">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-red-100 dark:border-red-800/40">
              <XCircle size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-red-600/80 dark:text-red-400/80 uppercase tracking-widest">Status</p>
              <p className="text-[10px] text-red-500/80 dark:text-red-400/80 font-medium">Reservation Cancelled</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 pb-10 pt-2 relative z-10">
        <button onClick={onClose} className="w-full bg-[#004D40] text-white font-bold py-4 rounded-2xl hover:bg-[#004D40]/90 transition-all text-sm active:scale-[0.98] shadow-lg shadow-[#004D40]/20">
          Close Ticket
        </button>
      </div>
    </>
  );
}

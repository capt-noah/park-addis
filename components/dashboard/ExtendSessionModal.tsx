"use client";

import { useState } from "react";
import {
  Clock,
  Banknote,
  Car,
  Plus,
  ArrowRight,
  X,
  Minus,
  Loader2,
} from "lucide-react";


export function ExtendSessionModal({
  reservation,
  onClose,
}: {
  reservation: any;
  onClose: () => void;
}) {
  const [extraMinutes, setExtraMinutes] = useState<number | string>(30);
  const [isCustom, setIsCustom] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  if (!reservation) return null;

  // Parse extraMinutes safely for math
  const parsedMins =
    typeof extraMinutes === "number"
      ? extraMinutes
      : parseInt(extraMinutes as string) || 0;

  const currentEndTimeStr = new Date(reservation.endTime).toLocaleTimeString(
    [],
    { hour: "numeric", minute: "2-digit" },
  );

  // Calculate new end time
  const newEndTime = new Date(reservation.endTime);
  newEndTime.setMinutes(newEndTime.getMinutes() + parsedMins);
  const newEndTimeStr = newEndTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  // Calculate additional cost
  const additionalCost = (parsedMins / 60) * (reservation.pricePerHour || 10);

  const handleExtend = async () => {
    setIsExtending(true);
    try {
      const response = await fetch("/api/reservation/extend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: reservation.id,
          extraMinutes: parsedMins,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`Session extended by ${parsedMins} minutes!`);
        onClose();
      } else {
        alert(data.error || "Failed to extend session");
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred");
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-[360px] bg-white rounded-[2.5rem] shadow-2xl p-6 flex flex-col animate-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#004D40]/10 flex items-center justify-center text-[#004D40]">
              <Clock size={16} strokeWidth={2.5} />
            </div>
            <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Extend Session
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Current Time Info */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Current End Time
            </span>
            <span className="text-sm font-bold text-slate-700">
              {currentEndTimeStr}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-[#004D40] tracking-wider">
              New End Time
            </span>
            <div className="flex items-center gap-1.5 text-[#004D40]">
              <span className="text-sm font-extrabold">{newEndTimeStr}</span>
              <span className="text-[10px] bg-[#004D40]/10 px-1.5 py-0.5 rounded font-bold">
                +{parsedMins}m
              </span>
            </div>
          </div>
        </div>

        {/* Duration Picker */}
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
          Add Time
        </p>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[30, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setExtraMinutes(mins);
                setIsCustom(false);
              }}
              className={`py-3 rounded-2xl font-bold text-sm transition-all border ${
                !isCustom && extraMinutes === mins
                  ? "bg-[#004D40] text-white border-[#004D40] shadow-md shadow-[#004D40]/20"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#004D40]/30 hover:bg-slate-50"
              }`}
            >
              {mins === 60 ? "1 Hr" : "30 Min"}
            </button>
          ))}
          <button
            onClick={() => setIsCustom(true)}
            className={`py-3 rounded-2xl font-bold text-sm transition-all border ${
              isCustom
                ? "bg-[#004D40] text-white border-[#004D40] shadow-md shadow-[#004D40]/20"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#004D40]/30 hover:bg-slate-50"
            }`}
          >
            Custom
          </button>
        </div>

        {/* Custom Stepper (shows when isCustom is true) */}
        {isCustom && (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-2 mb-4 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => setExtraMinutes(Math.max(15, parsedMins - 15))}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm active:scale-95"
            >
              <Minus size={16} strokeWidth={3} />
            </button>
            <div className="flex-1 flex justify-center items-center">
              <input
                type="number"
                value={extraMinutes}
                onChange={(e) =>
                  setExtraMinutes(
                    e.target.value === "" ? "" : parseInt(e.target.value),
                  )
                }
                onBlur={() => {
                  if (extraMinutes === "" || parsedMins < 1)
                    setExtraMinutes(15);
                }}
                className="w-14 text-right text-lg font-black text-slate-900 bg-transparent border-none focus:outline-none p-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-xs font-bold text-slate-500 ml-1 mt-0.5">
                Mins
              </span>
            </div>
            <button
              onClick={() => setExtraMinutes(parsedMins + 15)}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
        )}

        <div className={isCustom ? "mb-6" : "mb-6 mt-4"}></div>

        {/* Cost Summary */}
        <div className="flex justify-between items-center px-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Banknote size={12} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-slate-600">
              Additional Cost
            </span>
          </div>
          <span className="text-lg font-black text-slate-900">
            ETB {additionalCost.toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <button
          onClick={handleExtend}
          disabled={isExtending || parsedMins < 1}
          className="w-full bg-[#004D40] text-white font-bold py-4 rounded-2xl hover:bg-[#004D40]/90 disabled:opacity-50 transition-all text-sm active:scale-[0.98] shadow-lg shadow-[#004D40]/20 flex items-center justify-center gap-2 group"
        >
          {isExtending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Extending...
            </>
          ) : (
            <>
              Confirm Extension
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

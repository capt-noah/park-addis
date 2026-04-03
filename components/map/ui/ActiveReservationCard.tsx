"use client";

import { Navigation, X } from "lucide-react";
import { useMap } from "../MapContext";

interface ActiveReservationCardProps {
  title: string;
  address: string;
  status: "ACTIVE" | "COMPLETED" | "PENDING";
  distance?: number | null;
  duration?: number | null;
  onDirectionsClick?: () => void;
}

export function ActiveReservationCard({
  title,
  address,
  status,
  distance,
  duration,
  onDirectionsClick,
}: ActiveReservationCardProps) {
  const { actions, navigation } = useMap();

  const formatDistance = (m: number) => {
    if (m < 1000) return `${Math.round(m)}m`;
    return `${(m / 1000).toFixed(1)}km`;
  };

  const formatDuration = (s: number) => {
    const mins = Math.ceil(s / 60);
    return `${mins}m`;
  };

  // Navigating mode view
  if (navigation.status === "NAVIGATING") {
    return (
      <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl p-3 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
        <div className="bg-[#064E3B] dark:bg-emerald-600 p-2.5 rounded-xl text-white">
          <Navigation className="w-5 h-5 fill-current" />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter leading-none mb-0.5">Navigation</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900 dark:text-white">{formatDistance(distance || 0)}</span>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{formatDuration(duration || 0)}</span>
          </div>
        </div>
        {/* X button removed from here */}
      </div>
    );
  }

  // Preview mode view (slightly more detailed but still compact)
  return (
    <div className="w-[280px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{title}</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{address}</p>
        </div>
        {/* X button removed from here */}
      </div>

      <button
        onClick={onDirectionsClick}
        className="w-full py-2.5 bg-[#064E3B] dark:bg-emerald-600 hover:bg-[#064E3B]/90 dark:hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <Navigation className="w-4 h-4 fill-current" />
        <span className="font-bold text-sm">Start Navigation</span>
      </button>
    </div>
  );
}

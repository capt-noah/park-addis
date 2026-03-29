"use client";

import { Navigation } from "lucide-react";

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
  const formatDistance = (m: number) => {
    if (m < 1000) return `${Math.round(m)} m`;
    return `${(m / 1000).toFixed(1)} km`;
  };

  const formatDuration = (s: number) => {
    const mins = Math.ceil(s / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-[340px] bg-white rounded-3xl shadow-xl overflow-hidden p-6 border border-slate-100">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xl font-bold text-slate-900 leading-tight">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider text-emerald-600">
            {status}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 mb-4 font-medium line-clamp-1">
        {address}
      </p>

      {distance !== undefined && distance !== null && (
        <div className="flex gap-4 mb-6 pt-4 border-t border-slate-50">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Distance</p>
            <p className="text-lg font-bold text-slate-800">{formatDistance(distance)}</p>
          </div>
          <div className="w-px h-8 bg-slate-100 mt-2" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time</p>
            <p className="text-lg font-bold text-slate-800">{formatDuration(duration || 0)}</p>
          </div>
        </div>
      )}

      <button
        onClick={onDirectionsClick}
        className="w-full py-4 bg-[#064E3B] hover:bg-[#064E3B]/90 text-white rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20"
      >
        <Navigation className="w-5 h-5 fill-current" />
        <span className="font-semibold text-lg">Directions</span>
      </button>
    </div>
  );
}

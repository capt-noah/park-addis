"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  ArrowRight, 
  QrCode
} from "lucide-react";

interface CityHub {
  id: string;
  name: string;
  code: string;
  subcity: string;
  availableSpots: number;
  totalSpots: number;
  price: number;
  eta: string;
  slots: boolean[]; // true = occupied, false = vacant
}

const cityHubs: CityHub[] = [
  {
    id: "bole",
    code: "ADD-BL01",
    name: "Bole Medhanealem Hub",
    subcity: "Bole · Atlas",
    availableSpots: 42,
    totalSpots: 60,
    price: 45,
    eta: "3 min",
    slots: [false, true, false, false, true, false, false, true, false, false],
  },
  {
    id: "kazanchis",
    code: "ADD-KZ04",
    name: "Kazanchis Financial Hub",
    subcity: "Kirkos · UNECA",
    availableSpots: 18,
    totalSpots: 35,
    price: 50,
    eta: "6 min",
    slots: [true, false, true, true, false, true, false, true, true, false],
  },
  {
    id: "meskel",
    code: "ADD-MS02",
    name: "Meskel Square Underground",
    subcity: "Kirkos · Stadium",
    availableSpots: 12,
    totalSpots: 40,
    price: 60,
    eta: "8 min",
    slots: [true, true, true, false, true, true, false, true, true, true],
  },
  {
    id: "piassa",
    code: "ADD-PS09",
    name: "Piassa Heritage Facility",
    subcity: "Arada · Churchill",
    availableSpots: 85,
    totalSpots: 100,
    price: 30,
    eta: "11 min",
    slots: [false, false, false, true, false, false, false, true, false, false],
  },
];

export function LiveParkingRadar() {
  const [activeHubId, setActiveHubId] = useState<string>("bole");
  const activeHub = cityHubs.find((hub) => hub.id === activeHubId) || cityHubs[0];

  return (
    <div className="w-full max-w-[540px] mx-auto select-none font-sans">
      {/* Container */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <span className="text-xs font-mono font-bold tracking-tight text-foreground uppercase">
            Live Availability
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Addis Ababa
          </span>
        </div>

        {/* Sub-City Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 pb-5">
          {cityHubs.map((hub) => {
            const isSelected = hub.id === activeHubId;
            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => setActiveHubId(hub.id)}
                className={`p-2.5 rounded-xl text-left transition-colors border cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white border-primary"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate leading-tight">
                    {hub.name.split(" ")[0]}
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                    {hub.eta}
                  </span>
                </div>
                <p className={`text-xs font-mono mt-1 ${isSelected ? "text-white" : "text-foreground font-semibold"}`}>
                  {hub.availableSpots} Free
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Panel */}
        <div className="bg-muted/30 border border-border/70 rounded-xl p-4 sm:p-5 mb-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-foreground tracking-tight">
                {activeHub.name}
              </h4>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{activeHub.subcity}</span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-foreground font-mono">
                ETB {activeHub.price}
                <span className="text-xs text-muted-foreground font-normal">/hr</span>
              </p>
            </div>
          </div>

          {/* Bays Visual Grid */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px] font-mono text-muted-foreground">
              <span>Open bays</span>
              <span className="text-foreground font-semibold">
                {activeHub.availableSpots} of {activeHub.totalSpots} free
              </span>
            </div>

            <div className="grid grid-cols-10 gap-1.5">
              {activeHub.slots.map((isOccupied, idx) => (
                <div
                  key={idx}
                  className={`h-6 rounded-md border flex items-center justify-center text-[9px] font-mono font-medium ${
                    isOccupied
                      ? "bg-muted border-border text-muted-foreground/40"
                      : "bg-primary/10 border-primary/30 text-primary font-bold"
                  }`}
                >
                  {isOccupied ? "–" : idx + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/locations?selected=${encodeURIComponent(activeHub.name.split(" ")[0])}`}
          className="w-full bg-primary text-white py-3 px-5 rounded-xl font-bold text-xs hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Reserve at {activeHub.name.split(" ")[0]} · ETB {activeHub.price}/hr</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

      </div>
    </div>
  );
}

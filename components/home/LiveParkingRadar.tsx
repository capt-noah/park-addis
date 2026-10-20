"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Zap, 
  ShieldCheck, 
  QrCode, 
  ArrowRight, 
  Radio,
  Sparkles,
  Gauge
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
  status: string;
  fastPass: boolean;
  slots: boolean[]; // true = occupied, false = vacant
}

const cityHubs: CityHub[] = [
  {
    id: "bole",
    code: "ADD-BL01",
    name: "Bole Medhanealem Hub",
    subcity: "Bole Sub-City · Atlas",
    availableSpots: 42,
    totalSpots: 60,
    price: 45,
    eta: "3 min",
    status: "Optimal Clearance",
    fastPass: true,
    slots: [false, true, false, false, true, false, false, true, false, false],
  },
  {
    id: "kazanchis",
    code: "ADD-KZ04",
    name: "Kazanchis Financial Hub",
    subcity: "Kirkos Sub-City · UNECA",
    availableSpots: 18,
    totalSpots: 35,
    price: 50,
    eta: "6 min",
    status: "Moderate Demand",
    fastPass: true,
    slots: [true, false, true, true, false, true, false, true, true, false],
  },
  {
    id: "meskel",
    code: "ADD-MS02",
    name: "Meskel Square Underground",
    subcity: "Kirkos · Stadium Corridor",
    availableSpots: 12,
    totalSpots: 40,
    price: 60,
    eta: "8 min",
    status: "Covered Vault",
    fastPass: true,
    slots: [true, true, true, false, true, true, false, true, true, true],
  },
  {
    id: "piassa",
    code: "ADD-PS09",
    name: "Piassa Heritage Facility",
    subcity: "Arada Sub-City · Churchill",
    availableSpots: 85,
    totalSpots: 100,
    price: 30,
    eta: "11 min",
    status: "Multi-Deck Open",
    fastPass: true,
    slots: [false, false, false, true, false, false, false, true, false, false],
  },
];

export function LiveParkingRadar() {
  const [activeHubId, setActiveHubId] = useState<string>("bole");
  const activeHub = cityHubs.find((hub) => hub.id === activeHubId) || cityHubs[0];

  const occupancyRatio = Math.round(
    ((activeHub.totalSpots - activeHub.availableSpots) / activeHub.totalSpots) * 100
  );

  return (
    <div className="w-full max-w-[560px] mx-auto select-none font-sans">
      {/* Dynamic ambient backdrop blur */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/15 via-primary/10 to-teal-500/5 blur-3xl -z-10 rounded-[2.5rem] pointer-events-none opacity-70 dark:opacity-40" />

      {/* Main Command Deck Container */}
      <div className="bg-card dark:bg-slate-900/90 backdrop-blur-2xl border border-border/80 dark:border-slate-800 rounded-[2rem] p-6 sm:p-7 shadow-2xl shadow-emerald-950/10 transition-all duration-300">
        
        {/* Top Telemetry Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Addis Ababa Grid Telemetry
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>LIVE IOT</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
              99.8% ACCURACY
            </span>
          </div>
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
                className={`p-2.5 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold truncate leading-tight">
                    {hub.name.split(" ")[0]}
                  </span>
                  <span className={`text-[9px] font-mono font-bold ${isSelected ? "text-emerald-200" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {hub.eta}
                  </span>
                </div>
                <p className={`text-[10px] font-mono mt-1 ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                  {hub.availableSpots} Free
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Telemetry Showcase */}
        <div className="bg-muted/40 dark:bg-slate-950/60 border border-border/70 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-5 space-y-4">
          
          {/* Hub Title & Hourly Tariff */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/10 text-primary dark:text-emerald-400 border border-primary/20">
                  {activeHub.code}
                </span>
                <h4 className="text-base font-extrabold text-foreground tracking-tight">
                  {activeHub.name}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{activeHub.subcity}</span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xl font-black text-primary dark:text-emerald-400 font-mono tracking-tight">
                ETB {activeHub.price}
                <span className="text-xs text-muted-foreground font-normal">/hr</span>
              </p>
              <p className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {activeHub.status}
              </p>
            </div>
          </div>

          {/* Real-time Ingress Bays Visualization (10 slots) */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-muted-foreground">
              <span>LIVE INGRESS BAYS (SAMPLE)</span>
              <span className="text-foreground">
                <strong className="text-emerald-500">{activeHub.availableSpots}</strong> / {activeHub.totalSpots} VACANT
              </span>
            </div>

            {/* Micro bay slot indicator strip */}
            <div className="grid grid-cols-10 gap-1.5">
              {activeHub.slots.map((isOccupied, idx) => (
                <div
                  key={idx}
                  className={`h-7 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    isOccupied
                      ? "bg-slate-800/80 dark:bg-slate-800/60 border-slate-700/60 text-slate-500"
                      : "bg-emerald-500/20 dark:bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/20"
                  }`}
                  title={`Bay B-${idx + 1}: ${isOccupied ? "Occupied" : "Vacant"}`}
                >
                  <span className="text-[9px] font-mono font-bold">
                    {isOccupied ? "BUSY" : `B${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware Telemetry Strip */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-card dark:bg-slate-900 border border-border/60 dark:border-slate-800">
              <p className="text-[9px] font-mono uppercase text-muted-foreground">Gate Clearance</p>
              <p className="text-xs font-bold font-mono text-foreground mt-0.5">0.2s FAST-PASS</p>
            </div>
            <div className="p-2 rounded-xl bg-card dark:bg-slate-900 border border-border/60 dark:border-slate-800">
              <p className="text-[9px] font-mono uppercase text-muted-foreground">Security</p>
              <p className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">24/7 CCTV</p>
            </div>
            <div className="p-2 rounded-xl bg-card dark:bg-slate-900 border border-border/60 dark:border-slate-800">
              <p className="text-[9px] font-mono uppercase text-muted-foreground">Occupancy</p>
              <p className="text-xs font-bold font-mono text-foreground mt-0.5">{occupancyRatio}% Load</p>
            </div>
          </div>

        </div>

        {/* Direct Booking & QR Pass Strip */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={`/locations?selected=${encodeURIComponent(activeHub.name.split(" ")[0])}`}
            className="w-full sm:flex-1 bg-primary text-white py-3.5 px-6 rounded-xl font-bold text-xs hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <span>Reserve Guaranteed Bay · ETB {activeHub.price}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-muted/60 dark:bg-slate-950/60 border border-border/60 dark:border-slate-800 text-[11px] font-mono text-muted-foreground shrink-0 w-full sm:w-auto justify-center">
            <QrCode className="w-4 h-4 text-primary" />
            <span>INSTANT QR PASS</span>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ArrowRight, ParkingCircle, Clock, XCircle } from "lucide-react";
import { TicketModal } from "../reservations";
import { ReceiptModal } from "../reservations/ReceiptModal";

export function RecentHistoryTable({ recentReservations, totalCount }: { recentReservations: any[], totalCount: number }) {
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  return (
    <div className="bg-card rounded-3xl p-6 border border-border shadow-sm relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Recent History</h2>
        <div className="flex gap-2">
           <button className="px-4 py-2 rounded-xl border border-border text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors">
             Filter
           </button>
           <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:opacity-90 transition-colors">
             Export
           </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-border">
              <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Parking Location</th>
              <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Time & Date</th>
              <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground text-center">Status</th>
              <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Amount</th>
              <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentReservations.length > 0 ? recentReservations.map((res) => {
              const startTime = new Date(res.startTime);
              const endTime = new Date(res.endTime);
              
              const today = new Date();
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);
              
              let timeStr = "";
              if (startTime.toDateString() === today.toDateString()) {
                timeStr = "Today";
              } else if (startTime.toDateString() === yesterday.toDateString()) {
                timeStr = "Yesterday";
              } else {
                timeStr = startTime.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              }
              
              const dateStr = `${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
              
              const durationHrs = Math.max(0, (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
              const amount = res.pricePerHour 
                              ? `ETB ${(durationHrs * parseFloat(res.pricePerHour)).toFixed(2)}` 
                              : "--";

              let icon = <ParkingCircle className="w-4 h-4 text-primary" />;
              if (res.status === 'COMPLETED') icon = <Clock className="w-4 h-4 text-muted-foreground" />;
              if (res.status === 'CANCELLED') icon = <XCircle className="w-4 h-4 text-red-500/50" />;

              return (
                <HistoryRow 
                  key={res.id}
                  icon={icon}
                  name={res.locationName}
                  id={`Spot ID: ${res.spotId ? res.spotId.substring(0, 8) : "Unknown"}`}
                  time={timeStr}
                  date={dateStr}
                  status={res.status}
                  amount={amount}
                  onViewDetails={() => setSelectedReservation(res)}
                />
              );
            }) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground font-medium text-sm">
                  No recent history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 flex items-center justify-between">
        <p className="text-[10px] font-medium text-muted-foreground">Showing <span className="text-foreground font-bold">{totalCount > 0 ? "1" : "0"}-{recentReservations.length}</span> of <span className="text-foreground font-bold">{totalCount}</span> results</p>
        <div className="flex gap-2">
           <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50" disabled>
             <ArrowRight className="w-3.5 h-3.5 rotate-180 text-muted-foreground" />
           </button>

           <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
             <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
           </button>
        </div>
      </div>

      {selectedReservation?.status?.toUpperCase() === "PAID" ? (
        <ReceiptModal 
          reservation={selectedReservation} 
          onClose={() => setSelectedReservation(null)} 
        />
      ) : (  
        <TicketModal 
          reservation={selectedReservation} 
          onClose={() => setSelectedReservation(null)} 
        />
      )}
    </div>
  );
}

function HistoryRow({ icon, name, id, time, date, status, amount, onViewDetails }: any) {
  const statusColors: any = {
    ACTIVE: "bg-primary/10 text-primary border-primary/20",
    COMPLETED: "bg-muted text-muted-foreground border-border",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <tr className="group hover:bg-muted/30 transition-colors">
      <td className="py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border group-hover:bg-card transition-colors">
            {icon}
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{name}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{id}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="space-y-0.5">
          <p className="font-bold text-foreground text-[11px]">{time}</p>
          <p className="text-[10px] text-muted-foreground font-medium tracking-tight">{date}</p>
        </div>
      </td>
      <td className="text-center">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${statusColors[status] || statusColors.ACTIVE}`}>
          {status}
        </span>
      </td>
      <td>
        <p className="font-bold text-foreground text-[11px] font-sans tracking-wide">{amount}</p>
      </td>
      <td className="text-right">
        <button 
          onClick={onViewDetails}
          className="text-[11px] font-bold text-white bg-[#004D40] hover:bg-[#004D40]/90 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
        >
          View Details
        </button>
      </td>
    </tr>
  );
}

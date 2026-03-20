"use client";

import { TabItem, ReservationCard, TicketModal } from "./reservations";
import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Reservation {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  locationName: string;
  locationAddress: string;
  pricePerHour: string | null;
}

export default function ReservationsClient({ initialReservations, user }: { initialReservations: any[], user: any }) {
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reservations, setReservations] = useState(initialReservations);

  const handleCancel = async (reservationId: string) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      const response = await fetch(`/api/reservations?id=${reservationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReservations(prev => prev.filter(r => r.id !== reservationId));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel reservation");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("An error occurred while cancelling");
    }
  };

  const filteredReservations = reservations.filter(res => {
    const status = (res.status || "active").toLowerCase();
    if (activeTab === "Active") return status === "active" || status === "ative";
    if (activeTab === "Completed") return status === "completed";
    if (activeTab === "Cancelled") return status === "cancelled";
    return false;
  });

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-primary mb-1">My Reservations</h1>
          <p className="text-muted-foreground text-xs font-medium tracking-tight">Manage and view details of your parking history.</p>
        </div>
        <Link href="/locations" className="bg-primary text-white px-5 py-3 rounded-2xl font-bold text-[11px] flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Book New Spot
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <TabItem 
            label="Active" 
            count={reservations.filter(r => (r.status || "").toLowerCase().includes("active") || (r.status || "").includes("ative")).length} 
            active={activeTab === "Active"} 
            onClick={() => setActiveTab("Active")}
        />
        <TabItem 
            label="Completed" 
            count={reservations.filter(r => (r.status || "").toLowerCase() === "completed").length} 
            active={activeTab === "Completed"} 
            onClick={() => setActiveTab("Completed")}
        />
        <TabItem 
            label="Cancelled" 
            count={reservations.filter(r => (r.status || "").toLowerCase() === "cancelled").length} 
            active={activeTab === "Cancelled"} 
            onClick={() => setActiveTab("Cancelled")}
        />
      </div>

      {/* Reservations List */}
      <div className="space-y-6">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((res) => (
            <ReservationCard 
                key={res.id} 
                status={res.status.toUpperCase() === "ATIVE" ? "ACTIVE" : res.status.toUpperCase()} 
                name={res.locationName} 
                address={res.locationAddress} 
                startTime={new Date(res.startTime)}
                endTime={new Date(res.endTime)}
                price={res.pricePerHour || "25.00"}
                image="/bole.png" 
                active={res.status.toLowerCase().includes("active") || res.status.toLowerCase().includes("ative")}
                onViewTicket={() => setSelectedTicket(res)}
                onCancel={() => handleCancel(res.id)}
            />
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground font-bold">No {activeTab.toLowerCase()} reservations found.</p>
          </div>
        )}
      </div>

      <TicketModal 
        reservation={selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
      />
    </>
  );
}

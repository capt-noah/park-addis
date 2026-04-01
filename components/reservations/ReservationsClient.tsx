"use client";

import { TabItem, ReservationCard, TicketModal } from ".";
import { ReceiptModal } from "./ReceiptModal";
import { useSession } from "../session/AppSessionProvider";
import { useUI } from "../ui/UIProvider";
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
  const { refreshSession } = useSession();
  const { showNotification, showConfirmation } = useUI();
  const [activeTab, setActiveTab ] = useState("Active");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reservations, setReservations] = useState(initialReservations);

  const handleCancel = async (reservationId: string) => {
    showConfirmation({
      title: "Cancel Reservation?",
      message: "Are you sure you want to cancel this reservation? This action cannot be undone.",
      confirmText: "Cancel Now",
      cancelText: "Keep it",
      onConfirm: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservation?id=${reservationId}`, {
            method: 'DELETE',
            credentials: 'include',
          });

          if (response.ok) {
            await refreshSession();
            setReservations(prev => prev.filter(r => r.id !== reservationId));
            showNotification("Reservation cancelled successfully", "success");
          } else {
            const data = await response.json();
            showNotification(data.error || "Failed to cancel reservation", "error");
          }
        } catch (error) {
          console.error("Cancel error:", error);
          showNotification("An error occurred while cancelling", "error");
        }
      }
    });
  };

  const filteredReservations = reservations.filter(res => {
    const status = (res.status || "").toUpperCase();
    if (activeTab === "Active") return status === "RESERVED" || status === "ACTIVE";
    if (activeTab === "Completed") return status === "COMPLETED" || status === "PAID";
    if (activeTab === "Cancelled") return status === "CANCELLED";
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
            count={reservations.filter(r => {
              const s = (r.status || "").toUpperCase();
              return s === "RESERVED" || s === "ACTIVE";
            }).length} 
            active={activeTab === "Active"} 
            onClick={() => setActiveTab("Active")}
        />
        <TabItem 
            label="Completed" 
            count={reservations.filter(r => { const s = (r.status || "").toUpperCase(); return s === "COMPLETED" || s === "PAID"; }).length} 
            active={activeTab === "Completed"} 
            onClick={() => setActiveTab("Completed")}
        />
        <TabItem 
            label="Cancelled" 
            count={reservations.filter(r => (r.status || "").toUpperCase() === "CANCELLED").length} 
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
                status={res.status.toUpperCase()} 
                name={res.locationName} 
                address={res.locationAddress} 
                startTime={new Date(res.startTime)}
                endTime={new Date(res.endTime)}
                price={res.pricePerHour || "25.00"}
                image="/bole.png" 
                active={res.status.toUpperCase() === "RESERVED" || res.status.toUpperCase() === "ACTIVE"}
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

      {selectedTicket?.status?.toUpperCase() === "PAID" ? (
        <ReceiptModal 
          reservation={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      ) : (
        <TicketModal 
          reservation={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </>
  );
}

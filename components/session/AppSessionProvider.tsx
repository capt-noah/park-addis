"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface Reservation {
  id: string;
  status: string;
  locationName: string;
  locationAddress: string;
  startTime: string;
  endTime: string;
  qrToken: string;
  pricePerHour: string | null;
}

interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface SessionContextType {
  activeReservation: Reservation | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation) => void;
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Persistence for sidebar state
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsSidebarCollapsed(saved === "true");
    }
    setMounted(true);
  }, []);

  const handleSetSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  };

  const fetchActiveReservation = useCallback(async () => {
    try {
      const res = await fetch("/api/reservations/active");
      if (res.ok) {
        const data = await res.json();
        setActiveReservation(data);
      } else {
        setActiveReservation(null);
      }
    } catch (error) {
      console.error("Failed to fetch active reservation", error);
      setActiveReservation(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveReservation();
  }, [fetchActiveReservation]);

  if (!mounted) {
    return <div className="min-h-screen bg-background opacity-0" />;
  }

  return (
    <SessionContext.Provider value={{ 
      activeReservation, 
      isLoading, 
      refreshSession: fetchActiveReservation,
      userLocation,
      setUserLocation,
      selectedLocationId,
      setSelectedLocationId,
      isSidebarCollapsed,
      setIsSidebarCollapsed: handleSetSidebarCollapsed
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within an AppSessionProvider");
  }
  return context;
}

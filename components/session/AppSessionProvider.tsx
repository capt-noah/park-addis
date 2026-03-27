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
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

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

  return (
    <SessionContext.Provider value={{ 
      activeReservation, 
      isLoading, 
      refreshSession: fetchActiveReservation,
      userLocation,
      setUserLocation,
      selectedLocationId,
      setSelectedLocationId
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

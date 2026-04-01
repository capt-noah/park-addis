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
  user: any | null;
  balance: number | null;
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
  const [user, setUser] = useState<any | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
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

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch User Info
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) {
        setUser(null);
        setBalance(null);
        setActiveReservation(null);
        return;
      }
      const userData = await userRes.json();
      setUser(userData);

      // 2. Fetch Wallet Balance (only if user exists)
      if (userData.userId) {
        const walletRes = await fetch("/api/wallet");
        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setBalance(parseFloat(walletData.balance));
        }
      }

      // 3. Fetch Active Reservation
      const res = await fetch("/api/reservation/active");
      if (res.ok) {
        const data = await res.json();
        setActiveReservation(data);
      } else {
        setActiveReservation(null);
      }

    } catch (error) {
      console.error("Failed to fetch session data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  if (!mounted) {
    return <div className="min-h-screen bg-background opacity-0" />;
  }

  return (
    <SessionContext.Provider value={{ 
      user,
      balance,
      activeReservation, 
      isLoading, 
      refreshSession: fetchSession,
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

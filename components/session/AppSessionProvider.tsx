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
      
      const getSessionId = () => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; sessionId=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      }
      const sessionId = getSessionId();

      // 1. Fetch User Info
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
        credentials: "include",
        headers: {
          ...(sessionId ? { "Authorization": `Bearer ${sessionId}` } : {})
        }
      });
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
        const walletRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallet`, {
          credentials: "include",
          headers: {
            ...(sessionId ? { "Authorization": `Bearer ${sessionId}` } : {})
          }
        });
        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setBalance(parseFloat(walletData.balance));
        }
      }

      // 3. Fetch Active Reservation
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservation/active`, {
        credentials: "include",
        headers: {
          ...(sessionId ? { "Authorization": `Bearer ${sessionId}` } : {})
        }
      });
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

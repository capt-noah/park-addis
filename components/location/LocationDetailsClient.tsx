"use client";

import {
  CheckCircle2,
  MapPin,
  Zap,
  Layers,
  ShieldCheck,
  UserRound,
  Plus,
  Minus,
  Navigation,
  Radio,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ParkingLocation } from "@/types/location";
import { StatItem, AmenityItem, RuleItem, BookingWidget } from "./details";
import { useSession } from "../session/AppSessionProvider";
import { useUI } from "../ui/UIProvider";

interface LocationDetailsClientProps {
  location: ParkingLocation;
  spot: any;
  initialVehicles: any[];
}

export default function LocationDetailsClient({
  location,
  spot,
  initialVehicles,
}: LocationDetailsClientProps) {
  const router = useRouter();
  const { activeReservation, refreshSession } = useSession();
  const { showNotification, showConfirmation } = useUI();

  const [vehicles] = useState<any[]>(initialVehicles);
  const [isReserving, setIsReserving] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isArrivalTimePickerOpen, setIsArrivalTimePickerOpen] = useState(false);
  const [isExitTimePickerOpen, setIsExitTimePickerOpen] = useState(false);
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

  // Form State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [arrivalTime, setArrivalTime] = useState("10:00");
  const [exitTime, setExitTime] = useState("11:00");
  const [selectedVehicle, setSelectedVehicle] = useState<any>(
    initialVehicles[0] || null,
  );
  const [mapZoom, setMapZoom] = useState(1);

  // Fetch wallet balance on mount
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch("/api/wallet");
        if (res.ok) {
          const wallet = await res.json();
          setWalletBalance(parseFloat(wallet.balance));
        }
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
      }
    };
    fetchWallet();
  }, []);

  const RESERVATION_FEE = 20; // Fixed reservation fee in ETB

  const updateArrivalTime = (time: string) => {
    setArrivalTime(time);
    const [h, m] = time.split(":").map(Number);
    const nextH = (h + 1) % 24;
    setExitTime(
      `${nextH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
    );
  };

  const calculateTotal = () => {
    if (!spot) return 0;
    const [h1, m1] = arrivalTime.split(":").map(Number);
    const [h2, m2] = exitTime.split(":").map(Number);
    let duration = h2 + m2 / 60 - (h1 + m1 / 60);
    if (duration < 0) duration += 24;
    const price = parseFloat(spot.pricePerHour) || 25;
    return Math.max(0, parseFloat((duration * price).toFixed(2)));
  };

  const calculateDuration = () => {
    const [h1, m1] = arrivalTime.split(":").map(Number);
    const [h2, m2] = exitTime.split(":").map(Number);
    let durationInHours = h2 + m2 / 60 - (h1 + m1 / 60);
    if (durationInHours < 0) durationInHours += 24;
    return Math.max(0, durationInHours);
  };

  const handleReserve = async () => {
    if (!spot) return;

    if (!selectedVehicle) {
      showNotification("Please select a vehicle first.", "info");
      return;
    }

    if (walletBalance === null) {
      showNotification("Loading wallet balance, please wait.", "info");
      return;
    }

    if (walletBalance < RESERVATION_FEE) {
      showNotification(
        `Insufficient wallet balance. You need at least ETB ${RESERVATION_FEE} for the reservation fee.`,
        "error",
      );
      return;
    }

    const duration = calculateDuration();
    const total = calculateTotal();

    showConfirmation({
      title: "Confirm Your Reservation",
      message: `You are booking a spot at ${location.name} for ${duration.toFixed(1)} hours. The total cost will be ETB ${total.toFixed(2)}, but you'll only pay a reservation fee of ETB ${RESERVATION_FEE} now. You can cancel within 15 minutes for a full refund. Do you want to proceed?`,
      confirmText: "Confirm Booking",
      cancelText: "Review Details",
      onConfirm: async () => {
        setIsReserving(true);
        const dateStr = selectedDate.toISOString().split("T")[0];
        const start = new Date(`${dateStr}T${arrivalTime}:00`);
        let end = new Date(`${dateStr}T${exitTime}:00`);

        if (end <= start) {
          end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
        }

        try {
          if (activeReservation) {
            showNotification(
              "You already have an active parking session. Please complete it before booking a new one.",
              "error",
            );
            return;
          }

          // 1. Create reservation
          const res = await fetch("/api/reservation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              spotId: spot.id,
              vehicleId: selectedVehicle.id,
              startTime: start.toISOString(),
              endTime: end.toISOString(),
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            showNotification(
              data.error || "Failed to create reservation",
              "error",
            );
            return;
          }

          const reservationData = await res.json();
          const reservationId = reservationData.reservedSpot.id;

          // 2. Pay reservation fee
          const paymentRes = await fetch("/api/wallet/pay/reservation-fee", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reservationId,
              amount: RESERVATION_FEE.toString(),
            }),
          });

          if (!paymentRes.ok) {
            const paymentData = await paymentRes.json();
            showNotification(
              paymentData.error || "Failed to pay reservation fee",
              "error",
            );
            // Optionally cancel the reservation if payment fails
            return;
          }

          const paymentData = await paymentRes.json();
          setWalletBalance(parseFloat(paymentData.balance));

          await refreshSession();
          showNotification(
            "Reservation successful! Reservation fee paid.",
            "success",
          );
          router.push("/reservations");
        } catch (err) {
          console.error("Reservation error:", err);
          showNotification("An unexpected error occurred.", "error");
        } finally {
          setIsReserving(false);
        }
      },
    });
  };

  const closeAllDropdowns = () => {
    setIsDatePickerOpen(false);
    setIsArrivalTimePickerOpen(false);
    setIsExitTimePickerOpen(false);
    setIsVehicleDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Navbar userStatus={true} />

      <main className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="relative h-[340px] md:h-[380px] w-full rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl shadow-emerald-900/5 group border border-border/50 bg-gradient-to-br from-card via-card/95 to-muted/40 flex flex-col justify-center items-center text-center p-8">
            {/* Ambient Technical Transit Pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              <svg className="w-full h-full opacity-[0.14] dark:opacity-[0.20]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="hub-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
                    <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-primary/60" />
                  </pattern>
                  <radialGradient id="hub-radial-glow" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#hub-grid)" />
                <circle cx="50%" cy="50%" r="50%" fill="url(#hub-radial-glow)" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
            </div>

            <div className="relative z-20 max-w-3xl flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary dark:text-emerald-400 rounded-full text-xs font-bold mb-4 border border-primary/20 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4" /> Official Verified Smart Hub
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3 tracking-tight">
                {location.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground font-semibold text-sm sm:text-base mb-6">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{location.address}</span>
              </div>

              {/* Live Hub Features Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="px-3 py-1 bg-card/90 backdrop-blur-md rounded-xl text-xs font-mono font-bold text-foreground border border-border shadow-sm">
                  ⚡ FAST-PASS 0.2s Gate
                </span>
                <span className="px-3 py-1 bg-card/90 backdrop-blur-md rounded-xl text-xs font-mono font-bold text-foreground border border-border shadow-sm">
                  🛡 24/7 CCTV & Security
                </span>
                <span className="px-3 py-1 bg-card/90 backdrop-blur-md rounded-xl text-xs font-mono font-bold text-foreground border border-border shadow-sm">
                  📍 Addis Ababa
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem label="Status" value="Open Now" active />
                <StatItem
                  label="Rate"
                  value={`${spot?.pricePerHour || location.price} ETB`}
                  sub="/hr"
                />
                <StatItem
                  label="Capacity"
                  value={`${spot?.totalSlots || 150} Spots`}
                />
                <StatItem label="Rating" value={`${location.rating}`} />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-6">
                  About this location
                </h2>
                <p className="text-muted-foreground font-medium leading-[1.8] text-lg max-w-3xl">
                  Secure parking located in {location.address.split(",")[0]}.
                  Ideal for visitors to surrounding business centers. Features
                  wide parking bays suitable for all vehicles and security
                  monitoring.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-8">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AmenityItem
                    icon={<Zap className="w-5 h-5 text-primary" />}
                    label="EV Charging Available"
                  />
                  <AmenityItem
                    icon={<ShieldCheck className="w-5 h-5 text-primary" />}
                    label="24/7 CCTV Surveillance"
                  />
                  <AmenityItem
                    icon={<UserRound className="w-5 h-5 text-primary" />}
                    label="Disability Access"
                  />
                  <AmenityItem
                    icon={<Layers className="w-5 h-5 text-primary" />}
                    label="Covered Parking"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-6 font-primary">
                  Parking Rules
                </h2>
                <ul className="space-y-4">
                  <RuleItem text="Max height clearance is 2.1 meters." />
                  <RuleItem text="Overnight parking requires prior registration." />
                  <RuleItem text="No hazardous materials allowed." />
                </ul>
              </div>

              {/* Interactive Vector Radar Map View */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                      Location Telemetry
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      PRECISION URBAN MOBILITY RADAR • {location.name.toUpperCase()}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.name}, ${location.address}, Addis Ababa`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted hover:border-primary/40 transition-colors shadow-sm"
                  >
                    <span>Open in Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                  </a>
                </div>

                <div className="h-[420px] w-full bg-slate-950 rounded-[2.5rem] border border-border/80 overflow-hidden relative shadow-2xl flex items-center justify-center select-none group">
                  {/* Radar Grid Canvas */}
                  <div
                    className="absolute inset-0 transition-transform duration-500 ease-out flex items-center justify-center pointer-events-none"
                    style={{ transform: `scale(${mapZoom})` }}
                  >
                    {/* SVG Concentric Rings and Crosshairs */}
                    <svg
                      className="w-[600px] h-[600px] text-emerald-500/20"
                      viewBox="0 0 600 600"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Grid Pattern */}
                      <defs>
                        <pattern id="radar-subgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500/10" />
                        </pattern>
                        <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="60%" stopColor="#10b981" stopOpacity="0.05" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </radialGradient>
                      </defs>

                      <rect width="600" height="600" fill="url(#radar-subgrid)" />
                      <circle cx="300" cy="300" r="280" fill="url(#radar-glow)" />

                      {/* Concentric Clearance Ranges */}
                      <circle cx="300" cy="300" r="240" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-emerald-500/20" />
                      <circle cx="300" cy="300" r="180" stroke="currentColor" strokeWidth="1" className="text-emerald-500/30" />
                      <circle cx="300" cy="300" r="120" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-emerald-500/40" />
                      <circle cx="300" cy="300" r="60" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500/60" />

                      {/* Axes */}
                      <line x1="300" y1="20" x2="300" y2="580" stroke="currentColor" strokeWidth="1" className="text-emerald-500/25" />
                      <line x1="20" y1="300" x2="580" y2="300" stroke="currentColor" strokeWidth="1" className="text-emerald-500/25" />

                      {/* Cardinal markers */}
                      <text x="305" y="40" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">N 000°</text>
                      <text x="545" y="295" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">E 090°</text>
                      <text x="305" y="575" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">S 180°</text>
                      <text x="30" y="295" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">W 270°</text>

                      {/* Range annotations */}
                      <text x="308" y="185" fill="#6ee7b7" fontSize="9" fontFamily="monospace" opacity="0.6">100m</text>
                      <text x="308" y="245" fill="#6ee7b7" fontSize="9" fontFamily="monospace" opacity="0.6">50m</text>

                      {/* Simulated Ingress Vector Lane */}
                      <path
                        d="M 120 420 Q 220 380 300 300"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        fill="none"
                        className="animate-pulse"
                      />
                      <polygon points="296,303 302,297 305,306" fill="#10b981" />
                    </svg>
                  </div>

                  {/* Top Address & Telemetry HUD */}
                  <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-500/30 shadow-xl flex items-center gap-2.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white tracking-wide">
                          {location.name}
                        </p>
                        <p className="text-[10px] font-mono text-emerald-400">
                          {location.address}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>IOT ULTRASONIC SENSORS ONLINE</span>
                    </div>
                  </div>

                  {/* Center Target Hub Pin */}
                  <div className="relative z-10 flex flex-col items-center pointer-events-none">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center rounded-2xl shadow-2xl shadow-emerald-500/50 border-4 border-slate-950 text-white font-black text-xl animate-bounce-slow">
                        P
                      </div>
                      <div className="absolute -inset-2 rounded-2xl border-2 border-emerald-400/50 animate-ping opacity-30 pointer-events-none" />
                    </div>
                    <div className="mt-2.5 bg-slate-900/95 border border-emerald-500/40 px-3 py-1 rounded-full shadow-lg">
                      <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
                        FAST-PASS CLEARANCE GATE
                      </span>
                    </div>
                  </div>

                  {/* Bottom Telemetry & Navigation Controls */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-3">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        LAT {(location.lat ?? 9.0222).toFixed(4)}° N • LNG {(location.lng ?? 38.7468).toFixed(4)}° E
                      </span>
                    </div>

                    {/* Interactive Zoom Controls */}
                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => setMapZoom((prev) => Math.min(1.5, prev + 0.15))}
                        aria-label="Zoom in radar"
                        className="w-9 h-9 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl shadow-lg flex items-center justify-center transition-colors active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMapZoom((prev) => Math.max(0.8, prev - 0.15))}
                        aria-label="Zoom out radar"
                        className="w-9 h-9 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl shadow-lg flex items-center justify-center transition-colors active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <BookingWidget
                calculateTotal={calculateTotal}
                calculateDuration={calculateDuration}
                isReserving={isReserving}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                arrivalTime={arrivalTime}
                updateArrivalTime={updateArrivalTime}
                exitTime={exitTime}
                setExitTime={setExitTime}
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                vehicles={vehicles}
                spot={spot}
                location={location}
                handleReserve={handleReserve}
                isDatePickerOpen={isDatePickerOpen}
                setIsDatePickerOpen={setIsDatePickerOpen}
                isArrivalTimePickerOpen={isArrivalTimePickerOpen}
                setIsArrivalTimePickerOpen={setIsArrivalTimePickerOpen}
                isExitTimePickerOpen={isExitTimePickerOpen}
                setIsExitTimePickerOpen={setIsExitTimePickerOpen}
                isVehicleDropdownOpen={isVehicleDropdownOpen}
                setIsVehicleDropdownOpen={setIsVehicleDropdownOpen}
                closeAllDropdowns={closeAllDropdowns}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ParkingCircle(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 17V7h4a3 3 0 1 1 0 6H9" />
    </svg>
  );
}

"use client";

import { CheckCircle2, MapPin, Zap, Layers, ShieldCheck, UserRound, Plus, Minus} from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParkingLocation } from "@/types/location";
import {
  StatItem,
  AmenityItem,
  RuleItem,
  BookingWidget,
} from "./details";
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

    const duration = calculateDuration();
    const total = calculateTotal();
    
    showConfirmation({
      title: "Confirm Your Reservation",
      message: `You are booking a spot at ${location.name} for ${duration.toFixed(1)} hours. The total cost will be ETB ${total.toFixed(2)}. Do you want to proceed?`,
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
            showNotification("You already have an active parking session. Please complete it before booking a new one.", "error");
            return;
          }

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

          if (res.ok) {
            await refreshSession();
            showNotification("Reservation successful!", "success");
            router.push("/reservations");
          } else {
            const data = await res.json();
            showNotification(data.error || "Failed to create reservation", "error");
          }
        } catch (err) {
          console.error("Reservation error:", err);
          showNotification("An unexpected error occurred.", "error");
        } finally {
          setIsReserving(false);
        }
      }
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
          <div className="relative h-[450px] w-full rounded-[3rem] overflow-hidden mb-12 shadow-2xl shadow-emerald-900/5 group">
            <Image
              src="/map-light.png"
              alt="Map Light"
              fill
              className="object-cover opacity-20 dark:hidden"
            />
            <Image
              src="/map-dark.png"
              alt="Map Dark"
              fill
              className="object-cover opacity-20 hidden dark:block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

            <div className="absolute inset-x-0 bottom-0 p-12 z-20 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold mb-6 border border-primary/20 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4" /> Verified Location
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
                {location.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground font-bold">
                <MapPin className="w-5 h-5 text-muted-foreground/60" />{" "}
                {location.address}
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-card rounded-[2rem] border border-border shadow-2xl p-2 z-15 rotate-1">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative border border-border flex items-center justify-center bg-primary/5">
                <Image
                  src={location.image}
                  alt="Parking"
                  fill
                  className="object-cover opacity-90"
                />
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

              {/* Map View */}
              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-8">
                  Location
                </h2>
                <div className="h-[400px] w-full bg-muted rounded-[2.5rem] border border-border overflow-hidden relative">
                  <Image
                    src="/map-light.png"
                    alt="Mini Map Light"
                    fill
                    className="object-cover opacity-50 dark:hidden"
                  />
                  <Image
                    src="/map-dark.png"
                    alt="Mini Map Dark"
                    fill
                    className="object-cover opacity-30 hidden dark:block"
                  />
                  <div className="absolute top-6 left-6 bg-card px-5 py-2.5 rounded-2xl shadow-xl font-bold text-sm text-foreground border border-border">
                    {location.address}
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-[1.5rem] shadow-2xl shadow-primary/50 border-[6px] border-card animate-bounce-slow">
                      <ParkingCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="absolute right-6 bottom-6 flex flex-col gap-2">
                    <button className="w-10 h-10 bg-card rounded-xl shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="w-10 h-10 bg-card rounded-xl shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    </button>
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

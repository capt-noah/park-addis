import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react";
import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LiveParkingRadar } from "@/components/home/LiveParkingRadar";
import { HomeSearchInput } from "@/components/home/HomeSearchInput";

export default async function Home() {
  const cookie = await cookies();
  const sessionId = cookie.get("sessionId")?.value;
  let userStatus: boolean = false;

  if (sessionId) {
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:1000";
    try {
      const userRes = await fetch(`${backendUrl}/api/auth/me`, {
        headers: { Cookie: `sessionId=${sessionId}` },
        cache: "no-store",
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.id || userData.userId) userStatus = true;
      }
    } catch {
      // Backend offline in development; fall back to guest state
    }
  }

  return (
    <>
      <Navbar userStatus={userStatus} />

      <main className="min-h-screen pt-20 bg-background text-foreground transition-colors duration-300">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: MINIMALIST URBAN PARKING COMMAND                         */}
        {/* ========================================================================= */}
        <section className="relative w-full px-6 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-border/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Minimal Headline & Search */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              
              {/* Bold Display Headline (No pill above, no description below) */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black tracking-tight leading-[1.08] text-foreground mb-8">
                Precision Parking in Addis Ababa.
              </h1>

              {/* Search & Fast Sub-city Shortcuts */}
              <div className="w-full space-y-4 mb-4">
                <HomeSearchInput />

                {/* Popular Destination Shortcuts */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-xs font-mono text-muted-foreground mr-1">Popular:</span>
                  <Link
                    href="/locations?selected=Bole"
                    className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-foreground border border-border/70 transition-colors font-medium text-xs"
                  >
                    Bole · 45 ETB/h
                  </Link>
                  <Link
                    href="/locations?selected=Kazanchis"
                    className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-foreground border border-border/70 transition-colors font-medium text-xs"
                  >
                    Kazanchis · 50 ETB/h
                  </Link>
                  <Link
                    href="/locations?selected=Meskel"
                    className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-foreground border border-border/70 transition-colors font-medium text-xs"
                  >
                    Meskel Sq. · 60 ETB/h
                  </Link>
                  <Link
                    href="/locations?selected=Piassa"
                    className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-foreground border border-border/70 transition-colors font-medium text-xs"
                  >
                    Piassa · 30 ETB/h
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Column: Clean Telemetry Deck */}
            <div className="lg:col-span-6 flex items-center justify-center w-full">
              <LiveParkingRadar />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. HOW IT WORKS (SIMPLE & MINIMALIST)                                     */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto border-b border-border/50">
          <div className="mb-14">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border border-border/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-muted-foreground mb-4 block">
                  01
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Find
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Search open parking bays in your destination area on the map.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-muted-foreground mb-4 block">
                  02
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Reserve
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Hold your space in advance with a single tap.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-muted-foreground mb-4 block">
                  03
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Park
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The automated barrier gate lifts as your vehicle arrives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PRIME LOCATIONS (ICON SECTION INSTEAD OF IMAGES)                        */}
        {/* ========================================================================= */}
        <section id="locations" className="py-24 px-6 max-w-7xl mx-auto border-b border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-14">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Prime Locations
            </h2>
            <Link
              href="/locations"
              className="text-primary font-bold text-sm flex items-center gap-1.5 hover:underline"
            >
              <span>View all on map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PrimeLocationCard
              name="Bole Medhanealem Hub"
              location="Bole · Atlas / Medhanealem"
              rating={4.8}
              spots={42}
              totalSpots={60}
              price={45}
            />
            <PrimeLocationCard
              name="Meskel Square Underground"
              location="Kirkos · Exhibition / Stadium"
              rating={4.7}
              spots={12}
              totalSpots={120}
              price={60}
            />
            <PrimeLocationCard
              name="Piassa Heritage Center"
              location="Arada · Churchill"
              rating={4.5}
              spots={85}
              totalSpots={150}
              price={30}
            />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MINIMALIST CONVERSION BANNER                                           */}
        {/* ========================================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="rounded-2xl bg-muted/40 border border-border/80 p-10 sm:p-14 text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Never circle for parking in Addis Ababa again.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              Join drivers across Addis Ababa saving time every day. Reserve your first space in seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/register"
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs hover:opacity-95 transition-opacity"
              >
                Create Account
              </Link>
              <Link
                href="/locations"
                className="border border-border bg-card hover:bg-muted text-foreground px-6 py-3 rounded-xl font-bold text-xs transition-colors"
              >
                Open Map
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

function PrimeLocationCard({
  name,
  location,
  rating,
  spots,
  totalSpots,
  price,
}: {
  name: string;
  location: string;
  rating: number;
  spots: number;
  totalSpots: number;
  price: number;
}) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/80 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        {/* Clean Icon Section (Replaces photo/matrix image completely) */}
        <div className="h-40 w-full bg-muted/30 border-b border-border/60 flex items-center justify-center select-none">
          <div className="w-14 h-14 rounded-2xl bg-card border border-border/80 flex items-center justify-center text-primary shadow-xs">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold text-foreground tracking-tight">{name}</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{rating}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            {location}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-border/60">
            <div>
              <p className="text-[11px] font-mono text-muted-foreground uppercase">Open bays</p>
              <p className="text-sm font-bold text-foreground font-mono mt-0.5">
                {spots} <span className="text-xs font-normal text-muted-foreground">/ {totalSpots}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-muted-foreground uppercase">Rate</p>
              <p className="text-sm font-bold text-foreground font-mono mt-0.5">
                ETB {price}
                <span className="text-xs font-normal text-muted-foreground">/hr</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link
          href={`/locations?selected=${encodeURIComponent(name.split(" ")[0])}`}
          className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
        >
          <span>Reserve Space</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

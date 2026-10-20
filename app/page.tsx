import Link from "next/link";
import {
  MapPin,
  CheckCircle2,
  Zap,
  ArrowRight,
  Star,
  QrCode,
  ShieldCheck,
  Smartphone,
  Gauge,
  Clock,
  Sparkles,
  Layers,
  Compass,
  CreditCard,
  Radio,
  Building2,
  Car,
  Activity,
  SlidersHorizontal,
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
      // Backend might be offline in development; fall back to guest state
    }
  }

  return (
    <>
      <Navbar userStatus={userStatus} />

      <main className="min-h-screen pt-20 bg-background text-foreground transition-colors duration-300">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: PRECISION URBAN MOBILITY COMMAND                         */}
        {/* ========================================================================= */}
        <section className="relative w-full overflow-hidden px-6 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border/50">
          {/* Subtle architectural ambient background grid */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <svg className="w-full h-full opacity-[0.08] dark:opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-pattern-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
                  <circle cx="24" cy="24" r="1.5" fill="currentColor" className="text-primary/50" />
                </pattern>
                <radialGradient id="hero-glow" cx="25%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pattern-grid)" />
              <circle cx="30%" cy="40%" r="50%" fill="url(#hero-glow)" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-0" />
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center relative z-10">
            
            {/* Left Column: Authoritative Mobility Positioning */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              
              {/* Telemetry Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 text-primary dark:text-emerald-400 rounded-full text-xs font-mono font-bold mb-6 border border-primary/20 backdrop-blur-sm shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>ADDIS ABABA SMART GRID • 12,400+ BAYS ONLINE</span>
              </div>

              {/* Bold Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black tracking-tight leading-[1.06] text-foreground mb-6 font-sans">
                Precision Parking in Addis Ababa.{" "}
                <span className="text-primary dark:text-emerald-400">Guaranteed Before You Arrive.</span>
              </h1>

              {/* Subtext */}
              <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed max-w-xl mb-8">
                Continuous ultrasonic sensor telemetry across Bole, Kazanchis, Meskel Square, and Piassa. Hold your bay with 1-tap Chapa or Telebirr deduction and glide through automated optical barrier gates.
              </p>

              {/* Unified Mobility Command Bar */}
              <div className="w-full space-y-3 mb-8">
                <HomeSearchInput />

                {/* Popular Destination Fast Chips with live ETB tariffs */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    Quick Hubs:
                  </span>
                  <Link
                    href="/locations?selected=Bole"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card hover:bg-muted text-foreground border border-border/80 transition-all font-semibold shadow-xs"
                  >
                    <span>Bole Medhanealem</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">45 ETB/h</span>
                  </Link>
                  <Link
                    href="/locations?selected=Kazanchis"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card hover:bg-muted text-foreground border border-border/80 transition-all font-semibold shadow-xs"
                  >
                    <span>Kazanchis</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">50 ETB/h</span>
                  </Link>
                  <Link
                    href="/locations?selected=Meskel"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card hover:bg-muted text-foreground border border-border/80 transition-all font-semibold shadow-xs"
                  >
                    <span>Meskel Sq.</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">60 ETB/h</span>
                  </Link>
                  <Link
                    href="/locations?selected=Piassa"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card hover:bg-muted text-foreground border border-border/80 transition-all font-semibold shadow-xs"
                  >
                    <span>Piassa</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">30 ETB/h</span>
                  </Link>
                </div>
              </div>

              {/* Commuter Trust & Metric Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/60 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span><strong>45,000+</strong> DRIVERS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span><strong>99.8%</strong> HOLD SLA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span><strong>0.2s</strong> FAST-PASS GATE</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Addis Transit Telemetry Deck */}
            <div className="lg:col-span-6 relative flex items-center justify-center w-full">
              <LiveParkingRadar />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. NATIONAL PAYMENT & MOBILITY RAILS (AUTHENTIC ETHIOPIAN PARTNERS)        */}
        {/* ========================================================================= */}
        <section className="py-8 px-6 border-b border-border/50 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold shrink-0">
                Official Settlement & Infrastructure Rails
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                {/* Telebirr */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 shadow-xs">
                  <div className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                    t
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-tight text-foreground">telebirr</span>
                    <span className="hidden sm:inline text-[9px] text-muted-foreground ml-1.5 font-mono">ETHIO TELECOM</span>
                  </div>
                </div>

                {/* Chapa */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 shadow-xs">
                  <div className="w-5 h-5 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">
                    ⚡
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-tight text-foreground">Chapa</span>
                    <span className="hidden sm:inline text-[9px] text-muted-foreground ml-1.5 font-mono">FINTECH</span>
                  </div>
                </div>

                {/* Commercial Bank of Ethiopia (CBE Birr) */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 shadow-xs">
                  <div className="w-5 h-5 rounded-lg bg-purple-700 flex items-center justify-center text-white text-[9px] font-black">
                    CBE
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-tight text-foreground">CBE Birr</span>
                    <span className="hidden sm:inline text-[9px] text-muted-foreground ml-1.5 font-mono">DIRECT DEBIT</span>
                  </div>
                </div>

                {/* Awash Bank */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 shadow-xs">
                  <div className="w-5 h-5 rounded-lg bg-amber-600 flex items-center justify-center text-white text-[9px] font-black">
                    A
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-tight text-foreground">Awash Birr</span>
                    <span className="hidden sm:inline text-[9px] text-muted-foreground ml-1.5 font-mono">PAY</span>
                  </div>
                </div>

                {/* Addis Ababa Transport Bureau */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 shadow-xs">
                  <div className="w-5 h-5 rounded-lg bg-emerald-800 flex items-center justify-center text-white text-[9px] font-black">
                    TMA
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-tight text-foreground">Addis Transport Bureau</span>
                    <span className="hidden sm:inline text-[9px] text-emerald-600 dark:text-emerald-400 ml-1.5 font-mono">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. STEPPED TRANSIT PROGRESSION (HOW IT WORKS)                              */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary dark:text-emerald-400 text-xs font-mono font-bold mb-3">
                TRANSIT WORKFLOW
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                Get Parked in 3 Seamless Phases.
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium mt-3">
                Eliminate circling congestion. We replaced paper ticket stubs and coin kiosks with ultrasonic bay sensors, digital passes, and instant per-minute wallet reconciliation.
              </p>
            </div>

            <Link
              href="/locations"
              className="inline-flex items-center gap-2 text-primary dark:text-emerald-400 font-bold text-sm hover:underline shrink-0"
            >
              <span>Explore full map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Phase 01 */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-mono font-black text-lg border border-primary/20">
                    01
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">
                    Discovery
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                  Spatial Ultrasonic Discovery
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Search live hubs on our interactive map. Ultrasonic overhead sensors refresh slot availability every 3 seconds across Bole, Kazanchis, and Piassa.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>RADAR REFRESH</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">3.0s INTERVAL</span>
              </div>
            </div>

            {/* Phase 02 */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-black text-lg border border-emerald-500/20">
                    02
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">
                    Reservation
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                  Cryptographic Bay Hold
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Lock your bay with 1-tap wallet deduction via Chapa or Telebirr. Your parking spot is held in the central ledger and physically reserved until you arrive.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>PAYMENT RAILS</span>
                <span className="text-primary font-bold">CHAPA · TELEBIRR</span>
              </div>
            </div>

            {/* Phase 03 */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-mono font-black text-lg border border-teal-500/20">
                    03
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">
                    Clearance
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                  FAST-PASS 0.2s Clearance
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Drive up to the barrier arm. High-speed optical ANPR plate recognition or your dynamic digital pass triggers the gate automatically. Zero ticket paper.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>GATE RESPONSE</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">0.2s OPTICAL LIFT</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ASYMMETRIC BENTO GRID: URBAN MOBILITY ARCHITECTURE                     */}
        {/* ========================================================================= */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary dark:text-emerald-400 text-xs font-mono font-bold mb-3">
              INFRASTRUCTURE STACK
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Engineered for Zero-Friction Transit.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium mt-3">
              Every parking bay connected to central optical cameras, ultrasonic telemetry, and national settlement rails across Addis Ababa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tile 1: Live City Spot Radar (Span 2 Columns) */}
            <div className="md:col-span-2 bg-card border border-border rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="space-y-4 max-w-lg mb-8 z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  Ultrasonic Bay Radar & Turn-by-Turn Corridor
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Continuous sensor telemetry monitors 12,400+ spaces across Addis Ababa. Filter by sub-city, distance, tariff, and EV charging, then navigate directly to your reserved stall.
                </p>
              </div>

              {/* Dynamic telemetry status board */}
              <div className="bg-muted/40 dark:bg-slate-950/50 border border-border/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-card rounded-xl border border-border/60">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-bold text-foreground">Bole Medhanealem</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">42 Free</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-2">70% LOAD • HIGH INGRESS</p>
                </div>

                <div className="p-3 bg-card rounded-xl border border-border/60">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-bold text-foreground">Kazanchis UNECA</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">18 Free</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-1/2 rounded-full" />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-2">51% LOAD • MODERATE</p>
                </div>

                <div className="p-3 bg-card rounded-xl border border-border/60">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-bold text-foreground">Meskel Square</span>
                    <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">12 Free</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-4/5 rounded-full" />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-2">80% LOAD • UNDERGROUND</p>
                </div>
              </div>
            </div>

            {/* Tile 2: 1-Tap QR Gate Clearance (Span 1 Column) */}
            <div className="bg-card border border-border rounded-3xl p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group">
              <div className="space-y-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold border border-teal-500/20">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  FAST-PASS Optical Lift
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Optical ANPR plate cameras detect your registration or scan your encrypted QR ticket to lift barrier arms in 0.2 seconds.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-slate-950/60 border border-border/60 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-2.5 bg-card rounded-xl border border-border shadow-xs">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono font-bold text-foreground truncate">PASS #ADD-8841</p>
                  <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">VERIFIED VALID</p>
                </div>
              </div>
            </div>

            {/* Tile 3: Digital Wallet Settlement (Span 1 Column) */}
            <div className="bg-card border border-border rounded-3xl p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group">
              <div className="space-y-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Instant Multi-Rail Wallet
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Top up seamlessly via Chapa, Telebirr, or CBE Birr. Exact per-minute fees calculated and settled automatically upon exit.
                </p>
              </div>

              <div className="bg-muted/50 dark:bg-slate-950/60 border border-border/60 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-mono">WALLET BALANCE</span>
                  <span className="font-bold text-foreground font-mono">ETB 450.00</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-border/40">
                  <span className="text-muted-foreground font-mono">AUTOPAY STATUS</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Tile 4: Hardware Precision Telemetry (Span 2 Columns) */}
            <div className="md:col-span-2 bg-card border border-border rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group">
              <div className="space-y-4 max-w-lg mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
                  <Gauge className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  Guaranteed Bay Reservation SLA
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  When you reserve, your space is locked in the central server. Physical indicator lights over the bay turn red to hold your spot until your vehicle arrives.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60 text-center">
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-black text-primary dark:text-emerald-400 font-mono">99.8%</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-1">HOLD ACCURACY</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-black text-foreground font-mono">0.2s</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-1">GATE LIFT SPEED</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-black text-foreground font-mono">24/7</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-1">SECURITY PATROL</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">0 min</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-1">CIRCLING TIME</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FEATURED PRIME HUBS IN ADDIS ABABA                                     */}
        {/* ========================================================================= */}
        <section id="locations" className="py-24 px-6 bg-muted/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary dark:text-emerald-400 text-xs font-mono font-bold mb-3">
                  VERIFIED SMART FACILITIES
                </div>
                <h2 className="text-3xl font-black text-foreground tracking-tight">
                  Prime Locations Across Addis Ababa
                </h2>
                <p className="text-muted-foreground font-medium text-sm sm:text-base mt-2">
                  High-capacity parking facilities verified for 24/7 security, EV charging, and fast access.
                </p>
              </div>
              <Link
                href="/locations"
                className="text-primary dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all group shrink-0"
              >
                <span>View all locations on map</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PrimeLocationCard
                code="HUB-01"
                subcity="BOLE"
                name="Bole Medhanealem Hub"
                location="Bole Sub-City · Atlas / Medhanealem"
                rating={4.8}
                spots={42}
                totalSpots={60}
                price={45}
                status="Open · High Capacity"
                tag="EV Ready"
                features={["⚡ EV Fast Charge", "🛡 ANPR Gate", "📹 24/7 CCTV"]}
                occupiedPattern={[false, true, false, false, true, false, true, false]}
              />
              <PrimeLocationCard
                code="HUB-02"
                subcity="KIRKOS"
                name="Meskel Square Underground"
                location="Kirkos · Exhibition / Stadium"
                rating={4.7}
                spots={12}
                totalSpots={120}
                price={60}
                status="Covered & Monitored"
                tag="Underground Vault"
                features={["☂ 100% Covered", "🚇 Metro Access", "🔒 Guarded"]}
                occupiedPattern={[true, true, true, false, true, true, true, false]}
              />
              <PrimeLocationCard
                code="HUB-03"
                subcity="ARADA"
                name="Piassa Heritage Center"
                location="Arada · Gold Souk / Churchill"
                rating={4.5}
                spots={85}
                totalSpots={150}
                price={30}
                status="Multi-Level Facility"
                tag="Multi-Deck"
                features={["🚙 Wide Stalls", "🏷 Multi-Deck", "⚡ Fast-Exit"]}
                occupiedPattern={[false, false, true, false, false, true, false, false]}
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CITY IMPACT METRICS TICKER                                             */}
        {/* ========================================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-border/60">
            <div className="text-center p-4">
              <p className="text-3xl sm:text-5xl font-black text-primary dark:text-emerald-400 mb-2 font-mono">14 min</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Average time saved per driver trip</p>
            </div>
            <div className="text-center p-4 pt-8 md:pt-4">
              <p className="text-3xl sm:text-5xl font-black text-foreground mb-2 font-mono">12,400+</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Connected smart parking slots</p>
            </div>
            <div className="text-center p-4 pt-8 md:pt-4">
              <p className="text-3xl sm:text-5xl font-black text-foreground mb-2 font-mono">99.8%</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Guaranteed booking fulfillment</p>
            </div>
            <div className="text-center p-4 pt-8 md:pt-4">
              <p className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-2 font-mono">45,000+</p>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Active commuters in Addis</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. HIGH-END CONVERSION BANNER                                             */}
        {/* ========================================================================= */}
        <section className="py-16 px-6 max-w-7xl mx-auto mb-16">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-10 sm:p-16 overflow-hidden shadow-2xl border border-emerald-500/25">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono font-semibold mb-6 border border-white/15 text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TRANSIT PASS MEMBERSHIP</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.08] mb-6">
                Never circle for parking in Addis Ababa again.
              </h2>

              <p className="text-emerald-100/80 text-base sm:text-lg font-medium leading-relaxed mb-10">
                Join 45,000+ drivers saving fuel and eliminating traffic bottlenecks every day. Reserve your guaranteed space in under 60 seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Link
                  href="/register"
                  className="bg-white text-emerald-950 px-8 py-4 rounded-xl font-bold text-sm hover:bg-emerald-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/locations"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-7 py-4 rounded-xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center text-center"
                >
                  Open Live Map
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

function PrimeLocationCard({
  code,
  subcity,
  name,
  location,
  rating,
  spots,
  totalSpots,
  price,
  status,
  tag,
  features,
  occupiedPattern,
}: {
  code: string;
  subcity: string;
  name: string;
  location: string;
  rating: number;
  spots: number;
  totalSpots: number;
  price: number;
  status: string;
  tag: string;
  features: string[];
  occupiedPattern: boolean[];
}) {
  const percentOccupied = Math.round(((totalSpots - spots) / totalSpots) * 100);

  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
      <div>
        {/* Smart Facility Header Graphic */}
        <div className="relative h-60 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/80 p-5 flex flex-col justify-between text-white border-b border-border/40 select-none">
          {/* Subtle geometric blueprint grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Row: Hub Code & Live Status */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-emerald-300 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{code}</span>
              <span className="text-white/40">/</span>
              <span>{subcity}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{spots} VACANT</span>
            </div>
          </div>

          {/* Center Graphic: Smart Parking Bay Live Matrix */}
          <div className="relative z-10 my-auto py-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-2 px-1">
                <span>INGRESS LANE ↑</span>
                <span className="text-emerald-400 font-bold">FAST-PASS 0.2s</span>
              </div>
              {/* 8-slot interactive micro-grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {occupiedPattern.map((isOccupied, idx) => (
                  <div
                    key={idx}
                    className={`h-7 rounded-md border flex items-center justify-center font-mono text-[9px] font-bold transition-all ${
                      isOccupied
                        ? "bg-slate-800/80 border-slate-700/60 text-slate-500"
                        : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-xs shadow-emerald-500/20"
                    }`}
                  >
                    {isOccupied ? "BUSY" : `P-0${idx + 1}`}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Feature Chips & Tag */}
          <div className="relative z-10 flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {features.map((feat, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-white/5 backdrop-blur-md rounded-md text-[9px] font-mono text-slate-300 border border-white/10"
                >
                  {feat}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">
              {tag}
            </span>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-foreground tracking-tight">{name}</h3>
            <div className="flex items-center gap-1 text-xs font-bold text-foreground bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium mb-6">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-muted/50 rounded-xl border border-border/60">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Available Bays
                </p>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {100 - percentOccupied}% free
                </span>
              </div>
              <p className="text-sm font-bold text-foreground font-mono">
                {spots} <span className="text-xs text-muted-foreground font-normal">/ {totalSpots}</span>
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl border border-border/60">
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-0.5">
                Tariff
              </p>
              <p className="text-sm font-bold text-primary dark:text-emerald-400 font-mono">
                ETB {price}
                <span className="text-[10px] text-muted-foreground font-normal">/hr</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link
          href={`/locations?selected=${encodeURIComponent(name.split(" ")[0])}`}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
        >
          <span>Reserve Space</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

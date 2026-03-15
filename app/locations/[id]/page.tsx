"use client";

import { CheckCircle2, MapPin, Zap, Layers, ShieldCheck, UserRound, Calendar,Clock,Car,ChevronDown,ArrowRight,Info,Navigation,Plus, Minus} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LocationDetailsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Image Section */}
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
                <CheckCircle2 className="w-4 h-4" />
                Verified Location
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
                Bole Medhanialem Central Parking
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground font-bold">
                <MapPin className="w-5 h-5 text-muted-foreground/60" />
                Cameroon Street, Bole, Addis Ababa
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-card rounded-[2rem] border border-border shadow-2xl p-2 z-15 rotate-1">
               <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative border border-border flex items-center justify-center bg-primary/5">
                  <Image src="/bole.png" alt="Parking" fill className="object-cover opacity-90" />
                  <div className="absolute inset-0 bg-primary/5" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Info */}
            <div className="lg:col-span-2 space-y-12">
              {/* Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <StatItem label="Status" value="Open Now" active />
                 <StatItem label="Rate" value="25 ETB" sub="/hr" />
                 <StatItem label="Capacity" value="150 Spots" />
                 <StatItem label="Distance" value="0.8 km" />
              </div>

              {/* About section */}
              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-6">About this location</h2>
                <p className="text-muted-foreground font-medium leading-[1.8] text-lg max-w-3xl">
                  Secure underground parking located in the heart of Bole. Ideal for visitors to Edna Mall and surrounding business centers. Features wide parking bays suitable for SUVs and 24/7 security monitoring. Easy access from the main road with dedicated entry and exit lanes to minimize congestion.
                </p>
              </div>

              {/* Features grid */}
              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-8">Features & Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Amenity icon={<Zap className="w-5 h-5 text-primary" />} label="EV Charging Available" />
                  <Amenity icon={<ShieldCheck className="w-5 h-5 text-primary" />} label="24/7 CCTV Surveillance" />
                  <Amenity icon={<UserRound className="w-5 h-5 text-primary" />} label="Disability Access" />
                  <Amenity icon={<Layers className="w-5 h-5 text-primary" />} label="Covered Parking" />
                </div>
              </div>

              {/* Rules section */}
              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-6 font-primary">Parking Rules</h2>
                <ul className="space-y-4">
                  <RuleItem text="Max height clearance is 2.1 meters." />
                  <RuleItem text="Overnight parking requires prior registration." />
                  <RuleItem text="No hazardous materials allowed." />
                </ul>
              </div>

              {/* Map View */}
              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-8">Location</h2>
                <div className="h-[400px] w-full bg-muted rounded-[2.5rem] border border-border overflow-hidden relative">
                   <Image src="/map-light.png" alt="Mini Map Light" fill className="object-cover opacity-50 dark:hidden" />
                   <Image src="/map-dark.png" alt="Mini Map Dark" fill className="object-cover opacity-30 hidden dark:block" />
                   <div className="absolute top-6 left-6 bg-card px-5 py-2.5 rounded-2xl shadow-xl font-bold text-sm text-foreground border border-border">
                      Bole, Addis Ababa
                   </div>
                   
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-[1.5rem] shadow-2xl shadow-primary/50 border-[6px] border-card animate-bounce-slow">
                           <ParkingCircle className="w-6 h-6 text-white" />
                        </div>
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

            {/* Right Column: Booking Widget */}
            <div className="relative">
              <div className="sticky top-20 bg-card rounded-[2.5rem] p-10 border border-border shadow-2xl shadow-primary/5 border-t-4 border-t-primary">
                <div className="flex justify-between items-center mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-primary tracking-[0.2em] font-extrabold text-muted-foreground">Total Price</p>
                    <p className="text-4xl font-extrabold text-foreground">50 ETB</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-extrabold border border-primary/20">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Available Now
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground ml-1">Select Date</label>
                    <div className="w-full bg-muted border border-border rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-muted/80 transition-colors">
                       <span className="text-sm font-bold text-foreground tracking-tight">10/25/2023</span>
                       <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground ml-1">Arrive After</label>
                      <div className="w-full bg-muted border border-border rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-muted/80 transition-colors">
                         <span className="text-sm font-bold text-foreground tracking-tight">10:00 AM</span>
                         <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground ml-1">Exit Before</label>
                      <div className="w-full bg-muted border border-border rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-muted/80 transition-colors">
                         <span className="text-sm font-bold text-foreground tracking-tight">12:00 PM</span>
                         <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground ml-1">Vehicle</label>
                    <div className="w-full bg-muted border border-border rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/80 transition-colors group">
                       <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center border border-border transition-transform group-hover:scale-105">
                         <Car className="w-5 h-5 text-muted-foreground" />
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-bold text-foreground">Toyota Corolla</p>
                          <p className="text-[10px] text-muted-foreground font-medium">AA 312345</p>
                       </div>
                       <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 py-6 border-y border-border mb-10">
                   <div className="flex justify-between text-xs font-medium">
                     <span className="text-muted-foreground">2 Hours x 25 ETB</span>
                     <span className="text-foreground font-bold">50 ETB</span>
                   </div>
                   <div className="flex justify-between text-xs font-medium">
                     <span className="text-muted-foreground">Service Fee</span>
                     <span className="text-primary font-bold">0 ETB</span>
                   </div>
                </div>

                <Link href="/reservations" className="block w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg text-center hover:opacity-90 transition-all shadow-xl shadow-primary/10 mb-6">
                   Reserve Spot <ArrowRight className="inline-block w-5 h-5 ml-2" />
                </Link>

                <p className="text-center text-[10px] font-medium text-muted-foreground flex items-center justify-center gap-1.5">
                   <Info className="w-3 h-3" /> Free cancellation up to 15 minutes before arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatItem({ label, value, sub, active }: { label: string; value: string; sub?: string; active?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all">
       <p className="text-[10px] uppercase font-primary tracking-widest font-extrabold text-muted-foreground mb-2">{label}</p>
       <div className="flex items-baseline gap-1">
          <p className={`text-xl font-bold ${active ? 'text-primary' : 'text-foreground'}`}>
             {active && <div className="inline-block w-2 h-2 bg-primary rounded-full mr-2 mb-0.5" />}
             {value}
          </p>
          {sub && <span className="text-[10px] font-medium text-muted-foreground">{sub}</span>}
       </div>
    </div>
  );
}

function Amenity({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-4 bg-muted/30 border border-border p-4 rounded-2xl hover:bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm border border-border">
        {icon}
      </div>
      <span className="text-sm font-bold text-foreground tracking-tight">{label}</span>
    </div>
  );
}

function RuleItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 group">
      <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <CheckCircle2 className="w-3 h-3 text-primary" />
      </div>
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{text}</span>
    </li>
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

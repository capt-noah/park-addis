import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, CheckCircle2, Zap, ArrowRight, Star } from "lucide-react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserBySession } from "@/src/services/auth.service";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function Home() {

  const cookie = await cookies()
  const sessionId = cookie.get("sessionId")?.value
  let userStatus: boolean = false

  if (!sessionId) userStatus = false
  
  if (sessionId) {
    let user = await findUserBySession(sessionId)
    
    if(user) userStatus = true
  } 



  return (
    <>
      <Navbar userStatus={userStatus} />
      <main className="min-h-screen pt-16 bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-background py-20 px-6">
        {/* Background Map Illustration */}
        <div className="absolute inset-0 z-0 opacity-40 select-none pointer-events-none">
          <Image
            src="/map-light.png"
            alt="City Map Light"
            fill
            className="object-cover dark:hidden"
            priority
          />
          <Image
            src="/map-dark.png"
            alt="City Map Dark"
            fill
            className="object-cover hidden dark:block"
            priority
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-8 border border-primary/20">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Live Availability in Addis Ababa
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-6 leading-[1.1] tracking-tight max-w-4xl">
            Reserve Your Parking<br />Before You Arrive
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 font-medium">
            Find, book, and manage parking spaces instantly. Save time and avoid the hassle.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl bg-card p-2 rounded-2xl shadow-xl shadow-primary/5 border border-border flex items-center mb-12">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Where do you want to park?"
                className="w-full bg-transparent border-none focus:outline-none text-foreground font-medium placeholder:text-muted-foreground"
              />
            </div>
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              Search
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Verified Spaces
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <Zap className="w-5 h-5 text-primary fill-primary" />
              Instant Booking
            </div>
          </div>
        </div>

        {/* Background pins are part of the map images now */}
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-background max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            Get parked in three simple steps. We've streamlined the experience so you can focus on your destination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            number="1"
            title="Find a Spot"
            description="Browse our interactive map to find the perfect spot based on location, price, and real-time availability."
            icon={<MapPin className="w-6 h-6 text-primary" />}
          />
          <StepCard
            number="2"
            title="Reserve Instantly"
            description="Select your duration and book in seconds. No more driving in circles hoping for a spot to open up."
            icon={<Zap className="w-6 h-6 text-primary" />}
          />
          <StepCard
            number="3"
            title="Park & Go"
            description="Navigate directly to your reserved space. Show your digital pass, park securely, and enjoy your day."
            icon={<span className="text-2xl font-bold text-primary">P</span>}
          />
        </div>
      </section>

      {/* Featured Locations Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Featured Locations</h2>
              <p className="text-muted-foreground font-medium">Popular spots in the heart of Addis Ababa.</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View all locations <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LocationCard
              image="/bole.png"
              name="Bole Medhanealem"
              location="Bole, Addis Ababa"
              rating={4.8}
              spots={42}
              price={45}
              status="Open"
            />
            <LocationCard
              image="/meskel.png"
              name="Meskel Square East"
              location="Kirkos, Addis Ababa"
              rating={4.5}
              spots={12}
              price={60}
              status="Covered"
            />
            <LocationCard
              image="/piassa.png"
              name="Piassa Center"
              location="Piassa, Addis Ababa"
              rating={4.2}
              spots={85}
              price={30}
              status="High Demand"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to stop circling the block?</h2>
          <p className="text-emerald-100/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of drivers in Addis Ababa who save time and money with ParkAddis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-card text-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-muted transition-colors flex items-center justify-center">
              Create Free Account
            </Link>
            <button className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
              Download App
            </button>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}


function StepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="p-8 bg-muted/40 rounded-3xl border border-border/50 flex flex-col gap-6 group hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center shadow-sm border border-border group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground">{number}. {title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}

function LocationCard({ image, name, location, rating, spots, price, status }: {
  image: string; name: string; location: string; rating: number; spots: number; price: number; status: string
}) {
  return (
    <div className="bg-card rounded-[2.5rem] overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all group">
      <div className="relative h-64 w-full">
        <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-card/90 backdrop-blur-md rounded-full text-[10px] font-bold text-foreground border border-border">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'Open' ? 'bg-emerald-500' : status === 'Covered' ? 'bg-blue-500' : 'bg-amber-500'}`} />
          {status}
        </div>
      </div>
      
      <div className="p-6 pt-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <div className="flex items-center gap-1 text-sm font-bold text-foreground bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            {rating}
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium mb-6">
          <MapPin className="w-3.5 h-3.5" />
          {location}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-muted/50 rounded-2xl border border-border">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Spots</p>
            <p className="text-sm font-bold text-foreground">{spots} Left</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-2xl border border-border">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Price</p>
            <p className="text-sm font-bold text-primary">ETB {price}<span className="text-muted-foreground font-medium">/hr</span></p>
          </div>
        </div>
        
        <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          Reserve Spot
        </button>
      </div>
    </div>
  );
}

import { DashboardLayout } from "@/components/DashboardLayout";
import { findUserBySession } from "@/src/services/auth.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Plus, MapPin, Clock, Calendar, ChevronRight,Ticket,AlertCircle,MoreHorizontal} from "lucide-react";
import Image from "next/image";

const reservations = [
  {
    status: "ACTIVE NOW",
    name: "Bole Medhanialem Parking",
    address: "Cameroon St, Addis Ababa",
    date: "Today, Oct 26",
    time: "2:30 PM - 5:00 PM",
    duration: "2h 30m",
    price: "75.00",
    paymentMethod: "Telebirr",
    image: "/bole.png",
    active: true
  },
  {
    status: "UPCOMING",
    name: "Edna Mall Underground",
    address: "Bole, Addis Ababa",
    date: "Tomorrow, Oct 27",
    time: "10:00 AM - 12:00 PM",
    duration: "2h 00m",
    price: "60.00",
    paymentMethod: "At location",
    image: "/meskel.png"
  },
  {
    status: "COMPLETED",
    name: "Mexico Square Park",
    address: "Mexico Sq, Addis Ababa",
    date: "Oct 20, 2023",
    time: "09:00 AM - 11:00 AM",
    duration: "2h 00m",
    price: "40.00",
    paymentMethod: "Cash",
    image: "/piassa.png"
  }
];

export default async function ReservationsPage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value
  if (!sessionId) redirect("/login")
  const dbUser = await findUserBySession(sessionId)
  if (!dbUser) redirect("/login")
  const user = { userId: dbUser.id, fullName: dbUser.fullName, email: dbUser.email, role: dbUser.role ?? "user" }

  return (
    <DashboardLayout user={user} >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-primary mb-1">My Reservations</h1>
          <p className="text-muted-foreground text-xs font-medium tracking-tight">Manage and view details of your parking history.</p>
        </div>
        <button className="bg-primary text-white px-5 py-3 rounded-2xl font-bold text-[11px] flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Book New Spot
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <TabItem label="Upcoming" count={2} active />
        <TabItem label="Completed" />
        <TabItem label="Cancelled" />
      </div>

      {/* Reservations List */}
      <div className="space-y-6">
        {reservations.map((res, i) => (
          <ReservationCard key={i} {...res} />
        ))}
      </div>
    </DashboardLayout>
  );
}

function TabItem({ label, count, active }: { label: string; count?: number; active?: boolean }) {
  return (
    <button className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`}>
      {label}
      {count && (
        <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
          active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}>
          {count}
        </span>
      )}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
      )}
    </button>
  );
}

function ReservationCard({ status, name, address, date, time, duration, price, paymentMethod, image, active }: any) {
  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm flex flex-col md:flex-row h-full md:h-[240px] group hover:shadow-lg transition-all duration-500">
      <div className="w-full md:w-[260px] relative shrink-0 overflow-hidden bg-slate-900">
        <Image src={image} alt={name} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-card/95 backdrop-blur-md rounded-full text-[8px] font-extrabold text-foreground border border-border">
          <div className={`w-1 h-1 rounded-full ${active ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          {status}
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-0.5">{name}</h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium">
              <MapPin className="w-3 h-3 text-muted-foreground/60" />
              {address}
            </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Total Price</p>
             <p className="text-xl font-extrabold text-primary">ETB {price}</p>
             <p className="text-[9px] font-bold text-primary">Paid via {paymentMethod}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
           <div className="p-2.5 bg-muted rounded-xl border border-border flex items-center gap-2.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
              <p className="text-[10px] font-bold text-foreground tracking-tight">{date}</p>
           </div>
           <div className="p-2.5 bg-muted rounded-xl border border-border flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
              <p className="text-[10px] font-bold text-foreground tracking-tight">{time}</p>
           </div>
           <div className="p-2.5 bg-muted rounded-xl border border-border flex items-center gap-2.5">
              <History className="w-3.5 h-3.5 text-muted-foreground/60" />
              <p className="text-[10px] font-bold text-foreground tracking-tight">{duration}</p>
           </div>
        </div>

        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
           {active ? (
             <>
               <button className="text-[10px] font-bold text-muted-foreground hover:text-red-500 transition-colors">Cancel Reservation</button>
               <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:opacity-90 transition-colors shadow-lg shadow-primary/20">
                 <Ticket className="w-3.5 h-3.5" /> View Ticket
               </button>
             </>
           ) : (
             <>
               <button className="text-[10px] font-bold text-primary hover:underline">Modify</button>
               <button className="bg-card border border-border text-foreground px-5 py-2.5 rounded-xl font-bold text-[10px] hover:bg-muted transition-colors flex items-center gap-2">
                 View Details <ChevronRight className="w-3.5 h-3.5" />
               </button>
             </>
           )}
        </div>
      </div>
    </div>
  );
}

function History({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 8v4l3 3" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

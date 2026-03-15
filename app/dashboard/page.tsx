import { DashboardLayout } from "@/components/DashboardLayout";
import { findUserBySession } from "@/src/services/auth.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, History, Map as MapIcon, ArrowUpRight, ArrowRight,ParkingCircle,Clock,CircleCheck,CircleX} from "lucide-react";
import { cookies } from "next/headers";


export default async function DashboardPage() {

  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) redirect('/login')

  const dbUser = await findUserBySession(sessionId)

  if (!dbUser) redirect('/login')

  const user = {
    userId: dbUser.id,
    email: dbUser.email,
    fullName: dbUser.fullName,
    role: dbUser.role ?? "user"
  }

  return (
    <DashboardLayout user={user}>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-primary mb-1">Good Afternoon, { user.fullName.split(' ')[0] }</h1>
        <p className="text-muted-foreground text-xs font-medium tracking-tight font-sans">Here's what's happening with your parking activity today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Find Parking Nearby Card */}
        <div className="bg-primary p-6 rounded-3xl text-primary-foreground flex flex-col h-full shadow-lg shadow-primary/20 group hover:opacity-95 transition-all duration-500">
           <h3 className="text-2xl font-bold mb-2">Find Parking Nearby</h3>
           <p className="text-primary-foreground/70 font-medium mb-8 leading-relaxed">
             Over 50 spots available right now in your area.
           </p>
           <Link href="/locations">
             <button className="mt-auto bg-primary-foreground text-primary w-fit px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer group/btn">
               Search Map <ArrowRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-1" />
             </button>
           </Link>
        </div>

        {/* Active Reservations Card */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-500">
           <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <Calendar className="w-5 h-5 text-primary" />
             </div>
           </div>
           <p className="text-[10px] uppercase font-primary tracking-widest font-extrabold text-muted-foreground mb-1">Active Reservations</p>
           <h2 className="text-4xl font-extrabold text-primary mb-2 tracking-tighter">2</h2>
           <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
             <ArrowUpRight className="w-3.5 h-3.5" />
             +1 today <span className="text-muted-foreground font-medium ml-1">vs yesterday</span>
           </div>
        </div>

        {/* Total Bookings Card */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-500">
           <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border">
                <History className="w-5 h-5 text-muted-foreground" />
             </div>
           </div>
           <p className="text-[10px] uppercase font-primary tracking-widest font-extrabold text-muted-foreground mb-1">Total Bookings</p>
           <h2 className="text-4xl font-extrabold text-foreground mb-2 tracking-tighter">148</h2>
           <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary mb-4">
             <ArrowUpRight className="w-3.5 h-3.5" />
             +12.5% <span className="text-muted-foreground font-medium ml-1">this month</span>
           </div>
           
           <div className="mt-auto flex items-end gap-1.5 h-8 opacity-40">
             <div className="flex-1 bg-muted rounded-t-sm h-2" />
             <div className="flex-1 bg-muted rounded-t-sm h-4" />
             <div className="flex-1 bg-muted rounded-t-sm h-3" />
             <div className="flex-1 bg-primary/20 rounded-t-sm h-2.5" />
             <div className="flex-1 bg-primary rounded-t-sm h-6" />
           </div>
        </div>


      </div>

      {/* Recent History Table */}
      <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Recent History</h2>
          <div className="flex gap-2">
             <button className="px-4 py-2 rounded-xl border border-border text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors">
               Filter
             </button>
             <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:opacity-90 transition-colors">
               Export
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Parking Location</th>
                <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Time & Date</th>
                <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground text-center">Status</th>
                <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Amount</th>
                <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <HistoryRow 
                icon={<ParkingCircle className="w-4 h-4 text-primary" />}
                name="Bole Medhanialem"
                id="Zone A, Spot 42"
                time="Today"
                date="2:30 PM - 5:00 PM"
                status="ACTIVE"
                amount="--"
              />
              <HistoryRow 
                icon={<Clock className="w-4 h-4 text-muted-foreground" />}
                name="Churchill Road Plaza"
                id="Zone B, Spot 12"
                time="Yesterday"
                date="10:00 AM - 12:30 PM"
                status="COMPLETED"
                amount="ETB 45.00"
              />
              <HistoryRow 
                icon={<MapIcon className="w-4 h-4 text-muted-foreground" />}
                name="Edna Mall Underground"
                id="Level -2, Spot 88"
                time="Oct 24, 2023"
                date="08:30 PM - 11:00 PM"
                status="COMPLETED"
                amount="ETB 60.00"
              />
              <HistoryRow 
                icon={<div className="text-xs font-bold text-muted-foreground/40">P</div>}
                name="Meskel Square East"
                id="Zone C, Spot 05"
                time="Oct 22, 2023"
                date="09:00 AM - 10:15 AM"
                status="CANCELLED"
                amount="--"
              />
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex items-center justify-between">
          <p className="text-[10px] font-medium text-muted-foreground">Showing <span className="text-foreground font-bold">1-4</span> of <span className="text-foreground font-bold">148</span> results</p>
          <div className="flex gap-2">
             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
               <ArrowRight className="w-3.5 h-3.5 rotate-180 text-muted-foreground" />
             </button>
             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
               <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
             </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function HistoryRow({ icon, name, id, time, date, status, amount }: any) {
  const statusColors: any = {
    ACTIVE: "bg-primary/10 text-primary border-primary/20",
    COMPLETED: "bg-muted text-muted-foreground border-border",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <tr className="group hover:bg-muted/30 transition-colors">
      <td className="py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border group-hover:bg-card transition-colors">
            {icon}
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{name}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{id}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="space-y-0.5">
          <p className="font-bold text-foreground text-[11px]">{time}</p>
          <p className="text-[10px] text-muted-foreground font-medium tracking-tight">{date}</p>
        </div>
      </td>
      <td className="text-center">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${statusColors[status]}`}>
          {status}
        </span>
      </td>
      <td>
        <p className="font-bold text-foreground text-[11px] font-sans tracking-wide">{amount}</p>
      </td>
      <td className="text-right">
        <button className="text-[11px] font-bold text-primary hover:underline">
          View Details
        </button>
      </td>
    </tr>
  );
}

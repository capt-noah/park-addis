import { DashboardLayout } from "@/components/DashboardLayout";
import { findUserBySession } from "@/backend/src/services/auth.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  History,
  Map as MapIcon,
  ArrowUpRight,
  ArrowRight,
  ParkingCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cookies } from "next/headers";
import {
  getUserReservations,
  getActiveReservation,
} from "@/backend/src/services/reservation.service";
import { RecentHistoryTable } from "@/components/dashboard/RecentHistoryTable";
import { ActiveSessionCard } from "@/components/dashboard/ActiveSessionCard";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) redirect("/login");

  const dbUser = await findUserBySession(sessionId);

  if (!dbUser) redirect("/login");

  const user = {
    userId: dbUser.id,
    email: dbUser.email,
    fullName: dbUser.fullName,
    role: dbUser.role ?? "user",
  };

  const allReservations = await getUserReservations(dbUser.id);
  const recentReservations = allReservations.slice(0, 4);
  const activeReservation = await getActiveReservation(dbUser.id);

  return (
    <DashboardLayout user={user}>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-primary mb-1">
          Good Afternoon, {user.fullName.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-xs font-medium tracking-tight font-sans">
          Here's what's happening with your parking activity today.
        </p>
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
              Search Map{" "}
              <ArrowRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-1" />
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
          <p className="text-[10px] uppercase font-primary tracking-widest font-extrabold text-muted-foreground mb-1">
            Active Reservations
          </p>
          <h2 className="text-4xl font-extrabold text-primary mb-2 tracking-tighter">
            2
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +1 today{" "}
            <span className="text-muted-foreground font-medium ml-1">
              vs yesterday
            </span>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-500">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border">
              <History className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <p className="text-[10px] uppercase font-primary tracking-widest font-extrabold text-muted-foreground mb-1">
            Total Bookings
          </p>
          <h2 className="text-4xl font-extrabold text-foreground mb-2 tracking-tighter">
            148
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary mb-4">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +12.5%{" "}
            <span className="text-muted-foreground font-medium ml-1">
              this month
            </span>
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

      {/* Active Session Card (if any) */}
      {activeReservation && (
        <ActiveSessionCard reservation={activeReservation} />
      )}

      {/* Recent History Table */}
      <RecentHistoryTable
        recentReservations={recentReservations}
        totalCount={allReservations.length}
      />
    </DashboardLayout>
  );
}

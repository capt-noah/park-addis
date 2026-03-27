import { DashboardLayout } from "@/components/DashboardLayout";
import { findUserBySession } from "@/src/services/auth.service";
import { getUserReservations } from "@/src/services/reservation.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ReservationsClient from "@/components/reservations/ReservationsClient";

export default async function ReservationsPage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value
  if (!sessionId) redirect("/login")
  
  const dbUser = await findUserBySession(sessionId)
  if (!dbUser) redirect("/login")
  
  const user = { 
    userId: dbUser.id, 
    fullName: dbUser.fullName, 
    email: dbUser.email, 
    role: dbUser.role ?? "user" 
  }

  const initialReservations = await getUserReservations(dbUser.id);

  return (
    <DashboardLayout user={user}>
      <ReservationsClient 
        initialReservations={initialReservations} 
        user={user} 
      />
    </DashboardLayout>
  );
}

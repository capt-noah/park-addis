import { DashboardLayout } from "@/components/DashboardLayout";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ReservationsClient from "@/components/reservations/ReservationsClient";

export default async function ReservationsPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) redirect("/login");

  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:1000";

  const userRes = await fetch(`${backendUrl}/api/auth/me`, {
    headers: { Cookie: `sessionId=${sessionId}` },
    cache: "no-store",
  });

  if (!userRes.ok) redirect("/login");
  const userData = await userRes.json();
  const dbUser = (userData.id || userData.userId) ? userData : null;
  if (!dbUser) redirect("/login");

  const user = {
    userId: dbUser.id || dbUser.userId,
    fullName: dbUser.fullName,
    email: dbUser.email,
    role: dbUser.role ?? "user",
  };

  // Fetch Reservations (Session-based)
  const reservationsRes = await fetch(`${backendUrl}/api/reservation`, {
    headers: { Cookie: `sessionId=${sessionId}` },
    cache: "no-store",
  });
  const { reservations: initialReservations = [] } = await reservationsRes.json();

  return (
    <DashboardLayout user={user}>
      <ReservationsClient
        initialReservations={initialReservations}
        user={user}
      />
    </DashboardLayout>
  );
}

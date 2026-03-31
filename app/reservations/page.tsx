import { DashboardLayout } from "@/components/DashboardLayout";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ReservationsClient from "@/components/reservations/ReservationsClient";

export default async function ReservationsPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) redirect("/login");

  const userRes = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
    headers: { Cookie: `sessionId=${sessionId}` }
  });

  if (!userRes.ok) redirect("/login");
  const userData = await userRes.json();
  const dbUser = userData.userId ? userData : null;
  if (!dbUser) redirect("/login");

  const user = {
    userId: dbUser.userId,
    fullName: dbUser.fullName,
    email: dbUser.email,
    role: dbUser.role ?? "user",
  };

  // Fetch Reservations
  const reservationsRes = await fetch(`${process.env.BACKEND_URL}/api/reservation/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: dbUser.userId })
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

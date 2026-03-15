import LocationsContainer from "@/components/LocationsContainer";
import { Sidebar } from "@/components/Sidebar";
import { cookies } from "next/headers";
import { findUserBySession } from "@/src/services/auth.service";
import { redirect } from "next/navigation";
import { locationsData } from "@/lib/data";

export default async function LocationsPage() {
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
    <div className="min-h-screen bg-background flex">
      <Sidebar user={user} />
      <div className="flex-1 ml-0 md:ml-60 relative h-screen overflow-hidden">
        <LocationsContainer locationsData={locationsData} />
      </div>
    </div>
  );
}

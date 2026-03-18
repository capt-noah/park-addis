import LocationsContainer from "@/components/LocationsContainer";
import { Sidebar } from "@/components/Sidebar";
import { cookies } from "next/headers";
import { findUserBySession } from "@/src/services/auth.service";
import { redirect } from "next/navigation";
import { getParkingLocationsWithinRange } from "@/src/services/parking.service";
import { ParkingLocation } from "@/types/location";

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

  // Fetch from the DB using a very large range to encompass all by default
  // Default coordinates (used in your map/api fallback as well)
  const lat = 9.059163326240709;
  const lng = 38.78243920830075;
  const range = 10000;

  let mappedLocations: ParkingLocation[] = [];
  try {
     const locations = await getParkingLocationsWithinRange(range, { lat, lng });
     mappedLocations = (locations as any[]).map(loc => ({
         id: loc.id,
         name: loc.name,
         address: loc.address || "Addis Ababa",
         lat: loc.lat || 9.0190,
         lng: loc.lng || 38.7525,
         price: loc.display_price_per_hour || 20,
         status: "Available",
         image: "/bole.png", 
         rating: loc.ratings_count > 0 ? Number((loc.ratings_sum / loc.ratings_count / 10).toFixed(1)) : 4.5,
         distance: Number((loc.distance / 1000).toFixed(1)),
         eta: Math.round(loc.eta),
         popular: 3
     }));
  } catch(e) {
     console.error("Failed to load locations from DB", e);
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar user={user} />
      <div className="flex-1 ml-0 md:ml-60 relative h-screen overflow-hidden">
        <LocationsContainer locationsData={mappedLocations} />
      </div>
    </div>
  );
}

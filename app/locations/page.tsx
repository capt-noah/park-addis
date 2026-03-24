import { Sidebar } from "@/components/Sidebar";
import { cookies } from "next/headers";
import { findUserBySession } from "@/src/services/auth.service";
import { redirect } from "next/navigation";

import { getParkingLocationsWithinRange } from "@/src/services/parking.service";
import { GeoJSONFeature } from "@/types/geojson";
import LocationsContainer from "@/components/location/LocationsContainer";

export default async function LocationsPage() {
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

  const lat = 9.059163326240709;
  const lng = 38.78243920830075;
  const range = 10000;

  const result = await getParkingLocationsWithinRange(range, { lat, lng });

  const locations: GeoJSONFeature = result as GeoJSONFeature;

  console.log(locations);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar user={user} />
      <div className="w-full ml-0 md:ml-60 relative h-screen overflow-hidden">
        <LocationsContainer locationsData={locations} />
      </div>
    </div>
  );
}

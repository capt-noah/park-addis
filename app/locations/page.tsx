import { Sidebar } from "@/components/Sidebar";
import { cookies } from "next/headers";
import { findUserBySession } from "@/backend/src/services/auth.service";
import { redirect } from "next/navigation";

import { getParkingLocationsWithinRange } from "@/backend/src/services/parking.service";
import { GeoJSONFeature } from "@/types/geojson";
import LocationsContainer from "@/components/location/LocationsContainer";
import { DEFAULT_LAT, DEFAULT_LNG, DEFAULT_RANGE } from "@/lib/location";
import { MapProvider } from "@/components/map/MapContext";

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

  const lat = DEFAULT_LAT;
  const lng = DEFAULT_LNG;
  const range = DEFAULT_RANGE;

  const result = await getParkingLocationsWithinRange(range, { lat, lng });

  const locations: GeoJSONFeature = result as GeoJSONFeature;

  console.log(locations);

  return <LocationsLayout user={user} locations={locations} />;
}

import LocationsLayout from "@/components/location/LocationsLayout";

import { Sidebar } from "@/components/Sidebar";
import { cookies } from "next/headers";

import { GeoJSONFeature } from "@/types/geojson";
import LocationsContainer from "@/components/location/LocationsContainer";
import { DEFAULT_LAT, DEFAULT_LNG, DEFAULT_RANGE } from "@/lib/location";
import { MapProvider } from "@/components/map/MapContext";

export default async function LocationsPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) redirect("/login");

  // Fetch User
  const userRes = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
    headers: { Cookie: `sessionId=${sessionId}` }
  });

  if (!userRes.ok) redirect("/login");
  const userData = await userRes.json();
  const dbUser = userData.userId ? userData : null;
  if (!dbUser) redirect("/login");

  const user = {
    userId: dbUser.userId,
    email: dbUser.email,
    fullName: dbUser.fullName,
    role: dbUser.role ?? "user",
  };

  const lat = DEFAULT_LAT;
  const lng = DEFAULT_LNG;
  const range = DEFAULT_RANGE;

  // Fetch Locations
  const locationsRes = await fetch(`${process.env.BACKEND_URL}/api/parking/range`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ range, coors: { lat, lng } })
  });
  
  const { parkingWithinRange: result } = await locationsRes.json();

  const locations: GeoJSONFeature = result as GeoJSONFeature;

  console.log(locations);

  return <LocationsLayout user={user} locations={locations} />;
}

import LocationsLayout from "@/components/location/LocationsLayout";

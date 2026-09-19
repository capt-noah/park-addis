import { Sidebar } from "@/components/Sidebar";
import { cookies } from "next/headers";

import { GeoJSONFeature } from "@/types/geojson";
import LocationsContainer from "@/components/location/LocationsContainer";
import { DEFAULT_LAT, DEFAULT_LNG, DEFAULT_RANGE } from "@/lib/location";
import { MapProvider } from "@/components/map/MapContext";

import { redirect } from "next/navigation";

export default async function LocationsPage() {

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) redirect("/login");

  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:1000";

  // Fetch User
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
    email: dbUser.email,
    fullName: dbUser.fullName,
    role: dbUser.role ?? "user",
  };

  const lat = DEFAULT_LAT;
  const lng = DEFAULT_LNG;
  const range = DEFAULT_RANGE;

  // Fetch Locations
  const locationsRes = await fetch(`${backendUrl}/api/parking/range`, {
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

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LocationDetailsClient from "@/components/location/LocationDetailsClient";
import { ParkingLocation } from "@/types/location";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LocationDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) redirect("/login");

  // Fetch User
  const userRes = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
    headers: { Cookie: `sessionId=${sessionId}` }
  });

  if (!userRes.ok) redirect("/login");
  const userData = await userRes.json();
  const user = userData.userId ? userData : null;
  if (!user) redirect("/login");

  // Fetch Location & Spot
  const locationRes = await fetch(`${process.env.BACKEND_URL}/api/parking/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  
  if (!locationRes.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Location not found</p>
      </div>
    );
  }

  const { location: dbLocation, spot } = await locationRes.json();
  
  // Fetch Vehicles
  const vehiclesRes = await fetch(`${process.env.BACKEND_URL}/api/vehicle/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.userId })
  });
  const vehicles = await vehiclesRes.json();

  // Format the location data to match the expected ParkingLocation type
  const location: ParkingLocation = {
    id: dbLocation.id,
    name: dbLocation.name,
    address: dbLocation.address,
    image: "/bole.png", // Default placeholder
    price: spot ? parseFloat(spot.pricePerHour) : 25,
    rating:
      dbLocation.ratingsCount && dbLocation.ratingsCount > 0
        ? parseFloat(
            (
              Number(dbLocation.ratingsSum!) /
              dbLocation.ratingsCount /
              10
            ).toFixed(1),
          )
        : 4.5,
    distance: 0,
    eta: 0,
  };

  return (
    <LocationDetailsClient
      location={location}
      spot={spot}
      initialVehicles={vehicles}
    />
  );
}

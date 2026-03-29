import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserBySession } from "@/src/services/auth.service";
import {
  getParkingLocation,
  getParkingSpotFromLocationId,
} from "@/src/services/parking.service";
import { getVehiclesByUserId } from "@/src/services/cars.service";
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

  const user = await findUserBySession(sessionId);
  if (!user) redirect("/login");

  const dbLocation = await getParkingLocation(id);
  if (!dbLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Location not found</p>
      </div>
    );
  }

  console.log(dbLocation)
  const spot = await getParkingSpotFromLocationId(id);
  const vehicles = await getVehiclesByUserId(user.id);

  // Format the location data to match the expected ParkingLocation type
  const location: ParkingLocation = {
    id: dbLocation.id,
    name: dbLocation.name,
    address: dbLocation.address,
    image: "/bole.png", // Default placeholder
    price: spot ? parseFloat(spot.pricePerHour) : 25,
    rating:
      dbLocation.ratingsCount && dbLocation.ratingsCount > 0
        ? 
            parseFloat((Number(dbLocation.ratingsSum!) / dbLocation.ratingsCount / 10).toFixed(1))
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

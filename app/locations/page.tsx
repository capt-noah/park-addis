import LocationsContainer from "@/components/LocationsContainer";
import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { locationsData } from "@/lib/data";

export default async function LocationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar user={user} />
      <div className="flex-1 ml-0 md:ml-60 relative h-screen overflow-hidden">
        <LocationsContainer locationsData={locationsData} />
      </div>
    </div>
  );
}

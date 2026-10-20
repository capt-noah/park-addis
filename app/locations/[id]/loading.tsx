import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background px-6">
      <Navbar userStatus={true} />
      
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Shimmer */}
          <Skeleton className="h-[450px] w-full rounded-[3rem] mb-12" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Info */}
            <div className="lg:col-span-2 space-y-12">
              {/* Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="h-24 bg-card border border-border rounded-[1.5rem] p-6 flex flex-col justify-between">
                      <Skeleton className="w-12 h-2 rounded" />
                      <Skeleton className="w-20 h-4 rounded" />
                   </div>
                 ))}
              </div>

              {/* About section */}
              <div className="space-y-4">
                <Skeleton className="w-48 h-8 rounded-xl mb-6" />
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-3/4 h-4 rounded" />
              </div>

              {/* Features grid */}
              <div>
                <Skeleton className="w-56 h-8 rounded-xl mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 border border-border rounded-2xl" />
                  ))}
                </div>
              </div>

              {/* Map View */}
              <div>
                <Skeleton className="w-32 h-8 rounded-xl mb-8" />
                <Skeleton className="h-[400px] w-full rounded-[2.5rem] border border-border" />
              </div>
            </div>

            {/* Right Column: Booking Widget */}
            <div className="relative">
              <div className="sticky top-20 bg-card rounded-[2.5rem] p-10 border border-border shadow-sm border-t-4 border-t-primary/20">
                <div className="flex justify-between items-center mb-10">
                  <div className="space-y-3">
                    <Skeleton className="w-16 h-2 rounded" />
                    <Skeleton className="w-32 h-10 rounded" />
                  </div>
                  <Skeleton className="w-24 h-6 rounded-full" />
                </div>

                <div className="space-y-6 mb-10">
                  <div className="space-y-3">
                     <Skeleton className="w-20 h-3 rounded ml-1" />
                     <Skeleton className="w-full h-14 rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-3">
                        <Skeleton className="w-20 h-3 rounded ml-1" />
                        <Skeleton className="w-full h-14 rounded-2xl" />
                     </div>
                     <div className="space-y-3">
                        <Skeleton className="w-20 h-3 rounded ml-1" />
                        <Skeleton className="w-full h-14 rounded-2xl" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <Skeleton className="w-16 h-3 rounded ml-1" />
                     <Skeleton className="w-full h-14 rounded-2xl" />
                  </div>
                </div>

                <Skeleton className="w-full h-16 rounded-[1.5rem] mb-6" />
                <Skeleton className="w-48 h-3 rounded mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

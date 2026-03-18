import { Navbar } from "@/components/Navbar";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background animate-pulse px-6">
      <Navbar userStatus={true} />
      
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Shimmer */}
          <div className="relative h-[450px] w-full rounded-[3rem] bg-muted mb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent -translate-x-full animate-shimmer" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Info */}
            <div className="lg:col-span-2 space-y-12">
              {/* Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="h-24 bg-card border border-border rounded-[1.5rem] p-6">
                      <div className="w-12 h-2 bg-muted rounded mb-3" />
                      <div className="w-20 h-4 bg-muted rounded" />
                   </div>
                 ))}
              </div>

              {/* About section */}
              <div className="space-y-4">
                <div className="w-48 h-8 bg-muted rounded-xl mb-6" />
                <div className="w-full h-4 bg-muted rounded" />
                <div className="w-full h-4 bg-muted rounded" />
                <div className="w-3/4 h-4 bg-muted rounded" />
              </div>

              {/* Features grid */}
              <div>
                <div className="w-56 h-8 bg-muted rounded-xl mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/30 border border-border rounded-2xl" />
                  ))}
                </div>
              </div>

              {/* Map View */}
              <div>
                <div className="w-32 h-8 bg-muted rounded-xl mb-8" />
                <div className="h-[400px] w-full bg-muted rounded-[2.5rem] border border-border" />
              </div>
            </div>

            {/* Right Column: Booking Widget */}
            <div className="relative">
              <div className="sticky top-20 bg-card rounded-[2.5rem] p-10 border border-border shadow-sm border-t-4 border-t-primary/20">
                <div className="flex justify-between items-center mb-10">
                  <div className="space-y-3">
                    <div className="w-16 h-2 bg-muted rounded" />
                    <div className="w-32 h-10 bg-muted rounded" />
                  </div>
                  <div className="w-24 h-6 bg-muted rounded-full" />
                </div>

                <div className="space-y-6 mb-10">
                  <div className="space-y-3">
                     <div className="w-20 h-3 bg-muted rounded ml-1" />
                     <div className="w-full h-14 bg-muted rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-3">
                        <div className="w-20 h-3 bg-muted rounded ml-1" />
                        <div className="w-full h-14 bg-muted rounded-2xl" />
                     </div>
                     <div className="space-y-3">
                        <div className="w-20 h-3 bg-muted rounded ml-1" />
                        <div className="w-full h-14 bg-muted rounded-2xl" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="w-16 h-3 bg-muted rounded ml-1" />
                     <div className="w-full h-14 bg-muted rounded-2xl" />
                  </div>
                </div>

                <div className="w-full h-16 bg-muted rounded-[1.5rem] mb-6" />
                <div className="w-48 h-3 bg-muted rounded mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

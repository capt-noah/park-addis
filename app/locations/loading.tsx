import { Sidebar } from "@/components/Sidebar";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-60 relative h-[100dvh] overflow-hidden bg-background">
        {/* Full Screen Map Skeleton Background */}
        <Skeleton className="absolute inset-0 z-0 rounded-none w-full h-full opacity-30" />
        
        {/* Search Bar Skeleton Overlay */}
        <div className="absolute top-6 left-6 right-6 z-[500] flex justify-center pointer-events-none \">
          <Skeleton style={{ borderRadius: '1.5rem' }} className="w-full max-w-lg h-[52px] bg-card/80 border border-border backdrop-blur-xl rounded-3xl" />
        </div>

        {/* Bottom Carousel Skeleton Overlay */}
        <div className="absolute bottom-10 left-6 z-[500] pointer-events-none max-w-[calc(100vw-100px)] lg:max-w-4xl w-full">
          <div className="flex gap-4 overflow-hidden px-2">
            {[1, 2, 3].map((i) => (
              <Skeleton 
                key={i} 
                className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[380px] h-[176px] bg-card/80 backdrop-blur-xl border-2 border-border" 
                style={{ borderRadius: '2rem' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

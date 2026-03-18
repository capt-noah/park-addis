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
        <div className="absolute bottom-4 left-0 w-full z-[500] pointer-events-none flex flex-col items-start px-4 md:px-8">
          
          {/* Filters Skeleton */}
          <div className="w-full h-[40px]">
            <div className="flex gap-2 w-full pb-3">
             <Skeleton className="w-[60px] h-[28px] rounded-full bg-card/80 backdrop-blur-xl border border-border" />
             <Skeleton className="w-[60px] h-[28px] rounded-full bg-card/80 backdrop-blur-xl border border-border" />
               <Skeleton className="w-[60px] h-[28px] rounded-full bg-card/80 backdrop-blur-xl border border-border" />
            </div>
          </div>

          <div className="flex w-full h-[175px]">
            <div className="flex gap-4 overflow-hidden w-full pb-2">
              {[1, 2, 3].map((i) => (
                <Skeleton 
                  key={i} 
                  className="flex-shrink-0 w-[90vw] sm:w-[320px] md:w-[340px] h-[150px] bg-card/90 backdrop-blur-xl border border-border" 
                  style={{ borderRadius: '1.5rem' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

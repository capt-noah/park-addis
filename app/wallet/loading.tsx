import { DashboardLayout } from "@/components/DashboardLayout";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-10">
        
        {/* Header Section Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-48 rounded-xl" />
          </div>
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Main Balance Card Skeleton */}
          <div className="bg-card border border-border rounded-[32px] p-8 h-[260px] shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <Skeleton className="h-3 w-24" />
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-2 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-2 w-16 ml-auto" />
                <Skeleton className="h-3 w-24 ml-auto" />
              </div>
            </div>
          </div>

          {/* Stats & Promo Column Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="bg-card border border-border rounded-[28px] p-6 shadow-sm h-[120px] flex flex-col justify-between">
               <div className="flex justify-between items-start">
                 <Skeleton className="h-10 w-10 rounded-xl" />
                 <Skeleton className="h-2 w-12" />
               </div>
               <Skeleton className="h-6 w-32" />
            </div>
            <div className="bg-muted border border-border rounded-[28px] p-6 h-[120px] flex flex-col justify-between">
               <div className="space-y-2">
                 <Skeleton className="h-5 w-40" />
                 <Skeleton className="h-3 w-32" />
               </div>
               <Skeleton className="h-2 w-16" />
            </div>
          </div>
        </div>

        {/* Transaction History Section Skeleton */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-sm mt-4">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-2">
               <Skeleton className="h-9 w-20 rounded-xl" />
               <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 py-6 border-b border-border/50 last:border-0">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-2 w-24" />
                </div>
                <div className="hidden md:block">
                  <Skeleton className="h-4 w-24 rounded-full" />
                </div>
                <div className="hidden lg:block">
                  <Skeleton className="w-24 h-3" />
                </div>
                <div className="text-right space-y-1">
                   <Skeleton className="w-16 h-4 ml-auto" />
                </div>
                <div className="ml-4">
                   <Skeleton className="w-24 h-9 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

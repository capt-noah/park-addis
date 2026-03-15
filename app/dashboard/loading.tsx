import { DashboardLayout } from "@/components/DashboardLayout";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" >
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-sm h-55 flex flex-col justify-between">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-xl" />
            <Skeleton className="h-9 w-20 rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 py-6 border-b border-border/50 last:border-0">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-2 w-24" />
              </div>
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-16 h-6 rounded-full" />
              <Skeleton className="w-12 h-4 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
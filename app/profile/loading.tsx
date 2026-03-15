import { DashboardLayout } from "@/components/DashboardLayout";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm mb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Skeleton className="w-32 h-32 rounded-3xl" />
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-3xl p-8 border border-border shadow-sm space-y-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-11 w-full rounded-xl opacity-40" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

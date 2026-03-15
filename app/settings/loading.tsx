import { DashboardLayout } from "@/components/DashboardLayout";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-8 max-w-5xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-48" />
              </div>
            </div>
            <div className="p-8 space-y-6">
              {[1, 2].map((j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-11 w-full max-w-md rounded-xl opacity-40" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/DashboardLayout";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-36 rounded-2xl" />
      </div>

      <div className="flex gap-6 border-b border-border mb-8 pb-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-6 w-20" />
        ))}
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-3xl border border-border shadow-sm flex flex-col md:flex-row h-60">
            <Skeleton className="w-full md:w-[260px] rounded-r-none" />
            <div className="flex-1 p-6 space-y-4">
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-3 w-16 mb-1 ml-auto" />
                  <Skeleton className="h-6 w-24 ml-auto" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-10 rounded-xl" />
                <Skeleton className="h-10 rounded-xl" />
                <Skeleton className="h-10 rounded-xl" />
              </div>
              <div className="flex justify-end gap-4 mt-auto">
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

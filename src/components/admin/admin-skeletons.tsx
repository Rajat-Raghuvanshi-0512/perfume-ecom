import { Skeleton } from "@/components/ui/skeleton";

export function AdminMetricCardSkeleton() {
  return (
    <div className="bg-[#141419] border border-white/10 p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28 bg-white/10" />
        <Skeleton className="h-8 w-8 bg-[#D4AF37]/20 rounded-full" />
      </div>
      <Skeleton className="h-8 w-36 bg-[#D4AF37]/30" />
      <Skeleton className="h-3 w-24 bg-white/5" />
    </div>
  );
}

export function AdminTableRowSkeleton() {
  return (
    <tr className="border-b border-white/10">
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-32 bg-white/10" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-24 bg-white/5" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-20 bg-[#D4AF37]/30" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-6 w-20 bg-white/10 rounded-full" />
      </td>
      <td className="py-4 px-4 text-right">
        <Skeleton className="h-8 w-16 bg-white/10 ml-auto" />
      </td>
    </tr>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-white/10" />
          <Skeleton className="h-4 w-40 bg-white/5" />
        </div>
        <Skeleton className="h-10 w-36 bg-[#D4AF37]/30" />
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminMetricCardSkeleton />
        <AdminMetricCardSkeleton />
        <AdminMetricCardSkeleton />
        <AdminMetricCardSkeleton />
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-[#141419] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <Skeleton className="h-6 w-40 bg-white/10" />
          <Skeleton className="h-9 w-64 bg-white/5" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4"><Skeleton className="h-3 w-16 bg-white/10" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-20 bg-white/10" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-16 bg-white/10" /></th>
                <th className="py-3 px-4"><Skeleton className="h-3 w-16 bg-white/10" /></th>
                <th className="py-3 px-4 text-right"><Skeleton className="h-3 w-12 bg-white/10 ml-auto" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <AdminTableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { ProductGridSkeleton } from "@/components/storefront/storefront-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0]">
      {/* Header Skeleton */}
      <div className="bg-[#121215] border-b border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <Skeleton className="h-4 w-32 mx-auto bg-[#D4AF37]/30" />
          <Skeleton className="h-10 w-72 mx-auto bg-white/10" />
          <Skeleton className="h-4 w-96 mx-auto bg-white/5" />
        </div>
      </div>

      {/* Main Catalog Layout Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters Skeleton */}
          <div className="lg:col-span-1 space-y-6 bg-[#121216] p-6 border border-white/10 h-fit">
            <Skeleton className="h-5 w-28 bg-[#D4AF37]/30" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
            </div>
            <Skeleton className="h-5 w-28 bg-[#D4AF37]/30" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <Skeleton className="h-4 w-40 bg-white/10" />
              <Skeleton className="h-9 w-44 bg-white/10" />
            </div>
            <ProductGridSkeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}

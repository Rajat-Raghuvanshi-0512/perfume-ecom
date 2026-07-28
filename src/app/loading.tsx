import { ProductGridSkeleton } from "@/components/storefront/storefront-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0]">
      {/* Hero Banner Skeleton */}
      <div className="relative min-h-[75vh] bg-[#121216] border-b border-white/10 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full text-center space-y-6">
          <Skeleton className="h-4 w-44 mx-auto bg-[#D4AF37]/30" />
          <Skeleton className="h-12 sm:h-16 w-3/4 mx-auto bg-white/10" />
          <Skeleton className="h-4 w-2/3 mx-auto bg-white/5" />
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-40 bg-[#D4AF37]/40" />
            <Skeleton className="h-12 w-40 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Featured Products Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-3">
          <Skeleton className="h-4 w-36 mx-auto bg-[#D4AF37]/30" />
          <Skeleton className="h-8 w-64 mx-auto bg-white/10" />
        </div>
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}

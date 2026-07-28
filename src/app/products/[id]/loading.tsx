import { ProductDetailSkeleton } from "@/components/storefront/storefront-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0]">
      {/* Breadcrumb Skeleton */}
      <div className="bg-[#121215] border-b border-white/10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Skeleton className="h-3 w-12 bg-white/10" />
          <span className="text-white/20">/</span>
          <Skeleton className="h-3 w-16 bg-white/10" />
          <span className="text-white/20">/</span>
          <Skeleton className="h-3 w-32 bg-[#D4AF37]/30" />
        </div>
      </div>

      <ProductDetailSkeleton />
    </div>
  );
}

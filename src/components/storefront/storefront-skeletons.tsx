import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#121216] border border-white/10 rounded-none overflow-hidden space-y-4 p-4 flex flex-col h-full">
      {/* Product Image Area */}
      <Skeleton className="w-full aspect-[4/5] bg-white/5 rounded-none" />

      {/* Brand & Badge Skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-3 w-20 bg-white/10" />
        <Skeleton className="h-4 w-16 bg-[#D4AF37]/20 rounded-full" />
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-4/5 bg-white/10" />
        <Skeleton className="h-3 w-3/5 bg-white/5" />
      </div>

      {/* Notes Badges */}
      <div className="flex gap-1.5 py-1">
        <Skeleton className="h-5 w-14 bg-white/5 rounded-full" />
        <Skeleton className="h-5 w-16 bg-white/5 rounded-full" />
        <Skeleton className="h-5 w-12 bg-white/5 rounded-full" />
      </div>

      {/* Price & Action Button */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="space-y-1">
          <Skeleton className="h-5 w-16 bg-[#D4AF37]/30" />
          <Skeleton className="h-3 w-10 bg-white/5" />
        </div>
        <Skeleton className="h-9 w-24 bg-white/10" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-[4/5] bg-white/5 border border-white/10" />
          <div className="flex gap-4">
            <Skeleton className="w-20 h-24 bg-white/5 border border-white/10" />
            <Skeleton className="w-20 h-24 bg-white/5 border border-white/10" />
            <Skeleton className="w-20 h-24 bg-white/5 border border-white/10" />
          </div>
        </div>

        {/* Right Column: Product Details Skeleton */}
        <div className="space-y-6">
          {/* Brand & Title */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-[#D4AF37]/30" />
            <Skeleton className="h-8 sm:h-10 w-3/4 bg-white/10" />
            <Skeleton className="h-4 w-1/2 bg-white/5" />
          </div>

          {/* Price & Rating */}
          <div className="flex items-center gap-4 py-2 border-y border-white/10">
            <Skeleton className="h-7 w-28 bg-[#D4AF37]/40" />
            <Skeleton className="h-4 w-20 bg-white/10" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-11/12 bg-white/5" />
            <Skeleton className="h-4 w-4/5 bg-white/5" />
          </div>

          {/* Size Selectors */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-3 w-24 bg-white/10" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-24 bg-white/10" />
              <Skeleton className="h-12 w-24 bg-white/10" />
              <Skeleton className="h-12 w-24 bg-white/10" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 flex-1 bg-[#D4AF37]/40" />
            <Skeleton className="h-12 flex-1 bg-white/10" />
          </div>

          {/* Fragrance Pyramid Skeleton */}
          <div className="p-6 bg-[#121216] border border-white/10 space-y-4 mt-8">
            <Skeleton className="h-5 w-40 bg-[#D4AF37]/30" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-full bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScentQuizSkeleton() {
  return (
    <div className="bg-[#141418] border border-[#D4AF37]/30 p-8 sm:p-12 space-y-6 text-center">
      <Skeleton className="h-6 w-48 mx-auto bg-[#D4AF37]/30" />
      <Skeleton className="h-4 w-64 mx-auto bg-white/10" />
      <Skeleton className="w-48 h-60 mx-auto bg-white/5 border border-white/10" />
      <Skeleton className="h-6 w-56 mx-auto bg-white/10" />
      <Skeleton className="h-10 w-44 mx-auto bg-[#D4AF37]/40" />
    </div>
  );
}

export function QuickViewSkeleton() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#121216]">
      <Skeleton className="w-full aspect-square bg-white/5 border border-white/10" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24 bg-[#D4AF37]/30" />
        <Skeleton className="h-6 w-3/4 bg-white/10" />
        <Skeleton className="h-5 w-20 bg-[#D4AF37]/40" />
        <Skeleton className="h-16 w-full bg-white/5" />
        <Skeleton className="h-10 w-full bg-white/10" />
      </div>
    </div>
  );
}

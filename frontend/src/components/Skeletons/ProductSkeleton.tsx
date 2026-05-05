export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
          {/* Image skeleton */}
          <div className="h-48 bg-gray-200" />
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductHeroSkeleton() {
  return (
    <div className="min-h-[600px] bg-gradient-to-b from-gray-200 to-gray-100 animate-pulse rounded-lg" />
  );
}

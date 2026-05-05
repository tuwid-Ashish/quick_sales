export function HeaderSkeleton() {
  return (
    <nav className="sticky top-0 z-40 bg-white/95 shadow-lg shadow-black/5 backdrop-blur-xl border-b border-cream-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Skeleton */}
          <div className="h-16 w-32 sm:h-20 bg-gray-200 rounded-md animate-pulse" />

          {/* Right side Button Skeleton */}
          <div className="h-10 w-40 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </nav>
  );
}

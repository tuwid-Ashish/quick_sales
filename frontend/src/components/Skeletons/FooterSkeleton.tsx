export function FooterSkeleton() {
  return (
    <footer className="relative bg-soil text-cream overflow-hidden border-t-8 border-leaf py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-8">
          {/* Logo Skeleton */}
          <div className="h-14 w-32 bg-gray-600 rounded-md animate-pulse" />

          {/* Text Skeleton */}
          <div className="space-y-2 w-full max-w-md">
            <div className="h-4 bg-gray-600 rounded animate-pulse" />
            <div className="h-4 bg-gray-600 rounded animate-pulse w-4/5 mx-auto" />
          </div>

          {/* Contact info skeleton */}
          <div className="flex gap-4">
            <div className="h-6 w-24 bg-gray-600 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-600 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}

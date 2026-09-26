export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square w-full animate-pulse bg-surface-offset" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-surface-offset" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-offset" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-offset" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

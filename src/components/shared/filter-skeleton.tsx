export function FilterSkeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`h-10 w-full max-w-md animate-pulse rounded bg-admin-surface-subtle ${className}`}
        />
    );
}

export function PaginationSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="h-4 w-24 animate-pulse rounded bg-admin-surface-subtle" />
            <div className="h-9 w-32 animate-pulse rounded bg-admin-surface-subtle" />
        </div>
    );
}
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewCardSkeleton() {
    return (
        <div className="border-b border-border py-8">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="mt-5 flex gap-8">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="mt-6 border-t border-border pt-5 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ReviewListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="border-t border-border">
            {Array.from({ length: count }).map((_, i) => (
                <ReviewCardSkeleton key={i} />
            ))}
        </div>
    );
}
import { Skeleton } from "@/components/ui/skeleton";

export function OpportunityCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-background p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-md" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
            </div>
            <div className="mt-3 flex gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="mt-4 flex gap-2">
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-5 w-24 rounded-md" />
            </div>
        </div>
    );
}

export function OpportunityListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: count }).map((_, i) => (
                <OpportunityCardSkeleton key={i} />
            ))}
        </div>
    );
}
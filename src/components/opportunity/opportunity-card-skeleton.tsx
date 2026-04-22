import { Skeleton } from "@/components/ui/skeleton";

export function OpportunityCardSkeleton() {
    return (
        <div className="border-b border-border py-6">
            <div className="flex items-start gap-5">
                <Skeleton className="size-14 rounded-md shrink-0" />
                <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-40" />
                        <div className="flex items-center gap-1">
                            <Skeleton className="h-5 w-14 rounded-full" />
                            <Skeleton className="size-9 rounded-md" />
                            <Skeleton className="size-9 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-3/4 max-w-[52ch]" />
                    <div className="flex gap-3">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-3 w-2/5" />
                </div>
            </div>
        </div>
    );
}

export function OpportunityListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="border-t border-border">
            {Array.from({ length: count }).map((_, i) => (
                <OpportunityCardSkeleton key={i} />
            ))}
        </div>
    );
}
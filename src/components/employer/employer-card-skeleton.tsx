import { Skeleton } from "@/components/ui/skeleton";

export function EmployerCardSkeleton() {
    return (
        <div className="border-b border-border py-6">
            <div className="flex items-start gap-5">
                <Skeleton className="size-14 rounded-md shrink-0" />
                <div className="min-w-0 flex-1 space-y-3">
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="space-y-1.5 pt-1">
                        <Skeleton className="h-3 w-full max-w-prose" />
                        <Skeleton className="h-3 w-4/5 max-w-prose" />
                    </div>
                    <Skeleton className="h-3 w-1/4 mt-3" />
                </div>
            </div>
        </div>
    );
}

export function EmployerListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="border-t border-border">
            {Array.from({ length: count }).map((_, i) => (
                <EmployerCardSkeleton key={i} />
            ))}
        </div>
    );
}
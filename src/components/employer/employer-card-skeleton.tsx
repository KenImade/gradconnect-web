import { Skeleton } from "@/components/ui/skeleton";

export function EmployerCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-background p-6">
            <div className="flex items-start gap-4">
                <Skeleton className="size-14 rounded-md shrink-0" />
                <div className="min-w-0 flex-1 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-1.5 pt-1">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                    </div>
                    <Skeleton className="h-3 w-1/3 mt-4" />
                </div>
            </div>
        </div>
    );
}

export function EmployerListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <EmployerCardSkeleton key={i} />
            ))}
        </div>
    );
}
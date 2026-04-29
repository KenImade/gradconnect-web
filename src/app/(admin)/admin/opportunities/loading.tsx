import { Skeleton } from "@/components/ui/skeleton";

export default function OpportunitiesLoading() {
    return (
        <div className="px-8 py-8 max-w-6xl">
            <div className="flex items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-10 w-72" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-9 w-44" />
            </div>

            <div className="mt-8 flex gap-3">
                <Skeleton className="h-10 flex-1 max-w-md" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="mt-2 border border-admin-border">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 border-b border-admin-border last:border-b-0 rounded-none" />
                ))}
            </div>
        </div>
    );
}
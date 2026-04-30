import { Skeleton } from "@/components/ui/skeleton";

export default function AssessmentsLoading() {
    return (
        <div className="px-8 py-8 max-w-6xl">
            <div className="flex items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-72" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-40" />
            </div>

            <div className="mt-8">
                <Skeleton className="h-10 max-w-md" />
            </div>

            <div className="mt-2 border border-admin-border">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-14 border-b border-admin-border last:border-b-0 rounded-none"
                    />
                ))}
            </div>
        </div>
    );
}
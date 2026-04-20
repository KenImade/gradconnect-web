import { Skeleton } from "@/components/ui/skeleton";
import { ReviewListSkeleton } from "@/components/review/review-card-skeleton";

export default function ReviewsLoading() {
    return (
        <div className="space-y-8">
            <div className="rounded-lg border border-border bg-surface-subtle p-6 space-y-4">
                <Skeleton className="h-5 w-40" />
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-[220px]" />
            </div>
            <ReviewListSkeleton count={3} />
        </div>
    );
}
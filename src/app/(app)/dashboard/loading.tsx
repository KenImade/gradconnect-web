import { Skeleton } from "@/components/ui/skeleton";
import { OpportunityListSkeleton } from "@/components/opportunity/opportunity-card-skeleton";

export default function DashboardLoading() {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-10 lg:py-14">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="mt-3 h-12 w-96" />
            <Skeleton className="mt-4 h-5 w-full max-w-prose" />

            <div className="mt-14">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-8 w-64" />
                <div className="mt-6">
                    <OpportunityListSkeleton count={3} />
                </div>
            </div>

            <div className="mt-14">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-2 h-8 w-80" />
                <div className="mt-6">
                    <OpportunityListSkeleton count={3} />
                </div>
            </div>
        </div>
    );
}
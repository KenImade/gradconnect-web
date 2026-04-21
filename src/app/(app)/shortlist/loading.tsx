import { Skeleton } from "@/components/ui/skeleton";
import { OpportunityListSkeleton } from "@/components/opportunity/opportunity-card-skeleton";

export default function ShortlistLoading() {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-10 lg:py-14">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-2 h-12 w-96" />
            <Skeleton className="mt-3 h-4 w-32" />

            <div className="mt-8">
                <OpportunityListSkeleton count={4} />
            </div>
        </div>
    );
}
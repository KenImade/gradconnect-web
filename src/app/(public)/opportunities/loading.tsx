import { OpportunityListSkeleton } from "@/components/opportunity/opportunity-card-skeleton";
import { OpportunityFilterBar } from "@/components/opportunity/opportunity-filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function OpportunitiesLoading() {
    return (
        <div className="container mx-auto px-4 py-12 lg:py-16">
            <PageHeader
                eyebrow="Opportunities"
                title="Graduate opportunities in Nigeria"
                description="Open graduate programmes, internships, and NYSC placements. Every listing links to its employer's hub — so you can read their process and reviews before you apply."
            />

            <div className="mt-8">
                <OpportunityFilterBar />
            </div>

            <Skeleton className="mt-6 h-4 w-32" />

            <div className="mt-6">
                <OpportunityListSkeleton count={6} />
            </div>

            <div className="mt-12 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="size-9 rounded-md" />
                ))}
            </div>
        </div>
    );
}
import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { listOpportunities } from "@/lib/api/endpoints/opportunities";
import { OpportunityCard } from "@/components/opportunity/opportunity-card";
import { OpportunityFilterBar } from "@/components/opportunity/opportunity-filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { parseOpportunityFilters } from "@/lib/validation/opportunity-filters";

export const metadata: Metadata = {
    title: "Graduate Opportunities in Nigeria",
    description:
        "Browse open graduate trainee programmes, internships, and NYSC-compatible roles in Nigeria. Search by industry, location, or discipline.",
    alternates: { canonical: "/opportunities" },
};

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OpportunitiesPage({ searchParams }: PageProps) {
    const filters = parseOpportunityFilters(await searchParams);

    const { data: opportunities, pagination } = await listOpportunities({
        q: filters.q,
        type: filters.type,
        status: filters.status,
        intake_year: filters.intake_year,
        industry: filters.industry,
        location: filters.location,
        discipline: filters.discipline,
        sort: filters.sort,
        order: filters.order,
        page: filters.page,
        page_size: 20,
    });

    const hasActiveFilters = Boolean(
        filters.q ||
        filters.type ||
        filters.status !== "open" ||
        filters.industry ||
        filters.location ||
        filters.discipline,
    );

    const totalRecords =
        "total_records" in pagination ? pagination.total_records : opportunities.length;
    const currentPage =
        "current_page" in pagination ? pagination.current_page : 1;
    const lastPage = "last_page" in pagination ? pagination.last_page : 1;

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

            <div className="mt-6 text-body-sm text-text-dim">
                {totalRecords === 0
                    ? "No results"
                    : `${totalRecords} ${totalRecords === 1 ? "opportunity" : "opportunities"}${hasActiveFilters ? " match your filters" : ""}`}
            </div>

            {opportunities.length === 0 ? (
                <EmptyState
                    className="mt-8"
                    icon={Briefcase}
                    title={
                        hasActiveFilters
                            ? "No opportunities match your filters"
                            : "No open opportunities right now"
                    }
                    description={
                        hasActiveFilters
                            ? "Try removing a filter or broadening your search."
                            : "Check back soon — new graduate programmes are added regularly."
                    }
                />
            ) : (
                <>
                    <div className="mt-6 border-t border-border">
                        {opportunities.map((opportunity) => (
                            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                        ))}
                    </div>

                    <Pagination
                        className="mt-12"
                        currentPage={currentPage}
                        lastPage={lastPage}
                    />
                </>
            )}
        </div>
    );
}
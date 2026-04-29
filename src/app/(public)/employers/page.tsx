import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { listEmployers } from "@/lib/api/endpoints/employers.server";
import { EmployerCard } from "@/components/employer/employer-card";
import { EmployerFilterBar } from "@/components/employer/employer-filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { parseEmployerFilters } from "@/lib/validation/employer-filters";

export const metadata: Metadata = {
    title: "Graduate Employers in Nigeria",
    description:
        "Browse verified graduate employers hiring in Nigeria — banks, consulting firms, FMCG, oil & gas, and tech. Find your next career opportunity.",
    alternates: {
        canonical: "/employers",
    },
};

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EmployersPage({ searchParams }: PageProps) {
    const filters = parseEmployerFilters(await searchParams);

    const { data: employers, pagination } = await listEmployers({
        q: filters.q,
        industry: filters.industry,
        is_verified: filters.is_verified,
        sort: filters.sort,
        order: filters.order,
        page: filters.page,
        page_size: 30,
    });

    const hasActiveFilters = Boolean(
        filters.q || filters.industry || filters.is_verified !== undefined,
    );

    const totalRecords =
        "total_records" in pagination ? pagination.total_records : employers.length;
    const currentPage =
        "current_page" in pagination ? pagination.current_page : 1;
    const lastPage = "last_page" in pagination ? pagination.last_page : 1;

    return (
        <div className="container mx-auto px-4 py-12 lg:py-16">
            <PageHeader
                eyebrow="Employers"
                title="Graduate employers in Nigeria"
                description="Browse verified companies hiring graduates across banking, consulting, oil & gas, FMCG, and technology. Every profile includes assessment process details and candidate reviews."
            />

            <div className="mt-8">
                <EmployerFilterBar />
            </div>

            <div className="mt-6 text-body-sm text-text-dim">
                {totalRecords === 0
                    ? "No results"
                    : `${totalRecords} ${totalRecords === 1 ? "employer" : "employers"}${hasActiveFilters ? " match your filters" : ""}`}
            </div>

            {employers.length === 0 ? (
                <EmptyState
                    className="mt-8"
                    icon={Building2}
                    title={
                        hasActiveFilters
                            ? "No employers match your filters"
                            : "No employers yet"
                    }
                    description={
                        hasActiveFilters
                            ? "Try removing a filter or broadening your search."
                            : "We're building our directory. Check back soon."
                    }
                />
            ) : (
                <>
                    <div className="mt-6 border-t border-border">
                        {employers.map((employer) => (
                            <EmployerCard key={employer.id} employer={employer} />
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
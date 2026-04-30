import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listEmployers } from "@/lib/api/endpoints/employers.server";
import { AdminEmployerFilters } from "@/components/admin/employer/employer-filters";
import { AdminEmployerTable } from "@/components/admin/employer/employer-table";
import { Suspense } from "react";
import { FilterSkeleton } from "@/components/shared/filter-skeleton";

export const metadata: Metadata = { title: "Employers" };

type SearchParams = {
    q?: string;
    industry?: string;
    is_verified?: string;
    page?: string;
};

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function AdminEmployersPage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const page = sp.page ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

    const params: Parameters<typeof listEmployers>[0] = {
        page,
        page_size: 50,
        sort: "name",
    };
    if (sp.q) params.q = sp.q;
    if (sp.industry) params.industry = sp.industry;
    if (sp.is_verified === "true" || sp.is_verified === "false") {
        params.is_verified = sp.is_verified === "true";
    }

    const { data: employers, pagination } = await listEmployers(params);

    return (
        <div className="px-8 py-8">
            <div className="max-w-6xl">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-caption uppercase tracking-wider text-admin-text-faint">
                            Employers
                        </p>
                        <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                            All employers
                        </h1>
                        <p className="mt-2 text-body-sm text-admin-text-dim">
                            {pagination.total_records}{" "}
                            {pagination.total_records === 1 ? "employer" : "employers"} on the platform.
                        </p>
                    </div>
                    <Link
                        href="/admin/employers/new"
                        className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                    >
                        <Plus className="size-4" />
                        New employer
                    </Link>
                </div>

                <div className="mt-8">
                    <Suspense fallback={<FilterSkeleton />}>
                        <AdminEmployerFilters />
                    </Suspense>
                </div>

                <div className="mt-2">
                    <AdminEmployerTable employers={employers} />
                </div>
            </div>
        </div>
    );
}
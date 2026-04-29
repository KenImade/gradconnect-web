import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminOpportunityFilters } from "@/components/admin/opportunity/opportunity-filters";
import { AdminOpportunityTable } from "@/components/admin/opportunity/opportunity-table";
import type {
    OpportunityType,
} from "@/lib/api/endpoints/opportunities.types";
import {
    listAdminOpportunities,
    type ListAdminOpportunitiesParams,
} from "@/lib/api/endpoints/admin-opportunities.server";

export const metadata: Metadata = { title: "Opportunities" };

type SearchParams = {
    q?: string;
    type?: string;
    status?: string;
    page?: string;
};

type PageProps = {
    searchParams: Promise<SearchParams>;
};

const VALID_TYPES = new Set([
    "graduate_trainee",
    "internship",
    "nysc",
    "industrial_attachment",
]);
const VALID_STATUSES = new Set([
    "all",
    "open",
    "upcoming",
    "closed",
    "withdrawn",
]);

export default async function AdminOpportunitiesPage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const page = sp.page ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

    const params: ListAdminOpportunitiesParams = {
        page,
        page_size: 50,
    };
    if (sp.q) params.q = sp.q;
    if (sp.type && VALID_TYPES.has(sp.type)) {
        params.type = sp.type as OpportunityType;
    }
    if (sp.status && VALID_STATUSES.has(sp.status)) {
        params.status = sp.status as ListAdminOpportunitiesParams["status"];
    }

    const { data: opportunities, pagination } = await listAdminOpportunities(params);

    return (
        <div className="px-8 py-8">
            <div className="max-w-6xl">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-caption uppercase tracking-wider text-admin-text-faint">
                            Opportunities
                        </p>
                        <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                            All opportunities
                        </h1>
                        <p className="mt-2 text-body-sm text-admin-text-dim">
                            {pagination.total_records}{" "}
                            {pagination.total_records === 1
                                ? "opportunity"
                                : "opportunities"}{" "}
                            on the platform.
                        </p>
                    </div>
                    <Link
                        href="/admin/opportunities/new"
                        className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                    >
                        <Plus className="size-4" />
                        New opportunity
                    </Link>
                </div>

                <div className="mt-8">
                    <AdminOpportunityFilters />
                </div>

                <div className="mt-2">
                    <AdminOpportunityTable opportunities={opportunities} />
                </div>
            </div>
        </div>
    );
}
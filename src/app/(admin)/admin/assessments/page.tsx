import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
    listAdminAssessments,
    type ListAdminAssessmentsParams,
} from "@/lib/api/endpoints/admin-assessments.server";
import { AdminAssessmentFilters } from "@/components/admin/assessment/assessment-filters";
import { AdminAssessmentTable } from "@/components/admin/assessment/assessment-table";
import { Suspense } from "react";
import { FilterSkeleton } from "@/components/shared/filter-skeleton";

export const metadata: Metadata = { title: "Assessments" };

type SearchParams = {
    q?: string;
    employer_id?: string;
    page?: string;
};

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function AdminAssessmentsPage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const page = sp.page ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

    const params: ListAdminAssessmentsParams = {
        page,
        page_size: 50,
    };
    if (sp.q) params.q = sp.q;
    if (sp.employer_id) params.employer_id = sp.employer_id;

    const { data: assessments, pagination } = await listAdminAssessments(params);

    return (
        <div className="px-8 py-8">
            <div className="max-w-6xl">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-caption uppercase tracking-wider text-admin-text-faint">
                            Assessments
                        </p>
                        <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                            All assessments
                        </h1>
                        <p className="mt-2 text-body-sm text-admin-text-dim">
                            {pagination.total_records}{" "}
                            {pagination.total_records === 1
                                ? "assessment"
                                : "assessments"}{" "}
                            on the platform.
                        </p>
                    </div>
                    <Link
                        href="/admin/assessments/new"
                        className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-body-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                    >
                        <Plus className="size-4" />
                        New assessment
                    </Link>
                </div>

                <div className="mt-8">
                    <Suspense fallback={<FilterSkeleton />}>
                        <AdminAssessmentFilters />
                    </Suspense>
                </div>

                <div className="mt-2">
                    <AdminAssessmentTable assessments={assessments} />
                </div>
            </div>
        </div>
    );
}
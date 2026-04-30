import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AssessmentForm } from "@/components/admin/assessment/assessment-form";
import { getAdminAssessmentById } from "@/lib/api/endpoints/admin-assessments.server";
import { APIError } from "@/lib/api/errors";
import type { Assessment } from "@/lib/api/endpoints/assessments.types";

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const a = await getAdminAssessmentById(id);
        return { title: `Edit ${a.employer.name} — ${a.programme_type}` };
    } catch {
        return { title: "Edit assessment" };
    }
}

export default async function EditAssessmentPage({ params }: PageProps) {
    const { id } = await params;

    let assessment: Assessment;
    try {
        assessment = await getAdminAssessmentById(id);
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) notFound();
        throw err;
    }

    return (
        <div className="px-8 py-8">
            <div className="max-w-3xl">
                <Link
                    href="/admin/assessments"
                    className="inline-flex items-center gap-1 text-body-sm text-admin-text-dim hover:text-admin-foreground transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    All assessments
                </Link>

                <p className="mt-4 text-caption uppercase tracking-wider text-admin-text-faint">
                    Edit assessment
                </p>
                <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                    {assessment.programme_type}
                </h1>
                <p className="mt-2 text-body-sm text-admin-text-dim italic">
                    {assessment.employer.name}
                </p>

                <div className="mt-10">
                    <AssessmentForm initial={assessment} />
                </div>
            </div>
        </div>
    );
}
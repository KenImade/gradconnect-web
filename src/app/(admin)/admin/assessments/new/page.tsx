import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AssessmentForm } from "@/components/admin/assessment/assessment-form";

export const metadata: Metadata = { title: "New assessment" };

export default function NewAssessmentPage() {
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
                    New assessment
                </p>
                <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                    Add an assessment
                </h1>
                <p className="mt-2 text-body-sm text-admin-text-dim">
                    Document the recruitment process for an employer&apos;s programme.
                </p>

                <div className="mt-10">
                    <AssessmentForm />
                </div>
            </div>
        </div>
    );
}
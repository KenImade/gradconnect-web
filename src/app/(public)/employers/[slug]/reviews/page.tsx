import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { getEmployer } from "@/lib/api/endpoints/employers";
import { APIError } from "@/lib/api/errors";
import { EmptyState } from "@/components/shared/empty-state";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const { data: employer } = await getEmployer(slug);
        return {
            title: `${employer.name} — Community Reviews from Past Candidates`,
            description: `Anonymous reviews from candidates who applied to ${employer.name}'s graduate programmes. Difficulty ratings, interview tips, and stage-by-stage breakdowns.`,
            alternates: { canonical: `/employers/${employer.slug}/reviews` },
        };
    } catch {
        return { title: "Reviews not found" };
    }
}

export default async function EmployerReviewsPage({ params }: PageProps) {
    const { slug } = await params;

    try {
        await getEmployer(slug);
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) notFound();
        throw err;
    }

    return (
        <EmptyState
            icon={MessageSquare}
            title="Reviews coming soon"
            description="Community reviews from past candidates — including stage-by-stage breakdowns, difficulty ratings, and tips — will appear here once we wire up the reviews endpoint."
        />
    );
}
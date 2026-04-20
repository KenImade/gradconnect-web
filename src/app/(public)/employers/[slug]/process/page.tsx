import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Construction } from "lucide-react";
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
            title: `${employer.name} — Hiring Process & Assessment Guide`,
            description: `Step-by-step breakdown of ${employer.name}'s graduate recruitment process, assessment stages, and preparation tips.`,
            alternates: { canonical: `/employers/${employer.slug}/process` },
        };
    } catch {
        return { title: "Process not found" };
    }
}

export default async function EmployerProcessPage({ params }: PageProps) {
    const { slug } = await params;

    // Confirm the employer exists (header is rendered by the layout, but if this
    // page is hit directly with a bad slug, the layout's notFound() catches it.)
    try {
        await getEmployer(slug);
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) notFound();
        throw err;
    }

    return (
        <EmptyState
            icon={Construction}
            title="Process details coming soon"
            description="Detailed breakdown of the application stages, aptitude tests, and interview format will land here in the next slice. In the meantime, check the Reviews tab for first-hand candidate experiences."
        />
    );
}
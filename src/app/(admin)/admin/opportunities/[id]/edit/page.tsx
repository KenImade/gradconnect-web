import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OpportunityForm } from "@/components/admin/opportunity/opportunity-form";
import { getAdminOpportunityById } from "@/lib/api/endpoints/admin-opportunities.server";
import { APIError } from "@/lib/api/errors";
import type { Opportunity } from "@/lib/api/endpoints/opportunities.types";

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const o = await getAdminOpportunityById(id);
        return { title: `Edit ${o.title}` };
    } catch {
        return { title: "Edit opportunity" };
    }
}

export default async function EditOpportunityPage({ params }: PageProps) {
    const { id } = await params;

    let opportunity: Opportunity;
    try {
        opportunity = await getAdminOpportunityById(id);
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) notFound();
        throw err;
    }

    return (
        <div className="px-8 py-8">
            <div className="max-w-3xl">
                <Link
                    href="/admin/opportunities"
                    className="inline-flex items-center gap-1 text-body-sm text-admin-text-dim hover:text-admin-foreground transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    All opportunities
                </Link>

                <p className="mt-4 text-caption uppercase tracking-wider text-admin-text-faint">
                    Edit opportunity
                </p>
                <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                    {opportunity.title}
                </h1>
                <p className="mt-2 text-body-sm text-admin-text-dim italic">
                    {opportunity.employer.name}
                </p>

                <div className="mt-10">
                    <OpportunityForm initial={opportunity} />
                </div>
            </div>
        </div>
    );
}
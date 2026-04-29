import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OpportunityForm } from "@/components/admin/opportunity/opportunity-form";

export const metadata: Metadata = { title: "New opportunity" };

export default function NewOpportunityPage() {
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
                    New opportunity
                </p>
                <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                    Add an opportunity
                </h1>
                <p className="mt-2 text-body-sm text-admin-text-dim">
                    Create a new programme listing. The slug will appear in the public URL.
                </p>

                <div className="mt-10">
                    <OpportunityForm />
                </div>
            </div>
        </div>
    );
}
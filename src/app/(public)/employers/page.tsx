import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { listEmployers } from "@/lib/api/endpoints/employers";
import { EmployerCard } from "@/components/employer/employer-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
    title: "Graduate Employers in Nigeria",
    description:
        "Browse verified graduate employers hiring in Nigeria — banks, consulting firms, FMCG, oil & gas, and tech. Find your next career opportunity.",
    alternates: {
        canonical: "/employers",
    },
};

export default async function EmployersPage() {
    const { data: employers, pagination } = await listEmployers({
        page: 1,
        page_size: 30,
    });

    return (
        <div className="container mx-auto px-4 py-12 lg:py-16">
            <PageHeader
                eyebrow="Employers"
                title="Graduate employers in Nigeria"
                description="Browse verified companies hiring graduates across banking, consulting, oil & gas, FMCG, and technology. Every profile includes assessment process details and candidate reviews."
            />

            <div className="mt-4 text-body-sm text-text-dim">
                {pagination.total_records}{" "}
                {pagination.total_records === 1 ? "employer" : "employers"}
            </div>

            {employers.length === 0 ? (
                <EmptyState
                    className="mt-12"
                    icon={Building2}
                    title="No employers yet"
                    description="We're building our directory. Check back soon, or sign up to be notified when new employers are added."
                />
            ) : (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {employers.map((employer) => (
                        <EmployerCard key={employer.id} employer={employer} />
                    ))}
                </div>
            )}
        </div>
    );
}
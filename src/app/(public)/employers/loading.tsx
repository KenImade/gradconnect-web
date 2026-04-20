import { EmployerListSkeleton } from "@/components/employer/employer-card-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployersLoading() {
    return (
        <div className="container mx-auto px-4 py-12 lg:py-16">
            <PageHeader
                eyebrow="Employers"
                title="Graduate employers in Nigeria"
                description="Browse verified companies hiring graduates across banking, consulting, oil & gas, FMCG, and technology. Every profile includes assessment process details and candidate reviews."
            />

            <Skeleton className="mt-4 h-4 w-24" />

            <div className="mt-8">
                <EmployerListSkeleton count={6} />
            </div>
        </div>
    );
}
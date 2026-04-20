import { EmployerListSkeleton } from "@/components/employer/employer-card-skeleton";
import { EmployerFilterBar } from "@/components/employer/employer-filter-bar";
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

            <div className="mt-8">
                <EmployerFilterBar />
            </div>

            <Skeleton className="mt-6 h-4 w-24" />

            <div className="mt-6">
                <EmployerListSkeleton count={6} />
            </div>

            <div className="mt-12 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="size-9 rounded-md" />
                ))}
            </div>
        </div>
    );
}
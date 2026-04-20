import Link from "next/link";
import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function EmployerNotFound() {
    return (
        <div className="container mx-auto px-4 py-16 lg:py-24">
            <EmptyState
                icon={Building2}
                title="Employer not found"
                description="We couldn't find an employer at that URL. They may have been removed, or the link might be wrong."
                action={
                    <Link
                        href="/employers"
                        className="rounded-md bg-primary px-5 py-2.5 text-body-sm text-primary-foreground hover:bg-primary-hover transition-colors"
                    >
                        Browse all employers
                    </Link>
                }
            />
        </div>
    );
}
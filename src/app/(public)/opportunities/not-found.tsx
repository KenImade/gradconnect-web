import Link from "next/link";
import { Briefcase } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function OpportunityNotFound() {
    return (
        <div className="container mx-auto px-4 py-16 lg:py-24">
            <EmptyState
                icon={Briefcase}
                title="Opportunity not found"
                description="This listing may have been removed or the link is wrong. Try browsing all open opportunities."
                action={
                    <Link
                        href="/opportunities"
                        className="rounded-md bg-primary px-5 py-2.5 text-body-sm text-primary-foreground hover:bg-primary-hover transition-colors"
                    >
                        Browse opportunities
                    </Link>
                }
            />
        </div>
    );
}
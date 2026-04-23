import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { User } from "@/lib/api/endpoints/users.types";

export function FinalCTA({ user }: { user: User | null }) {
    if (user) {
        // Already signed in — nudge them into product, not sign-up.
        return (
            <div className="text-center">
                <h2 className="font-display text-display-md text-foreground">
                    Ready when you are.
                </h2>
                <p className="mt-4 text-body-md text-text-dim max-w-xl mx-auto">
                    Your dashboard has opportunities matched to your interests, deadlines
                    for your shortlist, and your application tracker.
                </p>
                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-body-md text-primary-foreground hover:bg-primary-hover transition-colors"
                    >
                        Go to your dashboard
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center">
            <h2 className="font-display text-display-md text-foreground">
                Start your search today.
            </h2>
            <p className="mt-4 text-body-md text-text-dim max-w-xl mx-auto">
                Create a free account to save opportunities, track applications, and
                receive deadline reminders.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-body-md text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                    Create an account
                    <ArrowRight className="size-4" />
                </Link>
                <Link
                    href="/opportunities"
                    className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-transparent px-6 py-3 text-body-md text-foreground hover:bg-surface-subtle transition-colors"
                >
                    Keep browsing
                </Link>
            </div>
        </div>
    );
}
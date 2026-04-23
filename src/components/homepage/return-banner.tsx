import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import type { User } from "@/lib/api/endpoints/users.types";

export function ReturnBanner({ user }: { user: User }) {
    const firstName = user.name.split(/\s+/)[0] || user.name;

    return (
        <div className="border-b border-border bg-surface-subtle">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-2 text-body-sm text-text-dim">
                        <LayoutDashboard className="size-4 text-text-faint" />
                        Welcome back, {firstName}.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 text-body-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                        Return to your dashboard
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
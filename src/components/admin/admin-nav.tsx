"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Inbox,
    Building2,
    Briefcase,
    ClipboardList,
    ArrowLeftToLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/api/endpoints/users.types";

type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    matcher?: (pathname: string) => boolean;
};

const ITEMS: NavItem[] = [
    {
        label: "Moderation",
        href: "/admin/moderation",
        icon: Inbox,
        matcher: (p) => p.startsWith("/admin/moderation") || p === "/admin",
    },
    {
        label: "Employers",
        href: "/admin/employers",
        icon: Building2,
    },
    {
        label: "Opportunities",
        href: "/admin/opportunities",
        icon: Briefcase,
    },
    {
        label: "Assessments",
        href: "/admin/assessments",
        icon: ClipboardList,
    },
];

export function AdminNav({ user }: { user: User }) {
    const pathname = usePathname();

    return (
        <aside className="sticky top-0 h-screen w-60 shrink-0 border-r border-admin-border bg-admin-surface flex flex-col">
            {/* Header */}
            <div className="px-4 py-5 border-b border-admin-border">
                <Link
                    href="/admin"
                    className="block font-display text-heading-md text-admin-foreground hover:text-primary transition-colors"
                >
                    GradConnect
                </Link>
                <p className="mt-1 text-caption uppercase tracking-wider text-admin-text-faint">
                    Admin
                </p>
            </div>

            {/* Nav items */}
            <nav className="flex-1 py-3" aria-label="Admin sections">
                <ul className="space-y-0.5">
                    {ITEMS.map((item) => {
                        const isActive = item.matcher
                            ? item.matcher(pathname)
                            : pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2.5 px-4 py-2 text-body-sm transition-colors",
                                        isActive
                                            ? "bg-admin-surface-subtle text-admin-foreground font-medium border-l-2 border-primary"
                                            : "text-admin-text-dim hover:bg-admin-surface-subtle hover:text-admin-foreground border-l-2 border-transparent",
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer — user identity + back-to-product */}
            <div className="border-t border-admin-border px-4 py-3 text-caption text-admin-text-faint">
                <p className="truncate">{user.email}</p>
                <Link
                    href="/dashboard"
                    className="mt-2 inline-flex items-center gap-1 text-admin-text-dim hover:text-admin-foreground transition-colors"
                >
                    <ArrowLeftToLine className="size-3" />
                    Back to product
                </Link>
            </div>
        </aside>
    );
}
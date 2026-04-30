import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export const metadata: Metadata = {
    title: "Not found",
    robots: { index: false, follow: false },
};

export default function AdminNotFound() {
    return (
        <div className="px-8 py-16 max-w-2xl">
            <div className="inline-flex items-center justify-center size-12 rounded-full bg-admin-surface-subtle text-admin-text-faint">
                <FileQuestion className="size-5" />
            </div>

            <p className="mt-4 text-caption uppercase tracking-wider text-admin-text-faint">
                404
            </p>
            <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                Not found
            </h1>
            <p className="mt-2 text-body-sm text-admin-text-dim">
                This record doesn&apos;t exist, or it was deleted. The URL might
                also be mistyped.
            </p>

            <div className="mt-8 flex flex-col gap-2">
                <Link
                    href="/admin/employers"
                    className="inline-flex items-center gap-2 text-body-sm text-admin-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="size-3.5" />
                    All employers
                </Link>
                <Link
                    href="/admin/opportunities"
                    className="inline-flex items-center gap-2 text-body-sm text-admin-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="size-3.5" />
                    All opportunities
                </Link>
                <Link
                    href="/admin/assessments"
                    className="inline-flex items-center gap-2 text-body-sm text-admin-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="size-3.5" />
                    All assessments
                </Link>
                <Link
                    href="/admin/moderation"
                    className="inline-flex items-center gap-2 text-body-sm text-admin-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="size-3.5" />
                    Moderation queue
                </Link>
            </div>
        </div>
    );
}
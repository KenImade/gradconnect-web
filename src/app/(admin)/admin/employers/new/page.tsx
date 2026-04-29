import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmployerForm } from "@/components/admin/employer/employer-form";

export const metadata: Metadata = { title: "New employer" };

export default function NewEmployerPage() {
    return (
        <div className="px-8 py-8">
            <div className="max-w-3xl">
                <Link
                    href="/admin/employers"
                    className="inline-flex items-center gap-1 text-body-sm text-admin-text-dim hover:text-admin-foreground transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    All employers
                </Link>

                <p className="mt-4 text-caption uppercase tracking-wider text-admin-text-faint">
                    New employer
                </p>
                <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                    Add an employer
                </h1>
                <p className="mt-2 text-body-sm text-admin-text-dim">
                    Create a new employer profile. The slug will appear in the public URL.
                </p>

                <div className="mt-10">
                    <EmployerForm />
                </div>
            </div>
        </div>
    );
}
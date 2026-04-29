import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EmployerForm } from "@/components/admin/employer/employer-form";
import { getAdminEmployerById } from "@/lib/api/endpoints/admin-employers.server";
import { APIError } from "@/lib/api/errors";
import type { Employer } from "@/lib/api/endpoints/employers.types";

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const employer = await getAdminEmployerById(id);
        return { title: `Edit ${employer.name}` };
    } catch {
        return { title: "Edit employer" };
    }
}

export default async function EditEmployerPage({ params }: PageProps) {
    const { id } = await params;

    let employer: Employer;
    try {
        employer = await getAdminEmployerById(id);
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) notFound();
        throw err;
    }

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
                    Edit employer
                </p>
                <h1 className="mt-1 font-display text-display-md text-admin-foreground">
                    {employer.name}
                </h1>
                <p className="mt-2 text-body-sm text-admin-text-dim">
                    Last updated{" "}
                    {new Date(employer.updated_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                    .
                </p>

                <div className="mt-10">
                    <EmployerForm initial={employer} />
                </div>
            </div>
        </div>
    );
}
import { notFound } from "next/navigation";
import { getEmployer } from "@/lib/api/endpoints/employers.server";
import { APIError } from "@/lib/api/errors";
import { EmployerHubHeader } from "@/components/employer/employer-hub-header";
import { EmployerHubTabs } from "@/components/employer/employer-hub-tabs";

export default async function EmployerHubLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let employer;
    try {
        const result = await getEmployer(slug);
        employer = result.data;
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) {
            notFound();
        }
        throw err;
    }

    return (
        <div>
            <EmployerHubHeader employer={employer} />
            <EmployerHubTabs slug={slug} />
            <div className="container mx-auto px-4 py-10 lg:py-12">{children}</div>
        </div>
    );
}
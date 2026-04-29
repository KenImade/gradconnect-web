import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getEmployer } from "@/lib/api/endpoints/employers.server";
import { APIError } from "@/lib/api/errors";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const { data: employer } = await getEmployer(slug);
        const description = employer.overview
            ? truncate(employer.overview, 160)
            : `${employer.name} graduate programme information, hiring process, and community reviews.`;

        return {
            title: `${employer.name} — Graduate Programme, Hiring Process & Reviews`,
            description,
            alternates: { canonical: `/employers/${employer.slug}` },
            openGraph: {
                title: `${employer.name} on GradConnect`,
                description,
                type: "profile",
                url: `/employers/${employer.slug}`,
            },
            twitter: { card: "summary_large_image" },
        };
    } catch {
        return { title: "Employer not found" };
    }
}

export default async function EmployerOverviewPage({ params }: PageProps) {
    const { slug } = await params;

    let employer;
    try {
        const result = await getEmployer(slug);
        employer = result.data;
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) notFound();
        throw err;
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: employer.name,
        url: employer.website ?? undefined,
        logo: employer.logo_url ?? undefined,
        description: employer.overview ?? undefined,
        address: employer.hq_location
            ? { "@type": "PostalAddress", addressLocality: employer.hq_location }
            : undefined,
        sameAs: Object.values(employer.social_links).filter(Boolean),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-10 lg:col-span-2">
                    {employer.overview && (
                        <section>
                            <h2 className="font-display text-heading-xl text-foreground">
                                About {employer.name}
                            </h2>
                            <p className="mt-4 whitespace-pre-line text-body-md text-text-dim max-w-prose">
                                {employer.overview}
                            </p>
                        </section>
                    )}

                    {employer.culture && (
                        <section>
                            <h2 className="font-display text-heading-xl text-foreground">
                                Culture
                            </h2>
                            <p className="mt-4 whitespace-pre-line text-body-md text-text-dim max-w-prose">
                                {employer.culture}
                            </p>
                        </section>
                    )}

                    {employer.offices.length > 0 && (
                        <section>
                            <h2 className="font-display text-heading-xl text-foreground">
                                Offices
                            </h2>
                            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                {employer.offices.map((office, idx) => (
                                    <li
                                        key={idx}
                                        className="rounded-md border border-border bg-surface-subtle p-4"
                                    >
                                        <p className="inline-flex items-center gap-2 font-medium text-foreground">
                                            <MapPin className="size-4 text-text-dim" />
                                            {office.city}
                                            {office.state && `, ${office.state}`}
                                        </p>
                                        {office.address && (
                                            <p className="mt-1 text-body-sm text-text-dim">
                                                {office.address}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <SidebarCard title="Active opportunities">
                        <p className="text-body-sm text-text-dim">
                            Opportunity listings load here in Slice 10.
                        </p>
                    </SidebarCard>

                    <SidebarCard title="Recent reviews">
                        <p className="text-body-sm text-text-dim">
                            Community reviews load here in Slice 9.
                        </p>
                    </SidebarCard>
                </aside>
            </div>
        </>
    );
}

function SidebarCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-border bg-background p-6">
            <h3 className="font-display text-heading-md text-foreground">{title}</h3>
            <div className="mt-4">{children}</div>
        </div>
    );
}

function truncate(s: string, max: number): string {
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trimEnd() + "…";
}
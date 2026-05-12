import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getEmployer } from "@/lib/api/endpoints/employers.server";
import { listOpportunities } from "@/lib/api/endpoints/opportunities";
import { listEmployerReviews } from "@/lib/api/endpoints/reviews.server";
import { APIError } from "@/lib/api/errors";
import { Employer } from "@/lib/api/endpoints/employers.types";
import {
    employerOrganizationSchema,
    breadcrumbSchema,
} from "@/lib/seo/structured-data";
import { absoluteUrl, SITE } from "@/lib/seo/config";
import { JsonLd } from "@/components/shared/json-ld";
import { EmployerOpportunitiesSidebar } from "@/components/employer/employer-opportunities-sidebar";
import { EmployerReviewsSidebar } from "@/components/employer/employer-reviews-sidebar";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    let employer: Employer;
    try {
        employer = (await getEmployer(slug)).data;
    } catch {
        return { title: "Employer not found" };
    }

    const title = `${employer.name} — ${employer.industry}`;
    const description =
        employer.overview?.slice(0, 160).trim() +
        (employer.overview && employer.overview.length > 160 ? "…" : "") ||
        `${employer.name} careers, graduate programmes, and assessment process insights from candidates.`;
    const url = absoluteUrl(`/employers/${employer.slug}`);

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type: "profile",
            url,
            title,
            description,
            siteName: SITE.name,
            locale: SITE.locale,
            images: [
                {
                    url: absoluteUrl(`/api/og/employer/${employer.slug}`),
                    width: 1200,
                    height: 630,
                    alt: employer.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            site: SITE.twitter,
            images: [absoluteUrl(`/api/og/employer/${employer.slug}`)],
        },
    };
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

    const [opportunitiesResult, reviewsResult] = await Promise.allSettled([
        listOpportunities({
            employer_slug: slug,
            status: "open_or_upcoming",
            page_size: 5,
            sort: "-deadline",
            order: "asc",
        }),
        listEmployerReviews(slug, {
            page_size: 3,
            sort: "-created_at",
            order: "desc",
        }),
    ]);

    const opportunities =
        opportunitiesResult.status === "fulfilled"
            ? opportunitiesResult.value.data
            : [];
    const reviews =
        reviewsResult.status === "fulfilled"
            ? reviewsResult.value.data
            : [];

    const orgSchema = employerOrganizationSchema(employer);
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: absoluteUrl("/") },
        { name: "Employers", url: absoluteUrl("/employers") },
        { name: employer.name, url: absoluteUrl(`/employers/${employer.slug}`) },
    ]);

    return (
        <>
            <JsonLd data={[orgSchema, breadcrumbs]} />

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

                    {(employer.offices?.length ?? 0) > 0 && (
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
                    <EmployerOpportunitiesSidebar
                        employerSlug={employer.slug}
                        employerName={employer.name}
                        opportunities={opportunities}
                    />
                    <EmployerReviewsSidebar
                        employerSlug={employer.slug}
                        employerName={employer.name}
                        reviews={reviews}
                    />
                </aside>
            </div>
        </>
    );
}
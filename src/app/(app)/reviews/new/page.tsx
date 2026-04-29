import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireVerifiedSession } from "@/lib/auth/session";
import { getEmployer } from "@/lib/api/endpoints/employers.server";
import { APIError } from "@/lib/api/errors";
import { ReviewForm } from "@/components/review/review-form";
import { EmployerPicker } from "@/components/review/employer-picker";

export const metadata: Metadata = {
    title: "Share your experience",
    description: "Contribute a review of a graduate recruitment process you've been through.",
};

type SearchParams = {
    employer?: string;
};

type PageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function NewReviewPage({ searchParams }: PageProps) {
    const user = await requireVerifiedSession();

    // Permission gate
    if (!user.permissions.includes("review:submit")) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <h1 className="font-display text-display-md text-foreground">
                    You can&apos;t submit reviews right now
                </h1>
                <p className="mt-4 text-body-md text-text-dim">
                    Your account doesn&apos;t have the permission to submit reviews. This might be because your account was recently flagged or is missing a required step.
                </p>
            </div>
        );
    }

    const { employer: employerSlug } = await searchParams;

    // No employer chosen yet — show the picker
    if (!employerSlug) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-10 lg:py-14">
                <p className="text-caption uppercase tracking-wider text-text-faint">
                    Share your experience
                </p>
                <h1 className="mt-2 font-display text-display-lg text-foreground">
                    Which employer?
                </h1>
                <p className="mt-3 text-body-md text-text-dim max-w-prose">
                    Pick the employer whose graduate recruitment process you&apos;ve been through. If you don&apos;t see them, their profile may not be on GradConnect yet.
                </p>

                <div className="mt-10">
                    <EmployerPicker />
                </div>
            </div>
        );
    }

    // Resolve the employer. Only the fetch is in the try; JSX is rendered
    // after the try/catch completes.
    let employer;
    try {
        const result = await getEmployer(employerSlug);
        employer = result.data;
    } catch (err) {
        if (APIError.isAPIError(err) && err.status === 404) {
            redirect("/reviews/new");
        }
        throw err;
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-10 lg:py-14">
            <p className="text-caption uppercase tracking-wider text-text-faint">
                Share your experience
            </p>
            <h1 className="mt-2 font-display text-display-lg text-foreground">
                Your review of {employer.name}
            </h1>
            <p className="mt-3 text-body-md text-text-dim max-w-prose">
                This review helps other candidates prepare. It&apos;s posted anonymously after a quick moderation check.
            </p>

            <div className="mt-12">
                <ReviewForm
                    employerId={employer.id}
                    employerName={employer.name}
                    employerSlug={employer.slug}
                />
            </div>
        </div>
    );
}
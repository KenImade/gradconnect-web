import type { Metadata } from "next";
import Link from "next/link";
import { SITE, absoluteUrl } from "@/lib/seo/config";

const LAST_UPDATED = "1 May 2026";

export const metadata: Metadata = {
    title: "Privacy",
    description:
        "How GradConnect collects, uses, stores, and protects your personal information.",
    alternates: { canonical: absoluteUrl("/privacy") },
    robots: { index: true, follow: true },
};

export default function PrivacyPage() {
    return (
        <main>
            <section className="container mx-auto px-4 py-16 lg:py-20">
                <div className="mx-auto max-w-3xl">
                    <p className="text-caption uppercase tracking-wider text-text-faint">
                        Legal
                    </p>
                    <h1 className="mt-4 font-display text-display-xl text-foreground leading-[1.1]">
                        Privacy Policy
                    </h1>
                    <p className="mt-4 text-body-md text-text-dim">
                        Last updated {LAST_UPDATED}.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 pb-20 lg:pb-28">
                <article className="prose-policy mx-auto max-w-3xl space-y-10 text-body-md text-foreground">
                    <Section title="1. Who we are">
                        <p>
                            GradConnect (the &quot;Service&quot;, &quot;we&quot;, &quot;our&quot;)
                            is a graduate career intelligence platform operated
                            from Lagos, Nigeria. This Privacy Policy describes
                            how we handle the personal information of people
                            who visit our website or register an account.
                        </p>
                        <p>
                            For privacy questions or to exercise your rights
                            under this policy, contact{" "}
                            <a
                                href="mailto:privacy@gradconnect.ng"
                                className="text-primary hover:underline"
                            >
                                privacy@gradconnect.ng
                            </a>
                            .
                        </p>
                    </Section>

                    <Section title="2. Legal framework">
                        <p>
                            This policy reflects our obligations under the
                            Nigeria Data Protection Act 2023 (NDPA) and the
                            Nigeria Data Protection Regulation 2019 (NDPR), as
                            enforced by the Nigeria Data Protection Commission
                            (NDPC). Where you access the Service from outside
                            Nigeria, we apply the same standards regardless of
                            your location.
                        </p>
                    </Section>

                    <Section title="3. Information we collect">
                        <p>We collect personal information in three ways:</p>

                        <h3 className="mt-6 font-display text-heading-sm text-foreground">
                            Information you give us
                        </h3>
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            <li>
                                <strong>Account information:</strong> email
                                address, name, and (for password-based accounts)
                                a hashed password. We never store passwords in
                                plain text.
                            </li>
                            <li>
                                <strong>Profile information (optional):</strong>{" "}
                                degree discipline, graduation year, target
                                industries, and preferred work locations. You
                                can fill these in to personalise recommendations
                                and skip them entirely if you prefer.
                            </li>
                            <li>
                                <strong>Bookmarks and application tracking:</strong>{" "}
                                opportunities you save and the status you
                                assign to applications you&apos;re tracking. Visible
                                only to you.
                            </li>
                            <li>
                                <strong>Reviews:</strong> if you submit a
                                community review of an employer&apos;s recruitment
                                process, we store the content of that review.
                                Reviews are published anonymously — your name
                                and email are never attached to public reviews.
                            </li>
                        </ul>

                        <h3 className="mt-6 font-display text-heading-sm text-foreground">
                            Information we receive automatically
                        </h3>
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            <li>
                                <strong>Session data:</strong> when you log in,
                                we issue a session token stored as an
                                <code className="mx-1 rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-caption">
                                    httpOnly
                                </code>
                                cookie. We log the IP address and user-agent
                                associated with each session for security
                                auditing. Sessions expire after seven days of
                                inactivity.
                            </li>
                            <li>
                                <strong>Server logs:</strong> our servers
                                automatically record the URLs you visit,
                                response codes, and timestamps. These logs help
                                us debug issues and detect abuse.
                            </li>
                        </ul>

                        <h3 className="mt-6 font-display text-heading-sm text-foreground">
                            Information from third parties
                        </h3>
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            <li>
                                <strong>Google sign-in:</strong> if you sign up
                                or log in using your Google account, we receive
                                your email address and name from Google. We do
                                not receive your Google password and we do not
                                access any other information from your Google
                                account.
                            </li>
                        </ul>
                    </Section>

                    <Section title="4. How we use your information">
                        <p>We use the information we collect to:</p>
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            <li>create and maintain your account;</li>
                            <li>
                                authenticate you and keep you logged in across
                                visits;
                            </li>
                            <li>
                                send you transactional emails (email verification,
                                password reset, deadline reminders for
                                opportunities you&apos;ve bookmarked, and a one-time
                                welcome email);
                            </li>
                            <li>
                                personalise opportunity recommendations based
                                on the profile information you&apos;ve provided;
                            </li>
                            <li>
                                publish your reviews anonymously after
                                moderation, to help other graduates prepare;
                            </li>
                            <li>
                                detect, investigate, and prevent fraud, abuse,
                                or violations of our terms;
                            </li>
                            <li>
                                comply with legal obligations and respond to
                                lawful requests from authorities.
                            </li>
                        </ul>
                        <p className="mt-4">
                            We do not sell your personal information. We do not
                            use your data to train artificial intelligence
                            models. We do not show advertising on the platform.
                        </p>
                    </Section>

                    <Section title="5. Who we share your information with">
                        <p>
                            We share personal information only with service
                            providers we use to operate the platform, and only
                            to the extent necessary for them to provide their
                            service to us. Each provider is contractually bound
                            to protect your data and use it only for the
                            purposes we specify.
                        </p>
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            <li>
                                <strong>Email delivery:</strong> Resend (or
                                Postmark) — sends transactional emails on our
                                behalf. Receives recipient email address and
                                message content.
                            </li>
                            <li>
                                <strong>Authentication:</strong> Google — when
                                you choose to sign in with Google. Receives
                                only the standard OAuth login request.
                            </li>
                            <li>
                                <strong>Hosting:</strong> Railway (or Fly.io)
                                for the API and database, Vercel for the
                                website. These providers process data on our
                                instructions and do not access your information
                                for their own purposes.
                            </li>
                            <li>
                                <strong>File storage:</strong> Cloudflare R2 —
                                stores employer logos and uploaded files. Does
                                not contain personal user data.
                            </li>
                            <li>
                                <strong>Error monitoring:</strong> Sentry —
                                captures application errors so we can fix them.
                                We configure Sentry to scrub personal data from
                                error reports.
                            </li>
                        </ul>
                        <p className="mt-4">
                            We do not share your information with employers
                            advertising on the platform. Employers receive
                            applications directly through their own systems
                            when you click through from an opportunity listing.
                        </p>
                    </Section>

                    <Section title="6. International data transfers">
                        <p>
                            Some of our service providers process data outside
                            Nigeria, including in the European Union and the
                            United States. Where this happens, we rely on the
                            adequacy mechanisms of those jurisdictions or
                            contractual safeguards equivalent to those required
                            by the NDPA, ensuring your data receives protection
                            equivalent to Nigerian standards.
                        </p>
                    </Section>

                    <Section title="7. How long we keep your information">
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            <li>
                                <strong>Account data:</strong> retained for as
                                long as your account is active. Deleted within
                                30 days of account closure.
                            </li>
                            <li>
                                <strong>Sessions:</strong> deleted automatically
                                seven days after creation, or sooner when you
                                log out.
                            </li>
                            <li>
                                <strong>
                                    Password reset and email verification tokens:
                                </strong>{" "}
                                deleted as soon as they&apos;re used, or after they
                                expire (one hour and 24 hours respectively).
                            </li>
                            <li>
                                <strong>Reviews:</strong> approved reviews
                                remain published indefinitely as a public
                                resource for future graduates. The reviewer&apos;s
                                identity is not stored alongside the review and
                                is removed entirely if you delete your account.
                            </li>
                            <li>
                                <strong>Server logs:</strong> retained for 30
                                days, then deleted.
                            </li>
                            <li>
                                <strong>Backups:</strong> we keep encrypted
                                backups for up to 90 days for disaster recovery.
                                Deleted data persists in backups until they
                                rotate out.
                            </li>
                        </ul>
                    </Section>

                    <Section title="8. Your rights">
                        <p>Under the NDPA and NDPR, you have the right to:</p>
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            <li>
                                <strong>Access</strong> the personal information
                                we hold about you;
                            </li>
                            <li>
                                <strong>Rectify</strong> inaccurate or
                                incomplete information;
                            </li>
                            <li>
                                <strong>Delete</strong> your account and the
                                personal data associated with it;
                            </li>
                            <li>
                                <strong>Object</strong> to or restrict certain
                                uses of your information;
                            </li>
                            <li>
                                <strong>Withdraw consent</strong> at any time,
                                where we rely on your consent to process data;
                            </li>
                            <li>
                                <strong>Receive a copy</strong> of your data in
                                a portable, machine-readable format;
                            </li>
                            <li>
                                <strong>Lodge a complaint</strong> with the
                                Nigeria Data Protection Commission (NDPC) if
                                you believe we have not complied with our
                                obligations.
                            </li>
                        </ul>
                        <p className="mt-4">
                            Most of these rights you can exercise yourself
                            through your account settings (updating your
                            profile, deleting your account). For requests we
                            can&apos;t fulfil through the interface — including
                            access requests and complaints — contact{" "}
                            <a
                                href="mailto:privacy@gradconnect.ng"
                                className="text-primary hover:underline"
                            >
                                privacy@gradconnect.ng
                            </a>
                            . We will respond within 30 days.
                        </p>
                    </Section>

                    <Section title="9. How we protect your information">
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                            <li>
                                All traffic to GradConnect is encrypted in
                                transit using HTTPS.
                            </li>
                            <li>
                                Passwords are hashed using bcrypt with a per-user
                                salt. We cannot recover your password — only
                                reset it.
                            </li>
                            <li>
                                Database backups are encrypted at rest.
                            </li>
                            <li>
                                Access to the production database is restricted
                                to a small number of authorised personnel and is
                                logged.
                            </li>
                            <li>
                                We rate-limit authentication endpoints to defend
                                against credential-stuffing and brute-force
                                attacks.
                            </li>
                        </ul>
                        <p className="mt-4">
                            No system is perfectly secure. If we ever discover
                            a breach affecting your personal information, we
                            will notify you and the NDPC within the timeframes
                            required by law.
                        </p>
                    </Section>

                    <Section title="10. Cookies">
                        <p>
                            GradConnect uses one cookie:{" "}
                            <code className="mx-1 rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-caption">
                                session_id
                            </code>
                            . This cookie is strictly necessary for the platform
                            to work — it tells our servers that you&apos;re logged in.
                            It is set as
                            <code className="mx-1 rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-caption">
                                httpOnly
                            </code>
                            (so it can&apos;t be accessed by JavaScript),
                            <code className="mx-1 rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-caption">
                                Secure
                            </code>
                            (so it&apos;s only sent over HTTPS), and
                            <code className="mx-1 rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-caption">
                                SameSite=Strict
                            </code>
                            (to prevent cross-site request forgery).
                        </p>
                        <p className="mt-4">
                            We do not use advertising cookies, tracking pixels,
                            or third-party analytics that identify individual
                            users. If we add privacy-respecting analytics in
                            future, we will update this policy and notify
                            registered users by email.
                        </p>
                    </Section>

                    <Section title="11. Children">
                        <p>
                            GradConnect is intended for users aged 16 and above.
                            We do not knowingly collect information from
                            children under 16. If you believe a child has
                            registered an account, contact us and we will
                            remove the account and associated data.
                        </p>
                    </Section>

                    <Section title="12. Changes to this policy">
                        <p>
                            We may update this Privacy Policy from time to time
                            to reflect changes in the Service, our practices,
                            or applicable law. When we make material changes,
                            we will update the &quot;Last updated&quot; date at
                            the top of this page and, for registered users,
                            notify you by email. Continued use of the Service
                            after the changes take effect constitutes
                            acceptance of the updated policy.
                        </p>
                    </Section>

                    <Section title="13. Contact">
                        <p>
                            For any privacy-related question, request, or
                            complaint, contact us at{" "}
                            <a
                                href="mailto:privacy@gradconnect.ng"
                                className="text-primary hover:underline"
                            >
                                privacy@gradconnect.ng
                            </a>
                            .
                        </p>
                        <p className="mt-4">
                            You can also lodge a complaint directly with the
                            Nigeria Data Protection Commission via their
                            website at{" "}
                            <a
                                href="https://ndpc.gov.ng"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                ndpc.gov.ng
                            </a>
                            .
                        </p>
                    </Section >
                </article >
            </section >
        </main >
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <h2
                id={titleToId(title)}
                className="font-display text-heading-lg text-foreground scroll-mt-20"
            >
                {title}
            </h2>
            <div className="mt-4 space-y-4 text-text-dim leading-relaxed">
                {children}
            </div>
        </section>
    );
}

function titleToId(title: string): string {
    return title
        .toLowerCase()
        .replace(/^\d+\.\s+/, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}
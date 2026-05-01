import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE, absoluteUrl } from "@/lib/seo/config";

export const metadata: Metadata = {
    title: "About",
    description:
        "GradConnect exists so every Nigerian graduate has equal access to the information, preparation, and opportunities they need to launch their career.",
    alternates: { canonical: absoluteUrl("/about") },
    openGraph: {
        type: "website",
        url: absoluteUrl("/about"),
        title: "About — GradConnect",
        description:
            "Why GradConnect exists, who it's for, and what we do to level the playing field for Nigerian graduates.",
        siteName: SITE.name,
        locale: SITE.locale,
        images: [
            {
                url: absoluteUrl("/og/default.png"),
                width: 1200,
                height: 630,
                alt: "GradConnect",
            },
        ],
    },
};

export default function AboutPage() {
    return (
        <main>
            {/* HERO */}
            <section className="container mx-auto px-4 py-20 lg:py-28">
                <div className="max-w-3xl">
                    <p className="text-caption uppercase tracking-wider text-text-faint">
                        About GradConnect
                    </p>
                    <h1 className="mt-4 font-display text-display-2xl text-foreground leading-[1.05]">
                        Every Nigerian graduate deserves equal access to the information to launch their career.
                    </h1>
                    <p className="mt-6 text-body-lg text-text-dim max-w-2xl">
                        GradConnect is Nigeria&apos;s graduate career intelligence
                        platform — not just another job board, but a place to
                        understand who&apos;s hiring, what to expect from their
                        recruitment process, and how to prepare.
                    </p>
                </div>
            </section>

            {/* THE PROBLEM */}
            <section className="border-t border-border">
                <div className="container mx-auto px-4 py-20 lg:py-24">
                    <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
                        <div>
                            <p className="text-caption uppercase tracking-wider text-text-faint">
                                The problem
                            </p>
                            <h2 className="mt-3 font-display text-heading-xl text-foreground">
                                Career intelligence shouldn&apos;t depend on who you know.
                            </h2>
                        </div>
                        <div className="space-y-5 text-body-lg text-text-dim max-w-2xl">
                            <p>
                                Critical knowledge about Nigerian graduate
                                recruitment lives in informal channels. WhatsApp
                                groups. Twitter threads. The friend of a friend
                                who interviewed at the same company last year.
                            </p>
                            <p>
                                If you have those networks, you walk into an
                                assessment centre knowing what to expect. If you
                                don&apos;t, you walk in blind. That&apos;s not a problem
                                of effort or talent — it&apos;s a problem of access.
                                And it disproportionately affects graduates from
                                outside Lagos, from less-connected universities,
                                from families without professional networks.
                            </p>
                            <p>
                                Existing Nigerian job platforms function as
                                listing aggregators. They don&apos;t tell you what
                                the SHL test feels like at this employer, what
                                questions come up in the panel, or how long the
                                process takes from application to offer. That
                                information exists — it&apos;s just not anywhere
                                public.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT WE DO */}
            <section className="border-t border-border bg-surface-subtle">
                <div className="container mx-auto px-4 py-20 lg:py-24">
                    <div className="max-w-3xl">
                        <p className="text-caption uppercase tracking-wider text-text-faint">
                            What we do
                        </p>
                        <h2 className="mt-3 font-display text-heading-xl text-foreground">
                            We turn informal knowledge into a public resource.
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
                        <div>
                            <h3 className="font-display text-heading-md text-foreground">
                                Verified employer profiles
                            </h3>
                            <p className="mt-3 text-body-md text-text-dim">
                                Rich profiles for Nigerian graduate employers —
                                programme structure, application process, office
                                locations, culture. Goes beyond a logo and a
                                paragraph.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-display text-heading-md text-foreground">
                                Assessment intelligence
                            </h3>
                            <p className="mt-3 text-body-md text-text-dim">
                                For each employer, we document the recruitment
                                stages, aptitude test type, interview format, and
                                typical timeline. So you walk in prepared.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-display text-heading-md text-foreground">
                                Community reviews
                            </h3>
                            <p className="mt-3 text-body-md text-text-dim">
                                First-hand accounts from candidates who&apos;ve been
                                through the process. Anonymous, structured,
                                moderated — the kind of advice that used to
                                require knowing the right person.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHO WE SERVE */}
            <section className="border-t border-border">
                <div className="container mx-auto px-4 py-20 lg:py-24">
                    <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
                        <div>
                            <p className="text-caption uppercase tracking-wider text-text-faint">
                                Who we serve
                            </p>
                            <h2 className="mt-3 font-display text-heading-xl text-foreground">
                                Built for graduates, not for HR teams.
                            </h2>
                        </div>
                        <div className="space-y-5 text-body-lg text-text-dim max-w-2xl">
                            <p>
                                GradConnect is for final-year students,
                                NYSC corps members, fresh graduates, and
                                early-career professionals looking for
                                structured graduate programmes — whether
                                that&apos;s a banking trainee scheme, a Big 4
                                associate path, or an industrial attachment.
                            </p>
                            <p>
                                Everything on the platform is free for graduates
                                and always will be. We&apos;re funded by employer
                                partnerships — companies that want to reach
                                better-prepared candidates and respond to the
                                feedback shared on their hub.
                            </p>
                            <p>
                                If you&apos;re a university career services officer,
                                a graduate recruiter, or a returning candidate
                                wanting to share your experience —{" "}
                                <Link
                                    href="/contact"
                                    className="text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
                                >
                                    we&apos;d love to hear from you
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border bg-surface-subtle">
                <div className="container mx-auto px-4 py-20 lg:py-24">
                    <div className="max-w-3xl">
                        <h2 className="font-display text-heading-xl text-foreground">
                            Start where you are.
                        </h2>
                        <p className="mt-4 text-body-lg text-text-dim max-w-2xl">
                            Browse employers actively recruiting Nigerian
                            graduates, or jump straight into open opportunities.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/employers"
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-body-md text-primary-foreground hover:bg-primary-hover transition-colors"
                            >
                                Browse employers
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href="/opportunities"
                                className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-transparent px-6 py-3 text-body-md text-foreground hover:bg-surface-subtle transition-colors"
                            >
                                Browse opportunities
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
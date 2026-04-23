import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getHomepageData } from "@/lib/data/homepage";
import { HomeSection } from "@/components/homepage/section";
import { FeaturedEmployers } from "@/components/homepage/featured-employers";
import { ClosingSoon } from "@/components/homepage/closing-soon";
import { FeaturedReview } from "@/components/homepage/featured-review";
import { ValueProp } from "@/components/homepage/value-prop";
import { ReturnBanner } from "@/components/homepage/return-banner";
import { FinalCTA } from "@/components/homepage/final-cta";
import { NotebookGlass } from "@/components/homepage/illustrations/notebook-glass";

export default async function Home() {
  const [user, data] = await Promise.all([getSession(), getHomepageData()]);

  return (
    <main>
      {user && <ReturnBanner user={user} />}

      {/* HERO */}
      {/* HERO */}
      <section className="container mx-auto px-4 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16 items-center">
          <div className="max-w-3xl">
            <p className="text-caption uppercase tracking-wider text-text-faint">
              Nigeria&apos;s graduate career intelligence platform
            </p>
            <h1 className="mt-4 font-display text-display-2xl text-foreground leading-[1.05]">
              Every Nigerian graduate deserves equal access to the information to launch their career.
            </h1>
            <p className="mt-6 text-body-lg text-text-dim max-w-2xl">
              Discover verified employers, understand their assessment processes,
              and prepare to apply — all in one place.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
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

          <div
            className="hidden text-primary lg:flex items-center justify-center"
            aria-hidden
          >
            <NotebookGlass className="w-full max-w-[300px]" />
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      {data.featuredEmployers.length > 0 && (
        <HomeSection
          eyebrow="Employers"
          title="Who's hiring Nigerian graduates."
          description="Verified graduate employers actively recruiting across the country."
          ctaHref="/employers"
          ctaLabel="See all employers"
        >
          <FeaturedEmployers employers={data.featuredEmployers} />
        </HomeSection>
      )}

      {/* CLOSING SOON */}
      <HomeSection
        eyebrow="Deadlines"
        title="Closing soon."
        description="Live graduate programmes with the nearest application deadlines."
        ctaHref="/opportunities"
        ctaLabel="See all opportunities"
      >
        <ClosingSoon opportunities={data.closingSoon} />
      </HomeSection>

      {/* REVIEW PULL-QUOTE */}
      {data.featuredReview && data.featuredReviewEmployer && (
        <HomeSection
          eyebrow="From a recent candidate"
          title="What it's really like."
        >
          <FeaturedReview
            review={data.featuredReview}
            employer={data.featuredReviewEmployer}
          />
        </HomeSection>
      )}

      {/* VALUE PROP */}
      <HomeSection
        eyebrow="How it works"
        title="Three things you can do here."
      >
        <ValueProp />
      </HomeSection>

      {/* FINAL CTA */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20 lg:py-28">
          <FinalCTA user={user} />
        </div>
      </section>
    </main>
  );
}
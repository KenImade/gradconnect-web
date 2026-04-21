import Link from "next/link";
import { ArrowRight, Clock, Compass, PenLine, Sparkles } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import {
  getUrgentOpportunities,
  getRecommendedOpportunities,
} from "@/lib/api/endpoints/opportunities.helpers";
import { isProfileComplete, missingProfileFields } from "@/lib/utils/user";
import { VerificationBanner } from "@/components/auth/verification-banner";
import { OpportunityCard } from "@/components/opportunity/opportunity-card";

export default async function DashboardPage() {
  const user = await requireSession();

  // Parallel fetch both sections so the page streams once, not twice.
  const [urgent, recommended] = await Promise.all([
    getUrgentOpportunities(4),
    getRecommendedOpportunities(user.target_industries, 6),
  ]);

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const firstName = user.name.split(" ")[0] || user.email.split("@")[0];
  const profileComplete = isProfileComplete(user);
  const profileMissing = missingProfileFields(user);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 lg:py-14">
      {/* Dateline + greeting — editorial masthead */}
      <header>
        <p className="text-caption uppercase tracking-wider text-text-faint italic">
          {today}
        </p>
        <h1 className="mt-2 font-display text-display-lg text-foreground">
          Good to see you, {firstName}
        </h1>
        {user.email_verified && (
          <p className="mt-3 text-body-md text-text-dim max-w-prose">
            Your edition of GradConnect — opportunities closing soon,
            picks matched to your interests, and next steps when you&apos;re ready.
          </p>
        )}
      </header>

      {/* Verification banner — only for unverified */}
      {!user.email_verified && (
        <div className="mt-8">
          <VerificationBanner email={user.email} />
        </div>
      )}

      {/* SECTION 1 — Urgent deadlines */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-caption uppercase tracking-wider text-text-faint">
              Closing soon
            </p>
            <h2 className="mt-1 font-display text-heading-xl text-foreground">
              This week&apos;s deadlines
            </h2>
          </div>
          <Link
            href="/opportunities?sort=deadline&order=asc"
            className="inline-flex items-center gap-1 text-caption text-primary hover:text-primary-hover transition-colors"
          >
            See all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {urgent.length === 0 ? (
          <div className="mt-6 border-l-2 border-border pl-6 py-3">
            <p className="text-body-sm text-text-dim">
              No opportunities are currently listed. Check back soon — new programmes open regularly.
            </p>
          </div>
        ) : (
          <div className="mt-6 border-t border-border">
            {urgent.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2 — Recommended for you */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-caption uppercase tracking-wider text-text-faint">
              For you
            </p>
            <h2 className="mt-1 font-display text-heading-xl text-foreground">
              Matched to your interests
            </h2>
            {user.target_industries.length > 0 && (
              <p className="mt-2 text-caption text-text-dim italic">
                {user.target_industries.join(" · ")}
              </p>
            )}
          </div>
        </div>

        {user.target_industries.length === 0 ? (
          <div className="mt-6 border-l-2 border-primary pl-6 py-3">
            <p className="text-body-sm text-foreground">
              <Sparkles className="inline size-4 -mt-0.5 mr-1.5 text-primary" />
              Tell us which industries you&apos;re targeting and we&apos;ll surface the right opportunities here.
            </p>
            <Link
              href="/settings"
              className="mt-3 inline-flex items-center gap-1.5 text-caption text-primary hover:text-primary-hover underline underline-offset-4"
            >
              Complete your profile
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ) : recommended.length === 0 ? (
          <div className="mt-6 border-l-2 border-border pl-6 py-3">
            <p className="text-body-sm text-text-dim">
              No open programmes in your target industries right now.
              Check back soon, or{" "}
              <Link
                href="/opportunities"
                className="text-primary hover:text-primary-hover underline underline-offset-4"
              >
                browse all opportunities
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-6 border-t border-border">
            {recommended.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3 — Next steps */}
      <section className="mt-14 mb-6">
        <p className="text-caption uppercase tracking-wider text-text-faint">
          Next steps
        </p>
        <h2 className="mt-1 font-display text-heading-xl text-foreground">
          Make GradConnect work for you
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Card 1 — profile completion (if applicable) */}
          {!profileComplete ? (
            <NextStepCard
              icon={Sparkles}
              title="Complete your profile"
              body={`Add your ${profileMissing.slice(0, 2).join(" and ")} so we can tailor recommendations and deadline reminders.`}
              href="/settings"
              cta="Update profile"
            />
          ) : (
            <NextStepCard
              icon={Compass}
              title="Discover employers"
              body="Browse 50+ employer profiles with assessment guides, reviews, and prep resources."
              href="/employers"
              cta="Browse employers"
            />
          )}

          {/* Card 2 — always shown: invite to contribute */}
          <NextStepCard
            icon={PenLine}
            title="Share your experience"
            body="Been through a graduate programme's process? Write a review and help the next cohort prepare."
            href="/reviews/new"
            cta="Write a review"
            disabled={!user.email_verified}
            disabledReason="Verify your email to submit reviews"
          />
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Local helper component — kept in the same file because it's not reused.
// ---------------------------------------------------------------------------

type NextStepCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
  cta: string;
  disabled?: boolean;
  disabledReason?: string;
};

function NextStepCard({
  icon: Icon,
  title,
  body,
  href,
  cta,
  disabled = false,
  disabledReason,
}: NextStepCardProps) {
  const content = (
    <div className="flex items-start gap-3">
      <Icon
        className={[
          "size-5 shrink-0 mt-0.5",
          disabled
            ? "text-text-faint"
            : "text-text-dim group-hover:text-primary transition-colors",
        ].join(" ")}
      />
      <div className="flex-1">
        <p className="font-display text-heading-md text-foreground">
          {title}
        </p>
        <p className="mt-1 text-body-sm text-text-dim">{body}</p>
        <p
          className={[
            "mt-3 inline-flex items-center gap-1 text-caption",
            disabled
              ? "text-text-faint italic"
              : "text-primary group-hover:text-primary-hover transition-colors",
          ].join(" ")}
        >
          {disabled ? <Clock className="size-3" /> : <ArrowRight className="size-3" />}
          {disabled ? disabledReason : cta}
        </p>
      </div>
    </div>
  );

  if (disabled) {
    return (
      <div
        className="group block border-l-2 border-border py-3 pl-6 cursor-not-allowed"
        aria-disabled="true"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group block border-l-2 border-border py-3 pl-6 transition-colors hover:border-primary"
    >
      {content}
    </Link>
  );
}
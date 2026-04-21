import { requireSession } from "@/lib/auth/session";
import { VerificationBanner } from "@/components/auth/verification-banner";

export default async function DashboardPage() {
  const user = await requireSession();

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <p className="text-caption uppercase tracking-wider text-text-faint">Dashboard</p>
      <h1 className="mt-2 font-display text-display-lg text-foreground">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-4 text-body-md text-text-dim max-w-prose">
        Your personalised home — soon to include upcoming deadlines, tracked applications,
        and recommended opportunities. For now, browse{" "}
        <a
          href="/opportunities"
          className="text-primary hover:text-primary-hover underline underline-offset-4"
        >
          open opportunities
        </a>
        .
      </p>

      {!user.email_verified && (
        <div className="mt-10">
          <VerificationBanner email={user.email} />
        </div>
      )}
    </div>
  );
}
import { requireSession } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await requireSession();

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <p className="text-caption uppercase tracking-wider text-text-faint">
        Dashboard
      </p>
      <h1 className="mt-2 font-display text-display-lg text-foreground">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-4 text-body-md text-text-dim max-w-prose">
        Your personalised home — soon to include upcoming deadlines, tracked
        applications, and recommended opportunities. For now, browse{" "}
        <a
          href="/opportunities"
          className="text-primary hover:text-primary-hover underline underline-offset-4"
        >
          open opportunities
        </a>
        .
      </p>

      {
        !user.email_verified && (
          <div className="mt-8 border-l-2 border-warning pl-6 py-2">
            <p className="text-body-sm text-foreground">
              Verify your email to unlock bookmarks, review submission, and
              deadline reminders.
            </p>
            <button
              type="button"
              className="mt-2 text-caption text-primary hover:text-primary-hover underline underline-offset-4"
            >
              Resend verification email
            </button>
          </div>
        )
      }
    </div >
  );
}
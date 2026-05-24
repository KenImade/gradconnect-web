import { CheckCircle2, AlertCircle, Mail } from "lucide-react";
import type { User } from "@/lib/api/endpoints/users.types";

export function AccountInfo({ user }: { user: User }) {
    const memberSince = new Date(user.created_at).toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
    });

    const authProviderLabel =
        user.auth_provider === "google" ? "Google" : "Email and password";

    return (
      <section>
        <h2 className="font-display text-heading-lg text-foreground">Account</h2>
        <p className="text-body-sm text-text-dim mt-1">
          Account details, read-only. To change your email, contact{" "}
        <a
          href="mailto:support@gradconnect.ng"
          className="text-primary underline underline-offset-4 hover:text-primary-hover transition-colors"
        >
          support
        </a>.
      </p>

        <dl className="border-border mt-6 space-y-5 border-l-2 pl-6">
          <div>
            <dt className="text-caption text-text-faint tracking-wide uppercase">Email</dt>
            <dd className="text-body-md text-foreground mt-0.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="text-text-faint size-4" />
                {user.email}
              </span>
              {user.email_verified ? (
                <span className="text-caption text-success inline-flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  Verified
                </span>
              ) : (
                <span className="text-caption text-warning inline-flex items-center gap-1">
                  <AlertCircle className="size-3.5" />
                  Unverified
                </span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-caption text-text-faint tracking-wide uppercase">Sign-in method</dt>
            <dd className="text-body-md text-foreground mt-0.5">{authProviderLabel}</dd>
          </div>

          <div>
            <dt className="text-caption text-text-faint tracking-wide uppercase">Member since</dt>
            <dd className="text-body-md text-foreground mt-0.5 italic">{memberSince}</dd>
          </div>
        </dl>
      </section>
    );
}
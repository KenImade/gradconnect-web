import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How GradConnect collects, uses, stores, and protects your personal information.",
  alternates: { canonical: absoluteUrl("/privacy") },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <p className="text-caption text-text-faint tracking-wider uppercase">Legal</p>
      <h1 className="font-display text-display-lg text-foreground mt-2">Privacy Policy</h1>
      <p className="text-body-sm text-text-dim mt-3">Last updated: 23 May 2026</p>

      <div className="text-body-md text-foreground mt-10 space-y-8 leading-relaxed">
        <Section title="1. About this policy">
          <p>
            This policy explains what personal information GradConnect collects, why we collect it,
            how we use it, and the rights you have over it. It applies to anyone who uses
            gradconnect.ng or interacts with us by email.
          </p>
          <p>
            GradConnect is operated by Kenneth Imade as a sole proprietor based in Lagos, Nigeria.
            For the purposes of the Nigeria Data Protection Act 2023 (&ldquo;NDPA&rdquo;), Kenneth
            Imade is the data controller. You can reach us at{" "}
            <a
              href="mailto:support@gradconnect.ng"
              className="text-primary hover:text-primary-hover underline underline-offset-4 transition-colors"
            >
              support@gradconnect.ng
            </a>
            .
          </p>
        </Section>

        <Section title="2. What we collect">
          <h3 className="font-display text-display-sm text-foreground mt-6">
            Information you give us
          </h3>
          <ul className="marker:text-text-faint list-disc space-y-2 pl-6">
            <li>
              <strong>Account details:</strong> your first name, last name, email address, and
              password (which we never store in readable form &mdash; only a one-way hash).
            </li>
            <li>
              <strong>Profile information:</strong> any optional details you add such as degree
              discipline, graduation year, target industries, and preferred work locations.
            </li>
            <li>
              <strong>Reviews and content:</strong> the text, ratings, and metadata of any reviews
              or other content you submit.
            </li>
            <li>
              <strong>Bookmarks and applications:</strong> the opportunities you save and the
              application status information you track.
            </li>
            <li>
              <strong>Communications:</strong> the contents of any emails you send to us.
            </li>
          </ul>

          <h3 className="font-display text-display-sm text-foreground mt-6">
            Information from Google sign-in
          </h3>
          <p>
            If you sign in with Google, Google provides us with your email address and name. We
            don&rsquo;t request or store anything else from your Google account &mdash; no calendar,
            contacts, profile picture, or any other Google data.
          </p>

          <h3 className="font-display text-display-sm text-foreground mt-6">
            Information collected automatically
          </h3>
          <ul className="marker:text-text-faint list-disc space-y-2 pl-6">
            <li>
              <strong>Session cookie:</strong> when you log in, we set a secure cookie containing a
              random session identifier so we know it&rsquo;s still you between page loads. This is
              strictly necessary for the service to work; it doesn&rsquo;t track you across other
              sites.
            </li>
            <li>
              <strong>Server logs:</strong> our servers record basic request information (IP
              address, the page or API endpoint requested, time, user agent, response status) for
              security monitoring and to debug problems. These logs are retained for up to 30 days.
            </li>
            <li>
              <strong>Error reports:</strong> when something goes wrong, our error tracking tool
              (Sentry) records information about the error, which can include the page you were on,
              the request that failed, and your user ID. This helps us fix bugs. We don&rsquo;t use
              Sentry to track behaviour.
            </li>
          </ul>
          <p>
            We don&rsquo;t use Google Analytics, Facebook Pixel, or any other behavioural-analytics
            tool. We don&rsquo;t fingerprint your device or track you across other websites.
          </p>
        </Section>

        <Section title="3. Why we use your information">
          <p>
            Under the NDPA, every use of personal data must have a lawful basis. Here&rsquo;s what
            we do and why we&rsquo;re entitled to:
          </p>
          <ul className="marker:text-text-faint list-disc space-y-2 pl-6">
            <li>
              <strong>Run your account</strong> &mdash; signing you in, displaying your bookmarks,
              processing your reviews. <em>Basis: contract.</em> You can&rsquo;t use the service
              without this.
            </li>
            <li>
              <strong>Send transactional emails</strong> &mdash; email verification, password
              resets, deadline reminders for opportunities you&rsquo;ve bookmarked, password change
              confirmations. <em>Basis: contract or legitimate interest.</em>
            </li>
            <li>
              <strong>Show personalised content</strong> &mdash; recommending opportunities based on
              your stated preferences. <em>Basis: legitimate interest.</em>
            </li>
            <li>
              <strong>Keep the service secure</strong> &mdash; detecting suspicious logins,
              preventing abuse, debugging issues. <em>Basis: legitimate interest.</em>
            </li>
            <li>
              <strong>Comply with the law</strong> &mdash; responding to legal requests, defending
              against claims. <em>Basis: legal obligation.</em>
            </li>
          </ul>
          <p>
            We don&rsquo;t sell your data. We don&rsquo;t share it for advertising or marketing. We
            don&rsquo;t profile you for any purpose other than showing you relevant opportunities on
            the platform itself.
          </p>
        </Section>

        <Section title="4. Who we share your information with">
          <p>
            To run GradConnect, we rely on a small number of third-party service providers who
            process data on our behalf. These are all reputable services with their own privacy
            obligations.
          </p>
          <ul className="marker:text-text-faint list-disc space-y-2 pl-6">
            <li>
              <strong>Render</strong> &mdash; hosts the GradConnect web application and API.
            </li>
            <li>
              <strong>Neon</strong> &mdash; hosts the GradConnect database (where your account
              information and content are stored).
            </li>
            <li>
              <strong>Cloudflare</strong> &mdash; serves and protects our public website (DNS, file
              storage, and basic traffic management).
            </li>
            <li>
              <strong>Amazon Web Services (Amazon SES)</strong> &mdash; sends transactional emails
              on our behalf (verification, password reset, deadline reminders).
            </li>
            <li>
              <strong>Sentry</strong> &mdash; receives error reports when something on the site
              fails so we can investigate.
            </li>
            <li>
              <strong>Google</strong> &mdash; provides the &ldquo;Sign in with Google&rdquo; option.
              Google confirms your identity and shares your email and name with us.
            </li>
            <li>
              <strong>Zoho Mail</strong> &mdash; hosts our support inbox. If you email us, the
              contents are stored with Zoho.
            </li>
          </ul>
          <p>
            We&rsquo;ll share information with law enforcement or other authorities if we&rsquo;re
            legally required to, or if we&rsquo;re genuinely convinced doing so is necessary to
            prevent harm. We&rsquo;ll push back on overbroad requests.
          </p>
        </Section>

        <Section title="5. Where your data is stored">
          <p>
            Some of our service providers host data outside Nigeria, principally in the European
            Union and the United States. Specifically: Render and Neon run on cloud infrastructure
            with regions in the US and EU; AWS SES (depending on configuration) operates from
            Ireland; Sentry operates from the US; Google operates globally.
          </p>
          <p>
            Under the NDPA, transferring personal data outside Nigeria requires safeguards. The
            providers above all participate in recognised data-protection frameworks (such as the EU
            GDPR or equivalent contractual protections) and we&rsquo;ve chosen them in part for that
            reason.
          </p>
          <p>
            If you&rsquo;d rather your data not be processed internationally, the practical option
            is not to use the service.
          </p>
        </Section>

        <Section title="6. How long we keep your information">
          <ul className="marker:text-text-faint list-disc space-y-2 pl-6">
            <li>
              <strong>Account data</strong> &mdash; for as long as your account is active. If you
              delete your account, your account details are removed within 30 days.
            </li>
            <li>
              <strong>Reviews you&rsquo;ve submitted</strong> &mdash; may remain visible after
              account deletion in anonymised form, since other users may have relied on them. If you
              want a specific review removed, contact us.
            </li>
            <li>
              <strong>Server logs</strong> &mdash; up to 30 days.
            </li>
            <li>
              <strong>Error reports</strong> &mdash; up to 90 days in Sentry, then automatically
              purged.
            </li>
            <li>
              <strong>Email correspondence</strong> &mdash; kept while the matter is open, then
              archived for up to two years in case you reference an earlier exchange.
            </li>
            <li>
              <strong>Bounced/complained email addresses</strong> &mdash; kept on a suppression list
              to prevent further sends to that address. This is required to maintain sender
              reputation; we keep these even after account deletion.
            </li>
          </ul>
        </Section>

        <Section title="7. Your rights under the NDPA">
          <p>
            You have several rights over your personal data under Nigerian law. To exercise any of
            them, email us at{" "}
            <a
              href="mailto:support@gradconnect.ng"
              className="text-primary hover:text-primary-hover underline underline-offset-4 transition-colors"
            >
              support@gradconnect.ng
            </a>
            . We&rsquo;ll respond within 30 days.
          </p>
          <ul className="marker:text-text-faint list-disc space-y-2 pl-6">
            <li>
              <strong>Access:</strong> ask for a copy of the personal data we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> ask us to fix anything that&rsquo;s wrong or out of date.
              You can correct most things yourself in your account settings.
            </li>
            <li>
              <strong>Deletion:</strong> ask us to delete your account and personal data. Some
              information may be retained as set out in Section 6.
            </li>
            <li>
              <strong>Portability:</strong> ask for your data in a machine-readable format you can
              take elsewhere.
            </li>
            <li>
              <strong>Objection:</strong> object to processing based on legitimate interest (such as
              receiving deadline reminders). You can also disable specific email types in your
              account settings.
            </li>
            <li>
              <strong>Withdraw consent:</strong> where we&rsquo;re processing on the basis of your
              consent, you can withdraw it at any time. This doesn&rsquo;t affect processing that
              happened before you withdrew.
            </li>
          </ul>
          <p>
            If you think we&rsquo;ve handled your data badly and we&rsquo;re not resolving it to
            your satisfaction, you can complain to the{" "}
            <strong>Nigeria Data Protection Commission</strong> (NDPC) at{" "}
            <a
              href="https://ndpc.gov.ng"
              className="text-primary hover:text-primary-hover underline underline-offset-4 transition-colors"
            >
              ndpc.gov.ng
            </a>
            .
          </p>
        </Section>

        <Section title="8. Security">
          <p>We take reasonable steps to protect your data:</p>
          <ul className="marker:text-text-faint list-disc space-y-2 pl-6">
            <li>Passwords are stored as bcrypt hashes; we cannot read or recover your password.</li>
            <li>All traffic between you and our servers is encrypted over HTTPS.</li>
            <li>Database access is restricted to the application and requires authentication.</li>
            <li>
              Sessions are short-lived and tied to a single browser. Changing your password signs
              you out of all other devices.
            </li>
          </ul>
          <p>
            No system is perfectly secure. If you spot a security issue, please tell us at{" "}
            <a
              href="mailto:support@gradconnect.ng"
              className="text-primary hover:text-primary-hover underline underline-offset-4 transition-colors"
            >
              support@gradconnect.ng
            </a>{" "}
            rather than disclosing it publicly. We&rsquo;ll work with you to address it.
          </p>
        </Section>

        <Section title="9. Children">
          <p>
            GradConnect is intended for graduates and senior students, which means our typical user
            is 18 or older. We don&rsquo;t knowingly collect personal data from anyone under 13. If
            you&rsquo;re between 13 and 16, please make sure a parent or guardian is aware that
            you&rsquo;re using the service.
          </p>
          <p>
            If you believe a child under 13 has created an account, contact us and we&rsquo;ll
            remove it.
          </p>
        </Section>

        <Section title="10. Cookies">
          <p>
            We use one cookie: a session cookie that keeps you signed in between page loads. It
            contains a random identifier, is marked &ldquo;HttpOnly&rdquo; and &ldquo;Secure&rdquo;,
            and is removed when you sign out or when the session expires.
          </p>
          <p>
            We don&rsquo;t use cookies for analytics, advertising, or cross-site tracking. We
            don&rsquo;t embed third-party cookies from social networks or ad networks.
          </p>
        </Section>

        <Section title="11. Changes to this policy">
          <p>
            We may update this policy from time to time. When we do, we&rsquo;ll update the
            &ldquo;Last updated&rdquo; date at the top of the page. For changes that materially
            affect how we handle your data, we&rsquo;ll also notify registered users by email.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            For questions or requests about your data, email{" "}
            <a
              href="mailto:support@gradconnect.ng"
              className="text-primary hover:text-primary-hover underline underline-offset-4 transition-colors"
            >
              support@gradconnect.ng
            </a>
            . We aim to respond within five working days for routine questions, and within 30 days
            for formal data-protection requests as required by the NDPA.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-display-sm text-foreground">{title}</h2>
      {children}
    </section>
  );
}
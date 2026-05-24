import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of GradConnect.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <p className="text-caption uppercase tracking-wider text-text-faint">
        Legal
      </p>
      <h1 className="mt-2 font-display text-display-lg text-foreground">
        Terms of Service
      </h1>
      <p className="mt-3 text-body-sm text-text-dim">
        Last updated: 23 May 2026
      </p>

      <div className="mt-10 space-y-8 text-body-md text-foreground leading-relaxed">
        <Section title="1. Introduction">
          <p>
            Welcome to GradConnect. These Terms of Service (the
            &ldquo;Terms&rdquo;) form a legal agreement between you and
            GradConnect, operated by Kenneth Imade as a sole proprietor
            based in Lagos, Nigeria (&ldquo;GradConnect&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
          </p>
          <p>
            GradConnect is a platform that helps graduates and students
            discover graduate programmes and internships, read and write
            reviews of employer programmes, and track their job
            applications. By creating an account or using any part of the
            service, you agree to these Terms. If you don&rsquo;t agree,
            please don&rsquo;t use GradConnect.
          </p>
        </Section>

        <Section title="2. Who can use GradConnect">
          <p>
            You must be at least 16 years old to use GradConnect. If
            you&rsquo;re between 16 and 18, you confirm that a parent or
            guardian is aware you&rsquo;re using a platform that involves
            signing up with an email address and submitting reviews.
          </p>
          <p>
            GradConnect is built primarily for graduates and students in
            Nigeria, but is accessible globally. By using GradConnect from
            outside Nigeria, you accept that the service operates under
            Nigerian law (see Section 13).
          </p>
        </Section>

        <Section title="3. Your account">
          <p>
            You can create an account using an email address and password,
            or by signing in with Google. You&rsquo;re responsible for
            keeping your login credentials secure and for everything that
            happens under your account.
          </p>
          <p>
            Don&rsquo;t share your account with anyone else. Don&rsquo;t
            create multiple accounts to circumvent moderation, manipulate
            ratings, or impersonate someone else. We may suspend or close
            accounts that violate these terms, with or without notice.
          </p>
          <p>
            You can delete your account at any time from your account
            settings. When you delete your account, your personal
            information is removed in line with our Privacy Policy. Reviews
            you&rsquo;ve submitted may remain visible in an anonymised
            form, as they form part of the public record other users have
            relied on.
          </p>
        </Section>

        <Section title="4. Reviews and other user content">
          <p>
            GradConnect&rsquo;s value comes from honest, first-hand reviews
            of graduate programmes. When you submit a review, comment, or
            any other content (&ldquo;User Content&rdquo;), the following
            rules apply.
          </p>

          <h3 className="font-display text-display-sm text-foreground mt-6">
            Ownership and licence
          </h3>
          <p>
            You keep ownership of your User Content. By submitting it, you
            grant GradConnect a worldwide, royalty-free, non-exclusive
            licence to host, display, copy, distribute, and make derivative
            works of that content for the purpose of operating and
            promoting the service. This licence ends when you delete your
            content, except for content that&rsquo;s already been viewed
            or relied on by other users, which we may continue to display
            in an anonymised form.
          </p>

          <h3 className="font-display text-display-sm text-foreground mt-6">
            Your responsibility
          </h3>
          <p>
            You&rsquo;re solely responsible for what you post. By posting
            User Content, you confirm that:
          </p>
          <ul className="list-disc pl-6 space-y-2 marker:text-text-faint">
            <li>
              It&rsquo;s based on your own honest experience or direct
              knowledge.
            </li>
            <li>
              It doesn&rsquo;t contain false statements of fact
              presented as truth.
            </li>
            <li>
              It doesn&rsquo;t identify or expose information about
              specific individuals (interviewers, managers, fellow
              applicants) in a way that could harm them.
            </li>
            <li>
              It doesn&rsquo;t disclose confidential information
              you&rsquo;re bound to keep private under an NDA or
              employment agreement.
            </li>
            <li>
              It doesn&rsquo;t infringe anyone&rsquo;s intellectual
              property, privacy, or other rights.
            </li>
          </ul>
          <p>
            Opinions are protected; demonstrably false statements
            presented as fact are not. &ldquo;The interview was
            stressful&rdquo; is fine; &ldquo;the company committed
            fraud&rdquo; is not, unless you can substantiate it.
          </p>

          <h3 className="font-display text-display-sm text-foreground mt-6">
            Moderation
          </h3>
          <p>
            We may, but are not obligated to, review, edit, or remove User
            Content. We&rsquo;ll typically remove content that:
          </p>
          <ul className="list-disc pl-6 space-y-2 marker:text-text-faint">
            <li>
              Contains hate speech, harassment, or threats.
            </li>
            <li>
              Names and attacks specific individuals.
            </li>
            <li>
              Is clearly false or appears designed to manipulate ratings.
            </li>
            <li>
              Discloses information that&rsquo;s reasonably confidential.
            </li>
            <li>
              Violates Nigerian law or the rights of others.
            </li>
          </ul>
          <p>
            We may also remove or edit content in response to legitimate
            complaints from individuals or organisations affected by it.
            If your content is removed, we&rsquo;ll usually let you know,
            but we&rsquo;re not always able to.
          </p>
        </Section>

        <Section title="5. Employer information and opportunities">
          <p>
            GradConnect aggregates information about employers and graduate
            opportunities from a mix of sources: employer-submitted
            listings, public job postings, and our own research. We work
            to keep this information accurate but make no guarantees.
            Deadlines, eligibility criteria, and application processes can
            change without notice.
          </p>
          <p>
            Before applying to any opportunity, verify the details
            directly with the employer. GradConnect is not the official
            application channel and isn&rsquo;t responsible for
            applications submitted through links displayed on the
            platform.
          </p>
          <p>
            Mention of an employer on GradConnect doesn&rsquo;t imply
            endorsement by us or any relationship between us and that
            employer. Employer logos and names are used to identify the
            opportunity being reviewed or listed, under fair dealing
            principles.
          </p>
        </Section>

        <Section title="6. Acceptable use">
          <p>While using GradConnect, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-text-faint">
            <li>
              Scrape, crawl, or automate access to the service without
              our written permission.
            </li>
            <li>
              Use GradConnect to send unsolicited messages, spam, or
              commercial promotion to other users.
            </li>
            <li>
              Attempt to bypass security measures, access other
              users&rsquo; accounts, or interfere with the
              service&rsquo;s normal operation.
            </li>
            <li>
              Resell, sublicense, or commercially exploit the platform
              or its data.
            </li>
            <li>
              Use the service to violate any law or the rights of any
              person or organisation.
            </li>
          </ul>
        </Section>

        <Section title="7. Intellectual property">
          <p>
            GradConnect, including its name, design, code, copy,
            compilation of data, and all related materials, belongs to
            Kenneth Imade. You don&rsquo;t acquire any ownership interest
            in the platform by using it.
          </p>
          <p>
            You may view, share, and discuss GradConnect&rsquo;s public
            content in normal ways (sending a link to a friend, citing a
            review in conversation). You may not copy substantial portions
            of the platform, mirror its content, or use its compiled data
            for a competing service.
          </p>
        </Section>

        <Section title="8. Termination">
          <p>
            You can stop using GradConnect at any time by deleting your
            account in settings.
          </p>
          <p>
            We can suspend or terminate your access if you violate these
            Terms, abuse the service, or behave in a way that puts the
            platform or its users at risk. We&rsquo;ll generally give you
            a warning first, except in serious cases (such as harassment
            or clear fraud) where we may act immediately.
          </p>
          <p>
            On termination, the licences you granted us under Section 4
            continue for content that&rsquo;s already been viewed by
            others. The rest of these Terms continue to apply for any
            residual matters (such as disputes over content that existed
            before termination).
          </p>
        </Section>

        <Section title="9. Disclaimers">
          <p>
            GradConnect is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo;. We don&rsquo;t guarantee that the service
            will always be available, error-free, or secure, or that the
            information we display is current or accurate.
          </p>
          <p>
            We&rsquo;re not a recruitment agent. We don&rsquo;t place
            candidates, vet employers beyond basic checks, or guarantee
            the outcome of any application. We&rsquo;re a directory and a
            review platform; the decision to apply, accept an offer, or
            share information with an employer is yours.
          </p>
          <p>
            Reviews on GradConnect reflect the opinions of the
            individuals who wrote them, not GradConnect. We don&rsquo;t
            endorse, verify, or independently confirm the experiences
            described in reviews.
          </p>
        </Section>

        <Section title="10. Limitation of liability">
          <p>
            To the maximum extent permitted by law, GradConnect (and
            Kenneth Imade personally) won&rsquo;t be liable for any
            indirect, incidental, special, consequential, or punitive
            damages, or any loss of opportunity, employment, income, or
            data, arising from your use of the service.
          </p>
          <p>
            For any direct damages we&rsquo;re liable for, our total
            liability is limited to ten thousand naira
            (&#8358;10,000) or the amount you&rsquo;ve paid us in the
            twelve months before the claim, whichever is greater. Since
            GradConnect is currently free to use, the practical cap is
            ten thousand naira.
          </p>
        </Section>

        <Section title="11. Indemnification">
          <p>
            You agree to indemnify and hold harmless GradConnect and
            Kenneth Imade from any claims, damages, losses, and
            reasonable legal costs arising from User Content you submit
            or actions you take on the platform that violate these Terms
            or the rights of others.
          </p>
        </Section>

        <Section title="12. Changes to these Terms">
          <p>
            We may update these Terms from time to time. When we do,
            we&rsquo;ll update the &ldquo;Last updated&rdquo; date at the
            top of this page. For material changes, we&rsquo;ll also
            notify registered users by email.
          </p>
          <p>
            Continuing to use GradConnect after a change means you accept
            the updated Terms. If you don&rsquo;t agree with a change,
            please stop using the service and delete your account.
          </p>
        </Section>

        <Section title="13. Governing law and disputes">
          <p>
            These Terms are governed by the laws of the Federal Republic
            of Nigeria, without regard to conflict-of-law principles.
          </p>
          <p>
            Before taking formal action, you agree to first contact us at
            the address below and give us a reasonable chance to resolve
            the issue. If we can&rsquo;t resolve it, disputes will be
            handled by the courts of Lagos State, Nigeria.
          </p>
        </Section>

        <Section title="14. Contact">
          <p>
            Questions, complaints, or notices about these Terms can be
            sent to{" "}
            <a
              href="mailto:support@gradconnect.ng"
              className="text-primary underline underline-offset-4 hover:text-primary-hover transition-colors"
            >
              support@gradconnect.ng
            </a>
            . We try to respond within five working days.
          </p>
        </Section>
      </div>
    </div>
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
    <section className="space-y-4">
      <h2 className="font-display text-display-sm text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
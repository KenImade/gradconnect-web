export default function Home() {
  return (
    <main className="container mx-auto py-24 px-4">
      <p className="text-caption uppercase tracking-wider text-text-dim">
        Design system check
      </p>
      <h1 className="font-display text-display-xl text-foreground mt-2">
        GradConnect
      </h1>
      <p className="mt-4 text-body-lg text-text-dim max-w-prose">
        Nigeria&apos;s graduate career intelligence platform. Every graduate
        deserves equal access to the information they need to launch their
        career.
      </p>
      <div className="mt-8 flex gap-3">
        <button className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary-hover transition-colors">
          Browse Employers
        </button>
        <button className="rounded-md border border-border-strong bg-transparent px-6 py-3 text-foreground hover:bg-surface-subtle transition-colors">
          Learn more
        </button>
      </div>
      <div className="mt-12 flex gap-2">
        <span className="rounded-full bg-success/10 text-success px-3 py-1 text-caption">Open</span>
        <span className="rounded-full bg-warning/10 text-warning px-3 py-1 text-caption">Closing soon</span>
        <span className="rounded-full bg-destructive/10 text-destructive px-3 py-1 text-caption">Closed</span>
        <span className="rounded-full bg-brand-accent/10 text-brand-accent px-3 py-1 text-caption">Featured</span>
      </div>
    </main>
  );
}
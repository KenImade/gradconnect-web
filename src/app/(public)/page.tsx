export default function Home() {
  return (
    <main className="container mx-auto px-4 py-24">
      <p className="text-caption text-text-dim tracking-wider uppercase">Design system check</p>
      <h1 className="font-display text-display-xl text-foreground mt-2">GradConnect</h1>
      <p className="text-body-lg text-text-dim mt-4 max-w-prose">
        Nigeria&apos;s graduate career intelligence platform. Every graduate deserves equal access
        to the information they need to launch their career.
      </p>
      <div className="mt-8 flex gap-3">
        <button className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-md px-6 py-3 transition-colors">
          Browse Employers
        </button>
        <button className="border-border-strong text-foreground hover:bg-surface-subtle rounded-md border bg-transparent px-6 py-3 transition-colors">
          Learn more
        </button>
      </div>
      <div className="mt-12 flex gap-2">
        <span className="bg-success/10 text-success text-caption rounded-full px-3 py-1">Open</span>
        <span className="bg-warning/10 text-warning text-caption rounded-full px-3 py-1">
          Closing soon
        </span>
        <span className="bg-destructive/10 text-destructive text-caption rounded-full px-3 py-1">
          Closed
        </span>
        <span className="bg-brand-accent/10 text-brand-accent text-caption rounded-full px-3 py-1">
          Featured
        </span>
      </div>
    </main>
  );
}

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-text-dim flex items-center gap-3">
        <span className="bg-primary inline-block size-2 animate-pulse rounded-full" />
        <span className="bg-primary inline-block size-2 animate-pulse rounded-full [animation-delay:0.2s]" />
        <span className="bg-primary inline-block size-2 animate-pulse rounded-full [animation-delay:0.4s]" />
      </div>
    </div>
  );
}

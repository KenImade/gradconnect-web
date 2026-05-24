import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CallbackHandler } from "./callback-handler";

export const dynamic = "force-dynamic";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CallbackHandler />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Loader2 className="text-primary size-8 animate-spin" aria-hidden="true" />
      <p className="text-body-md text-text-dim">Signing you in…</p>
    </div>
  );
}

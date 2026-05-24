"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { googleAuth } from "@/lib/api/endpoints/auth";
import { consumeOAuthState } from "@/lib/auth/google";
import { APIError } from "@/lib/api/errors";

type CallbackState = { kind: "processing" } | { kind: "error"; message: string };

export function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<CallbackState>({ kind: "processing" });

  const ran = useRef(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    const googleError = searchParams.get("error");

    if (googleError) {
      setState({
        kind: "error",
        message:
          googleError === "access_denied"
            ? "You cancelled sign-in. No worries — try again whenever."
            : "Google sign-in was rejected. Please try again.",
      });
      return;
    }

    if (!code) {
      setState({
        kind: "error",
        message: "Missing authorization code. Please try signing in again.",
      });
      return;
    }

    const { state: stashedState, redirectAfterAuth } = consumeOAuthState();

    if (!stashedState || stashedState !== returnedState) {
      setState({
        kind: "error",
        message:
          "Security check failed. This can happen if the sign-in took too long, or if you opened the link in a different browser. Please try again.",
      });
      return;
    }

    (async () => {
      try {
        await googleAuth({ code });
        router.replace(redirectAfterAuth);
        router.refresh();
      } catch (err) {
        if (APIError.isAPIError(err)) {
          if (err.status === 409) {
            setState({
              kind: "error",
              message:
                "This email is registered with a password. Please sign in using your password instead.",
            });
          } else if (err.status === 401) {
            setState({
              kind: "error",
              message: "Google sign-in failed. Please try again.",
            });
          } else {
            setState({
              kind: "error",
              message: err.message || "Something went wrong. Please try again.",
            });
          }
        } else {
          setState({
            kind: "error",
            message: "Network error. Check your connection and try again.",
          });
        }
      }
    })();
  }, [router, searchParams]);

  if (state.kind === "processing") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="text-primary size-8 animate-spin" aria-hidden="true" />
        <p className="text-body-md text-text-dim">Signing you in…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <AlertCircle className="text-destructive size-8" aria-hidden="true" />
      <div>
        <h1 className="font-display text-display-sm text-foreground">
          Sign-in didn&apos;t complete
        </h1>
        <p className="text-body-sm text-text-dim mt-3">{state.message}</p>
      </div>
      <Link
        href="/login"
        className="bg-primary text-body-md text-primary-foreground hover:bg-primary-hover mt-2 inline-flex items-center justify-center rounded-md px-6 py-2.5 font-medium transition-colors"
      >
        Back to sign in
      </Link>
    </div>
  );
}

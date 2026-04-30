// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? "development",

  tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_ENV === "production" ? 0.1 : 1.0,

  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  enabled:
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_SENTRY_ENV === "staging",

  beforeSend(event, hint) {
    const error = hint.originalException;
    if (error instanceof Error) {
      if (error.message.includes("ResizeObserver loop")) return null;
      if (error.message.includes("Non-Error promise rejection")) return null;
    }
    return event;
  },

  enableLogs: true,
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
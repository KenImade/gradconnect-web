// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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
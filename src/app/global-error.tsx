"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "#1a1a1a",
          backgroundColor: "#fdf9f3",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem", width: "100%" }}>
          <p
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#8a7a6a",
              margin: 0,
            }}
          >
            Critical error
          </p>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              margin: "0.5rem 0 0",
              color: "#1a1a1a",
              lineHeight: 1.1,
            }}
          >
            The page couldn&apos;t load.
          </h1>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "1rem",
              color: "#5a4a3a",
              lineHeight: 1.5,
            }}
          >
            Something went wrong before we could render anything.
            Try refreshing — if the problem persists, the site may
            be temporarily down.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.625rem 1.25rem",
              backgroundColor: "#73262e",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
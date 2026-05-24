/**
 * Google OAuth helpers for the Authorization Code flow.
 *
 * Flow:
 *   1. Frontend calls startGoogleAuth() — stashes a CSRF token in
 *      sessionStorage and navigates to Google's consent screen.
 *   2. Google redirects back to /auth/google/callback?code=...&state=...
 *   3. The callback page calls consumeOAuthState() to verify the state
 *      parameter, then sends the code to the backend.
 *
 * Backend exchanges the code for an ID token using the client secret.
 * The frontend never sees the secret, never sees the ID token, never
 * handles the actual user identity — it just relays the code.
 */

const OAUTH_STATE_KEY = "google_oauth_state";
const OAUTH_REDIRECT_KEY = "google_oauth_redirect";

/**
 * Generates a cryptographically random state token. Used to prevent
 * CSRF attacks where an attacker tricks the user's browser into
 * completing an OAuth flow under the attacker's account.
 */
function generateState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Builds Google's OAuth authorization URL and navigates to it.
 * The user lands on Google's consent screen; after consent, Google
 * redirects to the configured callback URL with `code` and `state`.
 *
 * @param redirectAfterAuth Where to send the user once auth completes
 *                          (defaults to /dashboard). Stashed in
 *                          sessionStorage; the callback page reads it.
 */
export function startGoogleAuth(redirectAfterAuth: string = "/dashboard"): void {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
  }

  const state = generateState();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  sessionStorage.setItem(OAUTH_REDIRECT_KEY, redirectAfterAuth);

  const redirectUri = `${window.location.origin}/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

/**
 * Reads and clears the stashed OAuth state from sessionStorage.
 * The callback page calls this and compares the returned value against
 * the `state` parameter Google sent back. A mismatch means the request
 * didn't originate from this browser session — reject it.
 *
 * Returns null if no state was stashed (e.g. the user navigated to
 * the callback URL directly without going through startGoogleAuth).
 */
export function consumeOAuthState(): {
  state: string | null;
  redirectAfterAuth: string;
} {
  const state = sessionStorage.getItem(OAUTH_STATE_KEY);
  const redirectAfterAuth = sessionStorage.getItem(OAUTH_REDIRECT_KEY) ?? "/dashboard";

  sessionStorage.removeItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_REDIRECT_KEY);

  return { state, redirectAfterAuth };
}

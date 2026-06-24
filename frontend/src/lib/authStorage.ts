// Single source of truth for JWT persistence.
//
// We store the token in localStorage because the backend authenticates via the
// `Authorization: Bearer <token>` header rather than an httpOnly cookie. The
// tradeoff is that a token in localStorage is readable by injected scripts, so
// this is only as safe as the app is free of XSS. If the backend later adds
// cookie-based auth, this module is the only place that needs to change.

const TOKEN_KEY = 'chemstore.auth.token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    // localStorage can throw in private-mode / sandboxed contexts.
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Non-fatal: the session simply won't persist across reloads.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore.
  }
}

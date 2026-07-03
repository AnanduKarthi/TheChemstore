// Global authentication state, backed by Zustand (replacing the previous
// React Context). Components subscribe to just the slices they need via
// selectors, e.g. `useAuthStore((s) => s.user)`.
//
// `user` is `undefined` until the initial session check resolves, `null` once
// confirmed logged out, and a `User` once confirmed logged in. There is no
// separate `status` field: authenticated/loading are derived from `user` so
// the two can never drift apart.

import { create } from 'zustand';
import { toast } from 'sonner';

import { getMe } from '@/services/authApi';
import { getToken, setToken, clearToken } from '@/lib/authStorage';
import { ApiError, type User } from '@/types/auth';

interface AuthState {
  /** undefined = session not yet checked, null = logged out, User = logged in. */
  user: User | null | undefined;
  /** Confirm a stored token by loading the profile. Call once on app start. */
  bootstrap: () => Promise<void>;
  /**
   * Persist a JWT and hydrate the user via GET /me (login + email verification).
   * If hydration fails for any reason, the token is rolled back so a
   * half-confirmed session never lingers in storage. Rejects (ApiError) if
   * hydration fails.
   */
  applySession: (token: string) => Promise<void>;
  /** Re-fetch the current user from the server. */
  refreshUser: () => Promise<void>;
  /** Client-side logout: clears the token and resets state (no backend call). */
  logout: () => void;
}

let bootstrapped = false;

export const useAuthStore = create<AuthState>((set) => {
  /**
   * Fetches the current user and applies the result, guarding against races:
   * if the token in storage has changed since `expectedToken` was captured
   * (a newer login/logout happened while this request was in flight), the
   * result is stale and discarded instead of overwriting newer state.
   */
  async function hydrate(expectedToken: string): Promise<void> {
    try {
      const res = await getMe();
      if (getToken() !== expectedToken) return; // superseded by a newer session
      set({ user: res.data ?? null });
    } catch (err) {
      if (getToken() !== expectedToken) return; // superseded by a newer session
      // Any failure to confirm this token means the session isn't usable.
      // Only actively invalidate the stored token on 401 (confirmed bad);
      // other failures (network blips, 5xx) leave it in place so a later
      // reload can retry, but this view still reflects "not signed in" now.
      if (err instanceof ApiError && err.status === 401 && getToken() === expectedToken) {
        clearToken();
      }
      set({ user: null });
      throw err;
    }
  }

  return {
    user: getToken() ? undefined : null,

    bootstrap: async () => {
      if (bootstrapped) return;
      bootstrapped = true;
      const token = getToken();
      if (!token) {
        set({ user: null });
        return;
      }
      try {
        await hydrate(token);
      } catch {
        // bootstrap never throws to its caller; failure already reflected in state.
      }
    },

    applySession: async (token) => {
      setToken(token);
      try {
        await hydrate(token);
      } catch (err) {
        // Unlike bootstrap, a freshly-issued session that fails to hydrate
        // shouldn't leave a half-confirmed token sitting in storage.
        if (getToken() === token) clearToken();
        throw err;
      }
    },

    refreshUser: async () => {
      const token = getToken();
      if (!token) {
        set({ user: null });
        return;
      }
      await hydrate(token);
    },

    logout: () => {
      clearToken();
      set({ user: null });
      toast.success('Signed out');
    },
  };
});

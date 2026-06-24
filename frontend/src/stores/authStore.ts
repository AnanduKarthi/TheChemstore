// Global authentication state, backed by Zustand (replacing the previous
// React Context). Components subscribe to just the slices they need via
// selectors, e.g. `useAuthStore((s) => s.user)`.

import { create } from 'zustand';
import { toast } from 'sonner';

import { getMe } from '@/services/authApi';
import { getToken, setToken, clearToken } from '@/lib/authStorage';
import { ApiError, type User } from '@/types/auth';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  /** The signed-in user, or null when not authenticated / still loading. */
  user: User | null;
  /** Lifecycle status. `loading` only during the initial session bootstrap. */
  status: AuthStatus;
  /** Confirm a stored token by loading the profile. Call once on app start. */
  bootstrap: () => Promise<void>;
  /**
   * Persist a JWT and hydrate the user via GET /me (login + email verification).
   * Rejects (ApiError) if hydration fails.
   */
  applySession: (token: string) => Promise<void>;
  /** Re-fetch the current user from the server. */
  refreshUser: () => Promise<void>;
  /** Client-side logout: clears the token and resets state (no backend call). */
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Derive the initial status from token presence so first paint is correct.
  user: null,
  status: getToken() ? 'loading' : 'unauthenticated',

  bootstrap: async () => {
    const token = getToken();
    if (!token) {
      set({ status: 'unauthenticated' });
      return;
    }
    try {
      const res = await getMe();
      set({ user: res.data ?? null, status: 'authenticated' });
    } catch (err) {
      // 401 => invalid/expired token; drop it. Network errors leave the token
      // in place so a later reload can recover the session.
      if (err instanceof ApiError && err.status === 401) clearToken();
      set({ user: null, status: 'unauthenticated' });
    }
  },

  applySession: async (token) => {
    setToken(token);
    try {
      const res = await getMe();
      set({ user: res.data ?? null, status: 'authenticated' });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken();
        set({ status: 'unauthenticated' });
      }
      throw err;
    }
  },

  refreshUser: async () => {
    const res = await getMe();
    set({ user: res.data ?? null, status: 'authenticated' });
  },

  logout: () => {
    clearToken();
    set({ user: null, status: 'unauthenticated' });
    toast.success('Signed out');
  },
}));

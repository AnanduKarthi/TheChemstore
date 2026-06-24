// Thin, typed wrappers over the backend's /api/auth endpoints.
// Each function maps 1:1 to an endpoint in the verified backend contract.
// (The bearer token, when present, is attached by the apiClient interceptor;
// public endpoints simply ignore it.)

import { apiClient } from '@/services/apiClient';
import type {
  ApiSuccess,
  LoginPayload,
  SessionResponse,
  SignupPayload,
  User,
} from '@/types/auth';

/** POST /api/auth/signup — creates the account and triggers a verification email. */
export function signup(payload: SignupPayload) {
  return apiClient.post<ApiSuccess<{ id: string }>>('/auth/signup', payload);
}

/** POST /api/auth/login — returns a JWT (top-level `token`) and the user under `data`. */
export function login(payload: LoginPayload) {
  return apiClient.post<SessionResponse>('/auth/login', payload);
}

/** GET /api/auth/verify-email/:token — verifies and auto-logs-in (returns a token). */
export function verifyEmail(token: string) {
  return apiClient.get<SessionResponse>(`/auth/verify-email/${encodeURIComponent(token)}`);
}

/** POST /api/auth/resend-verification — always resolves success (anti-enumeration). */
export function resendVerification(email: string) {
  return apiClient.post<ApiSuccess>('/auth/resend-verification', { email });
}

/** GET /api/auth/me — hydrates the full user; requires a valid bearer token. */
export function getMe() {
  return apiClient.get<ApiSuccess<User>>('/auth/me');
}

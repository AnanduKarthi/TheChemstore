// Authentication-related types, kept separate from the dummy-data types in
// `types/index.ts`. These mirror the backend `/api/auth` response contract.

/** Full user shape returned by GET /api/auth/me. */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt?: string;
}

/**
 * Compact user shape returned alongside the token by login and verify-email.
 * `role` is only present on the login response, hence optional here.
 */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: 'user' | 'admin';
}

/** A single field-level validation error from the backend (422 responses). */
export interface FieldError {
  field: string;
  message: string;
}

/** Generic success envelope: every endpoint returns `{ success: true, ... }`. */
export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
  token?: string;
}

/** Payload accepted by POST /api/auth/signup (required fields only). */
export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

/** Payload accepted by POST /api/auth/login. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Login / verify-email success: token at the top level, user under `data`. */
export interface SessionResponse {
  success: true;
  token: string;
  data: AuthUser;
}

/**
 * Normalized error thrown by the API client for any non-2xx / `success:false`
 * response (or a network failure, where `status` is 0). Carries the HTTP
 * status, a human message, and any per-field validation errors.
 */
export class ApiError extends Error {
  status: number;
  fieldErrors: FieldError[];

  constructor(status: number, message: string, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  /** True when the failure was a network/connectivity problem, not an HTTP error. */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

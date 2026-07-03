// Axios-based client for the backend REST API.
//
// Responsibilities:
//   - prefix requests with VITE_API_BASE_URL
//   - attach `Authorization: Bearer <token>` via a request interceptor
//   - normalize every failure into a thrown `ApiError` (HTTP errors carry the
//     status + parsed field errors; no-response failures become status 0)
//
// It has no global side effects (no redirects/logout). Callers decide how to
// react to a status — AuthContext-equivalent store clears the token on a 401
// from /me, while the login form shows a 401 as an inline error.

import axios from 'axios';
import { ApiError, type FieldError } from '@/types/auth';
import { getToken } from '@/lib/authStorage';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function normalizeError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const data = err.response.data as { message?: string; errors?: FieldError[] } | undefined;
      return new ApiError(
        err.response.status,
        data?.message ?? `Request failed (${err.response.status}). Please try again.`,
        Array.isArray(data?.errors) ? data.errors : []
      );
    }
    // No response => network down, CORS rejection, or timeout.
    return new ApiError(0, "Couldn't reach the server. Check your connection and try again.");
  }
  return new ApiError(0, 'Something went wrong. Please try again.');
}

export const apiClient = {
  async get<T>(path: string, config?: { params?: Record<string, unknown> }): Promise<T> {
    try {
      const res = await instance.get<T>(path, config);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
  async post<T>(path: string, body?: unknown): Promise<T> {
    try {
      const res = await instance.post<T>(path, body);
      return res.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },
};

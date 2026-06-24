import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { ApiError } from '@/types/auth';

/**
 * Map a backend ApiError's per-field validation errors (422) onto a
 * react-hook-form. Only fields listed in `knownFields` are applied. Returns true
 * if at least one was applied, so the caller can decide whether to also surface a
 * general/form-level message.
 */
export function applyFieldErrors<T extends FieldValues>(
  err: ApiError,
  setError: UseFormSetError<T>,
  knownFields: Path<T>[]
): boolean {
  let applied = false;
  for (const fe of err.fieldErrors) {
    if ((knownFields as string[]).includes(fe.field)) {
      setError(fe.field as Path<T>, { message: fe.message });
      applied = true;
    }
  }
  return applied;
}

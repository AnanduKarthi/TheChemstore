import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/types/auth';

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

interface HandleAuthApiErrorOptions<T extends FieldValues> {
  /** Fields this form knows how to attach a 422 field error to. */
  knownFields: Path<T>[];
  /**
   * Endpoint-specific handling for particular HTTP statuses (e.g. 403
   * unverified-email on login, 409 duplicate-email on signup). Takes
   * precedence over the generic 422/network/root fallback below.
   */
  onStatus?: Partial<Record<number, (err: ApiError) => void>>;
}

/**
 * Shared decision tree for turning a caught error from an auth API call into
 * form feedback: non-ApiError -> toast, a caller-supplied status handler if
 * one matches, 422 -> per-field errors (falling back to a root message if
 * none of the fields are known), network failure -> toast, anything else ->
 * root-level form message.
 */
export function handleAuthApiError<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  { knownFields, onStatus }: HandleAuthApiErrorOptions<T>
): void {
  if (!(err instanceof ApiError)) {
    toast.error('Something went wrong. Please try again.');
    return;
  }

  const statusHandler = onStatus?.[err.status];
  if (statusHandler) {
    statusHandler(err);
    return;
  }

  if (err.status === 422) {
    const applied = applyFieldErrors(err, setError, knownFields);
    if (!applied) setError('root', { message: err.message });
    return;
  }

  if (err.isNetworkError) {
    toast.error(err.message);
    return;
  }

  setError('root', { message: err.message });
}

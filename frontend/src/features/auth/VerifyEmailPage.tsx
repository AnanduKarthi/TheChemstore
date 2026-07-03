import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loader2, MailX } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { verifyEmail } from '@/services/authApi';
import { ApiError } from '@/types/auth';
import { ResendEmailForm } from '@/features/auth/ResendVerification';

type State = 'verifying' | 'error';

export function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const applySession = useAuthStore((s) => s.applySession);
  // Derive initial state from token presence so the effect only sets state
  // asynchronously (inside the verifyEmail callbacks).
  const [state, setState] = useState<State>(token ? 'verifying' : 'error');
  const [message, setMessage] = useState(
    token ? '' : 'This verification link is missing its token.'
  );

  // Verification tokens are single-use: guard against calling verifyEmail
  // twice for the same token (React 18 StrictMode double-invokes effects in
  // dev, and this also protects against any other remount).
  const verifiedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token || verifiedTokenRef.current === token) return;
    verifiedTokenRef.current = token;
    let active = true;

    verifyEmail(token)
      .then(async (res) => {
        // verify-email returns a JWT and logs the user in.
        await applySession(res.token);
        if (!active) return;
        toast.success('Email verified — you’re now signed in.');
        navigate('/', { replace: true });
      })
      .catch((err: unknown) => {
        if (!active) return;
        setState('error');
        setMessage(
          err instanceof ApiError
            ? err.message
            : 'We couldn’t verify your email. Please try again.'
        );
      });

    return () => {
      active = false;
    };
    // Run once per token. Intentionally excluding applySession/navigate so a
    // context state change can't re-trigger verification with an already-used token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <Card className="w-full max-w-md rounded-2xl border-gray-100 shadow-xl">
        {state === 'verifying' ? (
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <Loader2 className="size-8 animate-spin text-brand-emerald" />
            <p className="text-muted-foreground">Verifying your email…</p>
          </CardContent>
        ) : (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <MailX className="size-6 text-destructive" />
              </div>
              <CardTitle>Verification failed</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <p className="text-sm text-muted-foreground">
                Verification links expire after 24 hours. Enter your email to get a new one.
              </p>
              <ResendEmailForm />
              <Button variant="ghost" onClick={() => navigate('/', { replace: true })}>
                Back to home
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}

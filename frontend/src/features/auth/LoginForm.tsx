import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { login } from '@/services/authApi';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas';
import { handleAuthApiError } from '@/features/auth/formUtils';
import { authInputClass, authLinkClass, authPrimaryButtonClass } from '@/features/auth/ui';
import { EmailField } from '@/features/auth/EmailField';
import { ResendButton } from '@/features/auth/ResendVerification';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const applySession = useAuthStore((s) => s.applySession);
  // Set when the backend returns 403 (account exists but email not verified).
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setUnverifiedEmail(null);
    form.clearErrors('root');
    try {
      const res = await login(values);
      await applySession(res.token);
      toast.success(`Welcome back, ${res.data.firstName}!`);
      onSuccess();
    } catch (err) {
      handleAuthApiError(err, form.setError, {
        knownFields: ['email', 'password'],
        onStatus: { 403: () => setUnverifiedEmail(values.email) },
      });
    }
  }

  const rootError = form.formState.errors.root?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {rootError && (
          <Alert variant="destructive">
            <AlertDescription>{rootError}</AlertDescription>
          </Alert>
        )}

        {unverifiedEmail && (
          <Alert>
            <AlertTitle>Verify your email to continue</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-3">
              <span>Your email isn’t verified yet. Check your inbox or request a new link.</span>
              <ResendButton email={unverifiedEmail} />
            </AlertDescription>
          </Alert>
        )}

        <EmailField control={form.control} name="email" />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(authInputClass)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="brand"
          className={cn(authPrimaryButtonClass)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don’t have an account?{' '}
          <button type="button" onClick={onSwitchToSignup} className={authLinkClass}>
            Sign up
          </button>
        </p>
      </form>
    </Form>
  );
}

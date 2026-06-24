import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { resendVerification } from '@/services/authApi';
import { ApiError } from '@/types/auth';
import { emailSchema, type EmailFormValues } from '@/features/auth/schemas';
import { authInputClass, authPrimaryButtonClass } from '@/features/auth/ui';

async function send(email: string): Promise<void> {
  try {
    const res = await resendVerification(email);
    toast.success(res.message ?? 'Verification email sent.');
  } catch (err) {
    toast.error(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
  }
}

/** Button-only resend, for when the email is already known (signup / 403 login). */
export function ResendButton({ email }: { email: string }) {
  const [sending, setSending] = useState(false);

  async function handleClick() {
    setSending(true);
    await send(email);
    setSending(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="border-brand-emerald text-brand-emerald hover:bg-brand-emerald/5 hover:text-brand-emerald-dark"
      disabled={sending}
      onClick={handleClick}
    >
      {sending ? 'Sending…' : 'Resend verification email'}
    </Button>
  );
}

/** Email-input resend, for when the email is unknown (verify-email error page). */
export function ResendEmailForm({ defaultEmail = '' }: { defaultEmail?: string }) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: defaultEmail },
  });

  async function onSubmit(values: EmailFormValues) {
    await send(values.email);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
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
          className={cn(authPrimaryButtonClass)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Sending…' : 'Resend verification email'}
        </Button>
      </form>
    </Form>
  );
}

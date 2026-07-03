import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { signup } from '@/services/authApi';
import { signupSchema, type SignupFormValues } from '@/features/auth/schemas';
import { handleAuthApiError } from '@/features/auth/formUtils';
import { authInputClass, authLinkClass, authPrimaryButtonClass } from '@/features/auth/ui';
import { EmailField } from '@/features/auth/EmailField';

interface SignupFormProps {
  /** Called after a successful signup, with the email a verification link was sent to. */
  onSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  async function onSubmit(values: SignupFormValues) {
    form.clearErrors('root');
    try {
      await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });
      onSuccess(values.email);
    } catch (err) {
      handleAuthApiError(err, form.setError, {
        knownFields: ['firstName', 'lastName', 'email', 'phoneNumber', 'password'],
        onStatus: { 409: (e) => form.setError('email', { message: e.message }) },
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

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input autoComplete="given-name" className={cn(authInputClass)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input autoComplete="family-name" className={cn(authInputClass)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <EmailField control={form.control} name="email" />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className={cn(authInputClass)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  autoComplete="new-password"
                  className={cn(authInputClass)}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                At least 8 characters, with an uppercase, lowercase, and a number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(authInputClass)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    className="mt-0.5 data-[state=checked]:bg-brand-emerald data-[state=checked]:border-brand-emerald"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal leading-snug">
                  I agree to the Terms of Service and Privacy Policy.
                </FormLabel>
              </div>
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
          {form.formState.isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className={authLinkClass}>
            Sign in
          </button>
        </p>
      </form>
    </Form>
  );
}

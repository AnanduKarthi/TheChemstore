import type { Control, FieldValues, Path } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { authInputClass } from '@/features/auth/ui';

interface EmailFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

/** Shared email input, used by every auth form (login, signup, resend). */
export function EmailField<T extends FieldValues>({ control, name }: EmailFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
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
  );
}

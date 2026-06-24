// Client-side validation schemas. These mirror the backend express-validator
// rules exactly so the UI rejects bad input before a round-trip, while the
// server stays the source of truth (its 422 errors still map back to fields).

import { z } from 'zod';

// Backend: password min 8 AND must contain a lowercase, uppercase, and digit.
const passwordRules = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/\d/, 'Include at least one number');

// Backend phone rule: /^\+?[\d\s\-()]{7,15}$/
const phoneRule = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .regex(/^\+?[\d\s\-()]{7,15}$/, 'Enter a valid phone number');

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required').max(50, 'Max 50 characters'),
    lastName: z.string().trim().min(1, 'Last name is required').max(50, 'Max 50 characters'),
    email: z.email('Enter a valid email address'),
    phoneNumber: phoneRule,
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    // boolean + refine (not z.literal) so the form can default to `false`.
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const emailSchema = z.object({
  email: z.email('Enter a valid email address'),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type EmailFormValues = z.infer<typeof emailSchema>;

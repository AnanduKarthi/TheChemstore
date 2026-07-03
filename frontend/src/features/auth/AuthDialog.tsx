import { useState, type ReactNode } from 'react';
import { Briefcase, MailCheck } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/features/auth/LoginForm';
import { SignupForm } from '@/features/auth/SignupForm';
import { ResendButton } from '@/features/auth/ResendVerification';

export type AuthMode = 'login' | 'signup';
type View = AuthMode | 'verify-sent';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which view to show when the dialog opens. */
  mode: AuthMode;
}

/** Branded header shared by every view: the navy logo mark + title + subtitle. */
function AuthHeader({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description: ReactNode;
}) {
  return (
    <DialogHeader className="items-center text-center">
      <div className="mb-1 flex size-12 items-center justify-center rounded-xl bg-brand-navy">
        {icon ?? <Briefcase className="size-6 text-white" />}
      </div>
      <DialogTitle className="text-2xl font-bold text-brand-navy">{title}</DialogTitle>
      <DialogDescription className="text-base text-gray-600">{description}</DialogDescription>
    </DialogHeader>
  );
}

export function AuthDialog({ open, onOpenChange, mode }: AuthDialogProps) {
  const [view, setView] = useState<View>(mode);
  const [pendingEmail, setPendingEmail] = useState('');

  // Reset to the requested mode during render (avoids an extra commit and
  // the set-state-in-effect lint rule) whenever the *effective* mode changes
  // — either the dialog just opened, or `mode` changed while already open.
  // Tracking `open ? mode : null` (not just `open`) is what makes the second
  // case work: comparing `open` alone would miss a mode change mid-session.
  const effectiveMode = open ? mode : null;
  const [prevEffectiveMode, setPrevEffectiveMode] = useState(effectiveMode);
  if (effectiveMode !== prevEffectiveMode) {
    setPrevEffectiveMode(effectiveMode);
    if (effectiveMode) setView(effectiveMode);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-gray-100 p-7 shadow-xl sm:max-w-md">
        {view === 'login' && (
          <>
            <AuthHeader title="Welcome back" description="Sign in to your TheChemstore account." />
            <LoginForm
              onSuccess={() => onOpenChange(false)}
              onSwitchToSignup={() => setView('signup')}
            />
          </>
        )}

        {view === 'signup' && (
          <>
            <AuthHeader
              title="Create your account"
              description="Join TheChemstore to apply for jobs and more."
            />
            <SignupForm
              onSuccess={(email) => {
                setPendingEmail(email);
                setView('verify-sent');
              }}
              onSwitchToLogin={() => setView('login')}
            />
          </>
        )}

        {view === 'verify-sent' && (
          <>
            <AuthHeader
              icon={<MailCheck className="size-6 text-white" />}
              title="Check your email"
              description={
                <>
                  We sent a verification link to <strong>{pendingEmail}</strong>. Click it to
                  activate your account, then sign in.
                </>
              }
            />
            <div className="flex flex-col gap-3">
              <p className="text-center text-sm text-muted-foreground">
                Didn’t get the email? Check your spam folder or resend it below.
              </p>
              <ResendButton email={pendingEmail} />
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-brand-navy"
                onClick={() => setView('login')}
              >
                Back to sign in
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

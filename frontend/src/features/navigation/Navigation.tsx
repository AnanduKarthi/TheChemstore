import { useState } from 'react';
import { Briefcase, Menu, User as UserIcon, ChevronDown, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import { AuthDialog, type AuthMode } from '@/features/auth/AuthDialog';

const navLinks = [
  { label: 'Jobs', href: '#jobs' },
  { label: 'The Academy', href: '#academy' },
  { label: 'Bookstore', href: '#bookstore' },
  { label: 'Resources', href: '#resources' },
];

export function Navigation() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = user != null;
  const logout = useAuthStore((s) => s.logout);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-navy rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-brand-navy text-xl font-semibold">TheChemstore</span>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-brand-navy transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA / Auth + Mobile Toggle */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center gap-2 text-gray-700 hover:text-brand-navy transition-colors">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
                      <UserIcon className="w-5 h-5" />
                    </span>
                    <span className="font-medium">{user.firstName}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => logout()}>
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="hidden md:flex text-gray-700 hover:text-brand-navy font-medium transition-colors"
              >
                Sign in
              </button>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => openAuth('signup')}
                className="hidden md:flex bg-brand-emerald hover:bg-brand-emerald-dark text-white px-6 py-2.5 rounded-lg transition-colors"
              >
                Sign up
              </button>
            )}

            <button className="hidden md:flex border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white px-6 py-2.5 rounded-lg transition-colors">
              Post a Job
            </button>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 text-gray-700" aria-label="Open menu">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <SheetDescription className="sr-only">Main site navigation links</SheetDescription>
                <div className="mt-8 flex flex-col gap-4 px-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <a
                        href={link.href}
                        className="text-gray-700 hover:text-brand-navy transition-colors py-2"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  ))}

                  <div className="mt-2 border-t border-gray-100 pt-4 flex flex-col gap-3">
                    {isAuthenticated && user ? (
                      <>
                        <div className="flex flex-col">
                          <span className="font-medium text-brand-navy">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                        <SheetClose asChild>
                          <button
                            onClick={() => logout()}
                            className="flex items-center gap-2 text-gray-700 hover:text-brand-navy transition-colors py-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <button
                            onClick={() => openAuth('login')}
                            className="text-left text-gray-700 hover:text-brand-navy transition-colors py-2"
                          >
                            Sign in
                          </button>
                        </SheetClose>
                        <SheetClose asChild>
                          <button
                            onClick={() => openAuth('signup')}
                            className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-6 py-2.5 rounded-lg transition-colors w-full text-center"
                          >
                            Sign up
                          </button>
                        </SheetClose>
                      </>
                    )}
                    <SheetClose asChild>
                      <button className="border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white px-6 py-2.5 rounded-lg transition-colors w-full text-center">
                        Post a Job
                      </button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} mode={authMode} />
    </nav>
  );
}

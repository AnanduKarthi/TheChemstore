import { Briefcase, Menu } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { label: 'Jobs', href: '#jobs' },
  { label: 'The Academy', href: '#academy' },
  { label: 'Bookstore', href: '#bookstore' },
  { label: 'Resources', href: '#resources' },
];

export function Navigation() {
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

          {/* CTA Button and Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex bg-brand-emerald hover:bg-brand-emerald-dark text-white px-6 py-2.5 rounded-lg transition-colors">
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
                  <SheetClose asChild>
                    <button className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-6 py-2.5 rounded-lg transition-colors mt-2 w-full text-center">
                      Post a Job
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

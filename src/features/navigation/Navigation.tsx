import { useState } from 'react';
import { Briefcase, Menu, X } from 'lucide-react';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-navy rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-brand-navy text-xl font-semibold">
              TheChemstore
            </span>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#jobs" className="text-gray-700 hover:text-brand-navy transition-colors">
              Jobs
            </a>
            <a href="#academy" className="text-gray-700 hover:text-brand-navy transition-colors">
              The Academy
            </a>
            <a href="#bookstore" className="text-gray-700 hover:text-brand-navy transition-colors">
              Bookstore
            </a>
            <a href="#resources" className="text-gray-700 hover:text-brand-navy transition-colors">
              Resources
            </a>
          </div>

          {/* CTA Button and Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex bg-brand-emerald hover:bg-brand-emerald-dark text-white px-6 py-2.5 rounded-lg transition-colors">
              Post a Job
            </button>
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <a href="#jobs" className="text-gray-700 hover:text-brand-navy transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Jobs
            </a>
            <a href="#academy" className="text-gray-700 hover:text-brand-navy transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
              The Academy
            </a>
            <a href="#bookstore" className="text-gray-700 hover:text-brand-navy transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Bookstore
            </a>
            <a href="#resources" className="text-gray-700 hover:text-brand-navy transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Resources
            </a>
            <button className="bg-brand-emerald hover:bg-brand-emerald-dark text-white px-6 py-2.5 rounded-lg transition-colors mt-2 w-full text-center">
              Post a Job
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

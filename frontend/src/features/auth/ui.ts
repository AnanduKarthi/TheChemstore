// Shared Tailwind class strings so auth controls match the site's design system:
// gray-50 input wells and full-width rounded-lg CTAs, mirroring the Hero
// search bar and Navigation buttons. Merge with cn() at call sites.
//
// Color for the primary CTA comes from Button's `brand` variant (see
// components/ui/button.tsx) rather than a hardcoded class here, so the
// brand-emerald look stays defined in one place.

export const authInputClass =
  'h-11 bg-gray-50 border-gray-200 focus-visible:border-brand-emerald focus-visible:ring-brand-emerald/20';

export const authPrimaryButtonClass = 'w-full h-11 rounded-lg';

export const authLinkClass = 'font-medium text-brand-emerald hover:text-brand-emerald-dark hover:underline';

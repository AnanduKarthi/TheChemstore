// Shared Tailwind class strings so auth controls match the site's design system:
// gray-50 input wells and emerald CTAs with rounded-lg corners, mirroring the
// Hero search bar and Navigation buttons. Merge with cn() at call sites.

export const authInputClass =
  'h-11 bg-gray-50 border-gray-200 focus-visible:border-brand-emerald focus-visible:ring-brand-emerald/20';

export const authPrimaryButtonClass =
  'w-full h-11 rounded-lg bg-brand-emerald text-white hover:bg-brand-emerald-dark';

export const authLinkClass = 'font-medium text-brand-emerald hover:text-brand-emerald-dark hover:underline';

// Adapts a backend Job document (backend/models/Job.js shape) into the
// flat `Job` type the existing JobFeed UI already knows how to render.

import { formatRelativeTime } from '@/lib/date';
import type { Job } from '@/types';
import type { BackendJob, EmploymentType } from '@/types/job';

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  temporary: 'Temporary',
  other: 'Other',
};

const LOGO_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-purple-600',
  'bg-orange-600',
  'bg-pink-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-amber-600',
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Deterministic single-letter/color badge for a company — same input, same badge. */
export function getCompanyBadge(company: string) {
  return {
    logo: company.charAt(0).toUpperCase(),
    logoColor: LOGO_COLORS[hashString(company) % LOGO_COLORS.length],
  };
}

export function formatLocation(location: BackendJob['location']): string {
  if (!location) return 'Location not specified';
  if (location.remote) return 'Remote';
  if (location.formatted) return location.formatted;
  return [location.city, location.state, location.country].filter(Boolean).join(', ') || 'Location not specified';
}

export function adaptJob(job: BackendJob): Job {
  return {
    id: job._id,
    title: job.title,
    company: job.company,
    location: formatLocation(job.location),
    type: job.employmentType ? EMPLOYMENT_TYPE_LABELS[job.employmentType] : 'Not specified',
    posted: job.postedAt ? formatRelativeTime(job.postedAt) : 'Recently',
    ...getCompanyBadge(job.company),
  };
}

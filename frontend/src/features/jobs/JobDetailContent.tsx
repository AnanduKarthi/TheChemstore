import { MapPin, Clock, Briefcase, GraduationCap, Wallet, ExternalLink, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/date';
import { EMPLOYMENT_TYPE_LABELS, formatLocation, getCompanyBadge } from '@/lib/adaptJob';
import { titleCase } from '@/lib/text';
import type { BackendJob, ExperienceLevel, JobSource } from '@/types/job';

const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  intern: 'Internship',
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  lead: 'Lead',
  manager: 'Manager',
  other: 'Other',
};

const SOURCE_LABELS: Record<JobSource, string> = {
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
  naukri: 'Naukri',
  glassdoor: 'Glassdoor',
  google_jobs: 'Google Jobs',
  other: 'the source site',
};

function formatSalary(salary: BackendJob['salary']): string | null {
  if (!salary || (salary.min == null && salary.max == null)) return null;
  const currency = salary.currency ? `${salary.currency} ` : '';
  const period = salary.period ? ` / ${salary.period}` : '';
  if (salary.min != null && salary.max != null) {
    return `${currency}${salary.min.toLocaleString()} – ${salary.max.toLocaleString()}${period}`;
  }
  const value = salary.min ?? salary.max;
  return `${currency}${value!.toLocaleString()}${period}`;
}

function HighlightList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-brand-navy font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-brand-emerald mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobDetailContent({ job }: { job: BackendJob }) {
  const { logo, logoColor } = getCompanyBadge(job.company);
  const salary = formatSalary(job.salary);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex gap-4">
        <div
          className={`w-16 h-16 ${logoColor} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-white text-2xl font-bold">{logo}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-brand-navy text-2xl font-bold mb-1">{job.title}</h2>
          <p className="text-gray-600 text-lg">{job.company}</p>
        </div>
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          {formatLocation(job.location)}
        </div>
        {job.postedAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatRelativeTime(job.postedAt)}
          </div>
        )}
        {job.employmentType && (
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
          </div>
        )}
        {job.experienceLevel && (
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            {EXPERIENCE_LEVEL_LABELS[job.experienceLevel]}
          </div>
        )}
      </div>

      {/* Salary */}
      {salary && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4">
          <Wallet className="w-5 h-5 text-brand-emerald-dark flex-shrink-0" />
          <span className="text-brand-emerald-dark font-semibold">{salary}</span>
        </div>
      )}

      {/* Chemistry field + skills */}
      {(job.chemistryField || (job.skills && job.skills.length > 0)) && (
        <div className="flex flex-wrap gap-2">
          {job.chemistryField && (
            <span className="px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy text-sm font-medium border border-brand-navy/10">
              {titleCase(job.chemistryField)}
            </span>
          )}
          {job.skills?.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {job.description && (
        <div>
          <h3 className="text-brand-navy font-semibold mb-3">About this role</h3>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">{job.description}</p>
        </div>
      )}

      <HighlightList title="Qualifications" items={job.highlights?.qualifications} />
      <HighlightList title="Responsibilities" items={job.highlights?.responsibilities} />
      <HighlightList title="Benefits" items={job.highlights?.benefits} />

      {/* Apply CTA */}
      <div className="border-t border-gray-100 pt-6">
        {job.applyUrl ? (
          <>
            <Button variant="brand" size="lg" asChild className="w-full sm:w-auto">
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            {job.source && (
              <p className="text-gray-400 text-sm mt-3">
                You’ll be redirected to {SOURCE_LABELS[job.source]} to complete your application.
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500">
            No application link is available for this listing right now.
          </p>
        )}
      </div>
    </div>
  );
}

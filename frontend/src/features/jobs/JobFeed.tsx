import { Link, useLocation } from 'react-router';
import { MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';

import { adaptJob } from '@/lib/adaptJob';
import { titleCase } from '@/lib/text';
import { useJobFilterMetaQuery, useJobFilters, useJobsQuery } from '@/features/jobs/hooks/useJobsFeed';

export function JobFeed() {
  const location = useLocation();
  const { filters, toggleChemistryField } = useJobFilters();
  const filterMeta = useJobFilterMetaQuery();
  const jobsQuery = useJobsQuery(filters);

  const categories = filterMeta.data.data.chemistryFields.map((field) => ({
    id: field,
    label: titleCase(field),
  }));

  const jobs = jobsQuery.data.pages.flatMap((page) => page.data).map(adaptJob);
  const hasNextPage = jobsQuery.hasNextPage;

  return (
    <section className="py-20 bg-white" id="jobs">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-brand-navy mb-3 text-[42px] font-bold">
            Latest Chemistry Opportunities
          </h2>
          <p className="text-gray-600 text-lg">
            Browse positions from leading companies across all chemistry disciplines
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const isActive = filters.chemistryField === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleChemistryField(category.id)}
                className={`px-5 py-2 rounded-full border transition-all ${
                  isActive
                    ? 'border-brand-emerald bg-brand-emerald text-white'
                    : 'border-gray-200 hover:border-brand-emerald hover:bg-brand-emerald hover:text-white text-gray-700'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-500 mb-8">No jobs match your search right now.</p>
        ) : (
          <>
            {/* Job Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  state={{ backgroundLocation: location }}
                  className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-brand-emerald transition-all group"
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-14 h-14 ${job.logoColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-white text-2xl font-bold">{job.logo}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-brand-navy mb-1 group-hover:text-brand-emerald transition-colors text-xl font-semibold">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{job.company}</p>
                      <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.posted}
                        </div>
                        <div className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                          {job.type}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <button
                type="button"
                disabled={!hasNextPage || jobsQuery.isFetchingNextPage}
                onClick={() => jobsQuery.fetchNextPage()}
                className="inline-flex items-center gap-2 text-brand-emerald hover:text-brand-emerald-dark transition-colors group text-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {jobsQuery.isFetchingNextPage ? (
                  <>
                    Loading more
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : hasNextPage ? (
                  <>
                    View All Chemistry Jobs
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  "You've seen all jobs"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

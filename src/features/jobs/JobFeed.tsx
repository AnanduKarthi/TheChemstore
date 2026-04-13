import { MapPin, Clock, ArrowRight } from 'lucide-react';

import { jobs } from '../../data/jobs';
import { categories } from '../../data/categories';


export function JobFeed() {
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
          {categories.map((category) => (
            <button
              key={category.id}
              className="px-5 py-2 rounded-full border border-gray-200 hover:border-brand-emerald hover:bg-brand-emerald hover:text-white text-gray-700 transition-all"
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-brand-emerald transition-all cursor-pointer group"
            >
              <div className="flex gap-4">
                <div className={`w-14 h-14 ${job.logoColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-2xl font-bold">
                    {job.logo}
                  </span>
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
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 text-brand-emerald hover:text-brand-emerald-dark transition-colors group text-lg font-semibold">
            View All Chemistry Jobs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

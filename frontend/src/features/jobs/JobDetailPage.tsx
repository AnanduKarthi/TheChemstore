import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import { Navigation } from '@/features/navigation/Navigation';
import { JobDetailPanel } from '@/features/jobs/JobDetailPanel';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-emerald hover:text-brand-emerald-dark font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to jobs
          </Link>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {id && <JobDetailPanel jobId={id} />}
          </div>
        </div>
      </main>
    </>
  );
}

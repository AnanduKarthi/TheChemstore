import { Button } from '@/components/ui/button';
import { JobDetailSkeleton } from '@/components/ui/Skeletons';
import { useJobDetailQuery } from '@/features/jobs/hooks/useJobDetailQuery';
import { JobDetailContent } from '@/features/jobs/JobDetailContent';
import { ApiError } from '@/types/auth';

export function JobDetailPanel({ jobId }: { jobId: string }) {
  const query = useJobDetailQuery(jobId);

  if (query.isPending) {
    return <JobDetailSkeleton />;
  }

  if (query.isError) {
    const notFound = query.error instanceof ApiError && query.error.status === 404;
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 mb-4">
          {notFound
            ? 'This job posting is no longer available.'
            : 'Something went wrong loading this job.'}
        </p>
        {!notFound && (
          <Button variant="outline" onClick={() => query.refetch()}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  return <JobDetailContent job={query.data.data} />;
}

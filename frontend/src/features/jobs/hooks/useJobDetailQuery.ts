import { useQuery } from '@tanstack/react-query';
import { getJobById } from '@/services/jobsApi';

export function useJobDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id!),
    enabled: Boolean(id),
  });
}

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getFilterMeta, getJobs } from '@/services/jobsApi';

const PAGE_SIZE = 6;

/** Job search/filter state, sourced from the URL so it's shareable and shared
 * between `Hero` (writes `q`/`location`) and `JobFeed` (reads everything). */
export function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      q: searchParams.get('q') ?? undefined,
      location: searchParams.get('location') ?? undefined,
      chemistryField: searchParams.get('chemistryField') ?? undefined,
    }),
    [searchParams]
  );

  // A single setSearchParams call per user action — react-router's updater
  // closes over a per-render `prev` snapshot, so two separate calls in the
  // same event handler would each start from the same stale state and the
  // second would clobber the first. Callers that need to change more than
  // one param at once (e.g. Hero's search form) must use `updateFilters`.
  const updateFilters = useCallback(
    (patch: Partial<{ q: string; location: string; chemistryField: string }>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const toggleChemistryField = useCallback(
    (field: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (next.get('chemistryField') === field) next.delete('chemistryField');
        else next.set('chemistryField', field);
        return next;
      });
    },
    [setSearchParams]
  );

  return { filters, updateFilters, toggleChemistryField };
}

export type JobFilters = ReturnType<typeof useJobFilters>['filters'];

export function useJobsQuery(filters: JobFilters) {
  return useSuspenseInfiniteQuery({
    queryKey: ['jobs', filters],
    queryFn: ({ pageParam }) => getJobs({ ...filters, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });
}

export function useJobFilterMetaQuery() {
  return useSuspenseQuery({
    queryKey: ['jobFilterMeta'],
    queryFn: getFilterMeta,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

// Thin, typed wrappers over the backend's /api/jobs endpoints.
// Each function maps 1:1 to an endpoint in the verified backend contract
// (see backend/routes/jobs.js). The bearer token, when present, is attached
// by the apiClient interceptor; these are public endpoints and ignore it.

import { apiClient } from '@/services/apiClient';
import type {
  FilterMetaResponse,
  JobDetailResponse,
  JobListResponse,
  JobQueryParams,
} from '@/types/job';

/** GET /api/jobs — paginated, filterable job list. */
export function getJobs(params: JobQueryParams) {
  return apiClient.get<JobListResponse>('/jobs', {
    params: {
      q: params.q || undefined,
      location: params.location || undefined,
      chemistryField: params.chemistryField || undefined,
      page: params.page,
      limit: params.limit,
    },
  });
}

/** GET /api/jobs/:id — full details of a single job. */
export function getJobById(id: string) {
  return apiClient.get<JobDetailResponse>(`/jobs/${encodeURIComponent(id)}`);
}

/** GET /api/jobs/filters/meta — distinct filter values for populating filter UI. */
export function getFilterMeta() {
  return apiClient.get<FilterMetaResponse>('/jobs/filters/meta');
}

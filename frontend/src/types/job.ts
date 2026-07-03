// Types mirroring the backend `/api/jobs` contract (backend/models/Job.js,
// backend/controllers/jobController.js). Kept separate from the adapted
// `Job` shape in `types/index.ts`, which is what the UI actually renders.

export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'temporary'
  | 'other';

export type ChemistryField =
  | 'organic'
  | 'inorganic'
  | 'analytical'
  | 'physical'
  | 'biochemistry'
  | 'polymer'
  | 'medicinal'
  | 'environmental'
  | 'industrial'
  | 'food'
  | 'materials'
  | 'computational'
  | 'other';

export type ExperienceLevel = 'intern' | 'entry' | 'mid' | 'senior' | 'lead' | 'manager' | 'other';

export type JobSource = 'linkedin' | 'indeed' | 'naukri' | 'glassdoor' | 'google_jobs' | 'other';

/** A job document as returned by the backend (GET /api/jobs, GET /api/jobs/:id). */
export interface BackendJob {
  _id: string;
  title: string;
  company: string;
  description?: string;
  applyUrl?: string;
  source?: JobSource;
  publisher?: string;
  employmentType?: EmploymentType;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    remote?: boolean;
    formatted?: string;
  };
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  postedAt?: string;
  lastSeenAt?: string;
  chemistryField?: ChemistryField;
  experienceLevel?: ExperienceLevel;
  skills?: string[];
  highlights?: {
    qualifications?: string[];
    responsibilities?: string[];
    benefits?: string[];
  };
  isActive?: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}

/** GET /api/jobs response envelope. */
export interface JobListResponse {
  success: true;
  data: BackendJob[];
  pagination: Pagination;
}

/** GET /api/jobs/:id response envelope. */
export interface JobDetailResponse {
  success: true;
  data: BackendJob;
}

/** GET /api/jobs/filters/meta response envelope. */
export interface FilterMetaResponse {
  success: true;
  data: {
    sources: JobSource[];
    chemistryFields: ChemistryField[];
    experienceLevels: ExperienceLevel[];
    employmentTypes: EmploymentType[];
    countries: string[];
  };
}

/** Query params accepted by GET /api/jobs (only the ones this app currently uses). */
export interface JobQueryParams {
  q?: string;
  location?: string;
  chemistryField?: string;
  page?: number;
  limit?: number;
}

const axios = require('axios');
const crypto = require('crypto');

// Chemistry-specific queries to maximise coverage across sub-disciplines
const CHEMISTRY_QUERIES = [
  'chemistry jobs',
  'chemist jobs',
  'biochemistry jobs',
  'analytical chemistry jobs',
  'organic chemistry jobs',
  'pharmaceutical chemistry jobs',
];

const SOURCE_MAP = {
  linkedin: 'linkedin',
  indeed: 'indeed',
  naukri: 'naukri',
  glassdoor: 'glassdoor',
  'google jobs': 'google_jobs',
};

const EMPLOYMENT_TYPE_MAP = {
  FULLTIME: 'full_time',
  PARTTIME: 'part_time',
  CONTRACTOR: 'contract',
  INTERN: 'internship',
  TEMPORARY: 'temporary',
};

const normalizeSource = (publisher = '') => {
  const key = publisher.toLowerCase();
  for (const [k, v] of Object.entries(SOURCE_MAP)) {
    if (key.includes(k)) return v;
  }
  return 'other';
};

const normalizeEmploymentType = (type = '') =>
  EMPLOYMENT_TYPE_MAP[type?.toUpperCase()] || 'other';

const generateDedupeHash = (title = '', company = '', locationFormatted = '') => {
  const normalized = [title, company, locationFormatted]
    .map((s) => s.toLowerCase().replace(/\s+/g, ' ').trim())
    .join('|');
  return crypto.createHash('sha256').update(normalized).digest('hex');
};

const normalizeJob = (raw) => {
  const locationFormatted = [raw.job_city, raw.job_state, raw.job_country]
    .filter(Boolean)
    .join(', ');

  return {
    externalId: raw.job_id,
    title: raw.job_title || '',
    company: raw.employer_name || '',
    description: raw.job_description || '',
    applyUrl: raw.job_apply_link || '',
    source: normalizeSource(raw.job_publisher),
    publisher: raw.job_publisher,
    employmentType: normalizeEmploymentType(raw.job_employment_types?.[0] || raw.job_employment_type),
    location: {
      city: raw.job_city,
      state: raw.job_state,
      country: raw.job_country,
      remote: raw.job_is_remote || false,
      formatted: locationFormatted,
    },
    salary: {
      min: raw.job_min_salary || null,
      max: raw.job_max_salary || null,
      currency: raw.job_salary_currency || null,
      period: raw.job_salary_period || null,
    },
    postedAt: raw.job_posted_at_timestamp
      ? new Date(raw.job_posted_at_timestamp * 1000)
      : new Date(),
    highlights: {
      qualifications: raw.job_highlights?.Qualifications || [],
      responsibilities: raw.job_highlights?.Responsibilities || [],
      benefits: raw.job_highlights?.Benefits || [],
    },
    skills: raw.job_required_skills || [],
    dedupeHash: generateDedupeHash(raw.job_title, raw.employer_name, locationFormatted),
    lastSeenAt: new Date(),
  };
};

// num_pages:2 fetches 2 pages in a single request — one API call per query
const fetchQuery = async (query) => {
  const response = await axios.get('https://jsearch.p.rapidapi.com/search-v2', {
    params: { query, num_pages: 2, country: 'in', date_posted: 'all' },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
    },
    timeout: 15000,
  });
  return response.data?.data?.jobs || [];
};

const fetchAllChemistryJobs = async () => {
  const allJobs = [];
  const seenHashes = new Set();

  for (const query of CHEMISTRY_QUERIES) {
    try {
      const raw = await fetchQuery(query);
      console.log(`[JobFetcher] "${query}" → ${raw.length} results`);

      for (const item of raw) {
        const job = normalizeJob(item);
        if (!seenHashes.has(job.dedupeHash)) {
          seenHashes.add(job.dedupeHash);
          allJobs.push(job);
        }
      }

      // Brief pause between queries to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`[JobFetcher] Failed for query "${query}":`, err.message);
    }
  }

  return allJobs;
};

module.exports = { fetchAllChemistryJobs };

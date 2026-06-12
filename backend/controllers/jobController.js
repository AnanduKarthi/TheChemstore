const Job = require('../models/Job');
const { runDailySync } = require('../cron/dailyJobSync');

// GET /api/jobs
const getJobs = async (req, res) => {
  const {
    q,
    location,
    remote,
    source,
    employmentType,
    experienceLevel,
    chemistryField,
    skills,
    company,
    postedAfter,
    postedBefore,
    salaryMin,
    salaryMax,
    page = 1,
    limit = 20,
    sortBy = 'postedAt',
    sortOrder = 'desc',
  } = req.query;

  const filter = { isActive: true };

  if (q) {
    filter.$text = { $search: q };
  }

  if (location) {
    filter['location.formatted'] = { $regex: location, $options: 'i' };
  }

  if (remote !== undefined) {
    filter['location.remote'] = remote === 'true';
  }

  if (source) {
    filter.source = { $in: source.split(',').map((s) => s.trim()) };
  }

  if (employmentType) {
    filter.employmentType = { $in: employmentType.split(',').map((s) => s.trim()) };
  }

  if (experienceLevel) {
    filter.experienceLevel = { $in: experienceLevel.split(',').map((s) => s.trim()) };
  }

  if (chemistryField) {
    filter.chemistryField = { $in: chemistryField.split(',').map((s) => s.trim()) };
  }

  if (skills) {
    const skillList = skills.split(',').map((s) => s.trim());
    filter.skills = { $in: skillList.map((s) => new RegExp(s, 'i')) };
  }

  if (company) {
    filter.company = { $regex: company, $options: 'i' };
  }

  const postedFilter = {};
  if (postedAfter) postedFilter.$gte = new Date(postedAfter);
  if (postedBefore) postedFilter.$lte = new Date(postedBefore);
  if (Object.keys(postedFilter).length) filter.postedAt = postedFilter;

  const salaryFilter = {};
  if (salaryMin) salaryFilter['salary.min'] = { $gte: Number(salaryMin) };
  if (salaryMax) salaryFilter['salary.max'] = { $lte: Number(salaryMax) };
  Object.assign(filter, salaryFilter);

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const allowedSortFields = ['postedAt', 'createdAt', 'title', 'company', 'salary.min'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'postedAt';
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
    Job.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: jobs,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum * limitNum < total,
    },
  });
};

// GET /api/jobs/:id
const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).lean();
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  res.json({ success: true, data: job });
};

// GET /api/jobs/filters/meta  — returns distinct values for filter dropdowns
const getFilterMeta = async (req, res) => {
  const [sources, chemistryFields, experienceLevels, employmentTypes, countries] =
    await Promise.all([
      Job.distinct('source', { isActive: true }),
      Job.distinct('chemistryField', { isActive: true }),
      Job.distinct('experienceLevel', { isActive: true }),
      Job.distinct('employmentType', { isActive: true }),
      Job.distinct('location.country', { isActive: true }),
    ]);

  res.json({
    success: true,
    data: { sources, chemistryFields, experienceLevels, employmentTypes, countries },
  });
};

// POST /api/jobs/sync  — manual trigger (protected by sync secret)
const triggerSync = async (req, res) => {
  const { secret } = req.body;
  if (secret !== process.env.SYNC_SECRET) {
    return res.status(403).json({ success: false, message: 'Invalid sync secret' });
  }

  // Fire and forget; don't await so the HTTP response returns immediately
  runDailySync().catch((err) => console.error('[ManualSync]', err.message));

  res.json({ success: true, message: 'Sync started in background' });
};

module.exports = { getJobs, getJobById, getFilterMeta, triggerSync };

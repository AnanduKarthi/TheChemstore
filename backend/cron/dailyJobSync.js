const cron = require('node-cron');
const { fetchAllChemistryJobs } = require('../services/jobFetcher');
const Job = require('../models/Job');

const runDailySync = async () => {
  const start = Date.now();
  console.log('[JobSync] ── Starting daily chemistry job sync ──');

  try {
    // 1. Fetch from JSearch (LinkedIn, Indeed, Naukri, Google Jobs)
    const rawJobs = await fetchAllChemistryJobs();
    console.log(`[JobSync] Fetched ${rawJobs.length} unique raw jobs`);

    if (rawJobs.length === 0) {
      console.log('[JobSync] No jobs fetched. Done.');
      return;
    }

    // 2. Deduplicate against existing DB records
    const incomingHashes = rawJobs.map((j) => j.dedupeHash);
    const existingHashes = new Set(
      await Job.find({ dedupeHash: { $in: incomingHashes } }).distinct('dedupeHash')
    );

    if (existingHashes.size > 0) {
      await Job.updateMany(
        { dedupeHash: { $in: [...existingHashes] } },
        { $set: { lastSeenAt: new Date() } }
      );
    }

    const newJobs = rawJobs.filter((j) => !existingHashes.has(j.dedupeHash));
    console.log(`[JobSync] ${newJobs.length} new jobs after deduplication (${existingHashes.size} already known)`);

    if (newJobs.length === 0) {
      console.log('[JobSync] Nothing new to insert. Done.');
      return;
    }

    // 3. Bulk insert — ordered:false so one duplicate doesn't abort the batch
    const result = await Job.insertMany(newJobs, { ordered: false });
    console.log(`[JobSync] Inserted ${result.length} jobs in ${Date.now() - start}ms`);
  } catch (err) {
    if (err.name === 'MongoBulkWriteError') {
      console.log(`[JobSync] Inserted ${err.result?.insertedCount ?? 0} jobs (some duplicates skipped)`);
    } else {
      console.error('[JobSync] Fatal error:', err.message);
    }
  }

  // 4. Expire jobs not seen in recent syncs
  await expireStaleJobs();

  console.log(`[JobSync] ── Done in ${Date.now() - start}ms ──`);
};

const expireStaleJobs = async () => {
  const ttlDays = parseInt(process.env.JOB_TTL_DAYS || '30', 10);
  const cutoff = new Date(Date.now() - ttlDays * 24 * 60 * 60 * 1000);

  const { modifiedCount } = await Job.updateMany(
    { isActive: true, lastSeenAt: { $lt: cutoff } },
    { $set: { isActive: false } }
  );

  if (modifiedCount > 0) {
    console.log(`[JobSync] Expired ${modifiedCount} jobs not seen in the last ${ttlDays} days`);
  }
};

const initJobSyncCron = () => {
  // Default: 2:00 AM every day. Override with JOB_SYNC_CRON env var.
  const schedule = process.env.JOB_SYNC_CRON || '0 2 * * *';
  cron.schedule(schedule, runDailySync, { timezone: 'Asia/Kolkata' });
  console.log(`[JobSync] Cron scheduled: "${schedule}"`);
};

module.exports = { initJobSyncCron, runDailySync };

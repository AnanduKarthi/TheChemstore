const express = require('express');
const { query, param, body } = require('express-validator');
const router = express.Router();

const { getJobs, getJobById, getFilterMeta, triggerSync } = require('../controllers/jobController');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /jobs/filters/meta:
 *   get:
 *     tags: [Jobs]
 *     summary: Get filter dropdown values
 *     description: Returns the distinct values currently in the database for every filterable field. Use this to populate filter UI components.
 *     responses:
 *       200:
 *         description: Distinct filter values
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FilterMetaResponse'
 */
router.get('/filters/meta', getFilterMeta);

/**
 * @swagger
 * /jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: List chemistry jobs
 *     description: |
 *       Returns a paginated, filterable list of chemistry jobs fetched daily from
 *       LinkedIn, Indeed, Naukri, and Google Jobs, enriched with Gemini AI metadata.
 *
 *       **Comma-separated values** are accepted for `source`, `employmentType`,
 *       `experienceLevel`, `chemistryField`, and `skills` to allow multi-select filtering.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Full-text search across title, company, and description
 *         example: spectroscopy
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Partial match on formatted location (city, state, or country)
 *         example: Mumbai
 *       - in: query
 *         name: remote
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by remote availability
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Comma-separated job sources
 *         example: linkedin,indeed
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *         description: Comma-separated employment types
 *         example: full_time,contract
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *         description: Comma-separated experience levels (AI-classified)
 *         example: mid,senior
 *       - in: query
 *         name: chemistryField
 *         schema:
 *           type: string
 *         description: Comma-separated chemistry sub-disciplines (AI-classified)
 *         example: analytical,medicinal
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma-separated skills — matches jobs that include **any** of the listed skills
 *         example: HPLC,GC-MS,NMR
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Partial company name match (case-insensitive)
 *         example: Pfizer
 *       - in: query
 *         name: postedAfter
 *         schema:
 *           type: string
 *           format: date
 *         description: Only return jobs posted on or after this date (ISO 8601)
 *         example: "2025-01-01"
 *       - in: query
 *         name: postedBefore
 *         schema:
 *           type: string
 *           format: date
 *         description: Only return jobs posted on or before this date (ISO 8601)
 *         example: "2025-12-31"
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: number
 *         description: Minimum salary filter
 *         example: 50000
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: number
 *         description: Maximum salary filter
 *         example: 120000
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [postedAt, createdAt, title, company, salary.min]
 *           default: postedAt
 *         description: Field to sort results by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated job list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobListResponse'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1–100'),
    query('postedAfter').optional().isISO8601().withMessage('postedAfter must be ISO 8601 date'),
    query('postedBefore').optional().isISO8601().withMessage('postedBefore must be ISO 8601 date'),
    query('salaryMin').optional().isFloat({ min: 0 }).withMessage('salaryMin must be a number'),
    query('salaryMax').optional().isFloat({ min: 0 }).withMessage('salaryMax must be a number'),
    query('remote').optional().isIn(['true', 'false']).withMessage('remote must be true or false'),
    query('sortBy')
      .optional()
      .isIn(['postedAt', 'createdAt', 'title', 'company', 'salary.min'])
      .withMessage('Invalid sortBy field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
  ],
  validate,
  getJobs
);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get a single job
 *     description: Returns the full details of a chemistry job by its MongoDB ObjectId.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the job
 *         example: 664a1f2e3b7c4d0012345679
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid job ID')],
  validate,
  getJobById
);

/**
 * @swagger
 * /jobs/sync:
 *   post:
 *     tags: [Jobs]
 *     summary: Manually trigger job sync
 *     description: |
 *       Starts a full job sync cycle in the background (fetch → deduplicate → AI enrich → store).
 *       Normally this runs automatically at 2 AM IST every day.
 *       Requires the `SYNC_SECRET` environment variable value in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SyncRequest'
 *     responses:
 *       200:
 *         description: Sync started in background
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Sync started in background
 *       403:
 *         description: Invalid sync secret
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid sync secret
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/sync',
  [body('secret').notEmpty().withMessage('Sync secret required')],
  validate,
  triggerSync
);

module.exports = router;

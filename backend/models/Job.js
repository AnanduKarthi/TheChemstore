const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    externalId: { type: String },
    // SHA-256 of normalized (title + company + location) — primary dedup key
    dedupeHash: { type: String, unique: true, index: true },

    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    applyUrl: { type: String },

    source: {
      type: String,
      enum: ['linkedin', 'indeed', 'naukri', 'glassdoor', 'google_jobs', 'other'],
      index: true,
    },
    publisher: { type: String },

    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'internship', 'temporary', 'other'],
      index: true,
    },

    location: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
      remote: { type: Boolean, default: false },
      formatted: { type: String },
    },

    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String },
      period: { type: String },
    },

    postedAt: { type: Date, index: true },
    lastSeenAt: { type: Date },

    // AI-enriched fields
    chemistryField: {
      type: String,
      enum: [
        'organic', 'inorganic', 'analytical', 'physical',
        'biochemistry', 'polymer', 'medicinal', 'environmental',
        'industrial', 'food', 'materials', 'computational', 'other',
      ],
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['intern', 'entry', 'mid', 'senior', 'lead', 'manager', 'other'],
      index: true,
    },
    skills: { type: [String] },

    highlights: {
      qualifications: [String],
      responsibilities: [String],
      benefits: [String],
    },

    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Text index for full-text search across title, company, description
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ 'location.formatted': 1 });
jobSchema.index({ skills: 1 });

module.exports = mongoose.model('Job', jobSchema);

const axios = require('axios');
const logger = require('../utils/logger');
const {
  generateRemoteId,
  extractTags,
  detectJobType,
  detectExperienceLevel,
  detectRemoteLevel,
  extractSalary,
  truncateDescription,
  cleanUrl,
  parseDate
} = require('../utils/jobNormalizer');

/**
 * Fetch jobs from Adjuna API
 * Limit: 100 calls/day
 */
async function fetchJobs(config) {
  const { apiKey, baseUrl, config: apiConfig } = config;
  const jobs = [];

  try {
    logger.info('Starting Adjuna API fetch', { maxResults: apiConfig.maxResults });

    const response = await axios.get(`${baseUrl}/jobs`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      params: {
        limit: apiConfig.maxResults,
        remote: true
      },
      timeout: 10000
    });

    if (response.data && response.data.jobs) {
      const normalizedJobs = response.data.jobs.map(job => normalizeJob(job));
      jobs.push(...normalizedJobs);
      logger.info(`Fetched ${normalizedJobs.length} jobs from Adjuna`);
    }

    return jobs;

  } catch (error) {
    logger.error('Adjuna service error', {
      error: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText
    });

    // Return empty array instead of throwing to allow other APIs to continue
    return [];
  }
}

/**
 * Normalize Adjuna job data to our schema
 */
function normalizeJob(job) {
  const title = job.title || job.position || 'Untitled Position';
  const description = truncateDescription(job.description || job.details || '');
  const company = job.company_name || job.company || 'Unknown Company';
  const location = job.location || job.city || 'Remote';
  const salary = extractSalary(job.salary || job.salary_range);

  return {
    remoteId: generateRemoteId('adjuna', job.id || job.job_id),
    title,
    company,
    companyLogo: job.company_logo || job.logo || null,
    location,
    description,
    tags: extractTags(title, description),
    salary,
    jobType: job.job_type ? job.job_type.toLowerCase() : detectJobType(title, description),
    experienceLevel: detectExperienceLevel(title, description),
    applicationUrl: cleanUrl(job.url || job.apply_url || job.application_url) || '#',
    postedAt: parseDate(job.posted_at || job.created_at),
    expiresAt: parseDate(job.expires_at),
    isActive: true,
    featured: job.featured || false,
    remoteLevel: detectRemoteLevel(location, description),
    sourceApi: 'adjuna'
  };
}

module.exports = {
  fetchJobs
};

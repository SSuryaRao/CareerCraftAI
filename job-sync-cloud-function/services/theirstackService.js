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
 * Fetch jobs from TheirStack API
 * Limit: 200 job listings/month (very limited)
 */
async function fetchJobs(config) {
  const { apiKey, baseUrl, config: apiConfig } = config;
  const jobs = [];

  try {
    logger.info('Starting TheirStack API fetch', { maxResults: apiConfig.maxResults });

    const response = await axios.get(`${baseUrl}/jobs`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      params: {
        limit: apiConfig.maxResults,
        job_type: apiConfig.jobType
      },
      timeout: 10000
    });

    if (response.data && response.data.data) {
      const normalizedJobs = response.data.data.map(job => normalizeJob(job));
      jobs.push(...normalizedJobs);
      logger.info(`Fetched ${normalizedJobs.length} jobs from TheirStack`);
    }

    return jobs;

  } catch (error) {
    logger.error('TheirStack service error', {
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
 * Normalize TheirStack job data to our schema
 */
function normalizeJob(job) {
  const title = job.title || job.job_title || 'Untitled Position';
  const description = truncateDescription(job.description || job.job_description || '');
  const company = job.company?.name || job.company_name || 'Unknown Company';
  const location = job.location || job.job_location || 'Remote';
  const salary = extractSalary(job.salary || job.salary_range);

  return {
    remoteId: generateRemoteId('theirstack', job.id || job.job_id),
    title,
    company,
    companyLogo: job.company?.logo || job.company_logo || null,
    location,
    description,
    tags: extractTags(title, description),
    salary,
    jobType: job.employment_type ? job.employment_type.toLowerCase() : detectJobType(title, description),
    experienceLevel: detectExperienceLevel(title, description),
    applicationUrl: cleanUrl(job.apply_url || job.url || job.application_link) || '#',
    postedAt: parseDate(job.published_at || job.posted_at),
    expiresAt: parseDate(job.expires_at),
    isActive: true,
    featured: false,
    remoteLevel: job.is_remote ? 'fully-remote' : detectRemoteLevel(location, description),
    sourceApi: 'theirstack'
  };
}

module.exports = {
  fetchJobs
};

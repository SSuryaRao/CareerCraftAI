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
 * Fetch jobs from Indian API
 * Limit: 10 requests/month (extremely limited)
 */
async function fetchJobs(config) {
  const { apiKey, baseUrl, config: apiConfig } = config;
  const jobs = [];

  try {
    logger.info('Starting Indian API fetch', { maxResults: apiConfig.maxResults });

    const response = await axios.get(`${baseUrl}/jobs`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      params: {
        limit: apiConfig.maxResults,
        location: apiConfig.location
      },
      timeout: 10000
    });

    if (response.data && response.data.jobs) {
      const normalizedJobs = response.data.jobs.map(job => normalizeJob(job));
      jobs.push(...normalizedJobs);
      logger.info(`Fetched ${normalizedJobs.length} jobs from Indian API`);
    } else if (response.data && Array.isArray(response.data)) {
      // Handle if API returns array directly
      const normalizedJobs = response.data.map(job => normalizeJob(job));
      jobs.push(...normalizedJobs);
      logger.info(`Fetched ${normalizedJobs.length} jobs from Indian API`);
    }

    return jobs;

  } catch (error) {
    logger.error('Indian API service error', {
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
 * Normalize Indian API job data to our schema
 */
function normalizeJob(job) {
  const title = job.title || job.job_title || job.position || 'Untitled Position';
  const description = truncateDescription(job.description || job.job_description || job.details || '');
  const company = job.company || job.company_name || job.employer || 'Unknown Company';
  const location = job.location || job.city || 'India';
  const salary = extractSalary(job.salary || job.salary_range || job.ctc);

  return {
    remoteId: generateRemoteId('indianapi', job.id || job.job_id || job._id),
    title,
    company,
    companyLogo: job.company_logo || job.logo || null,
    location,
    description,
    tags: extractTags(title, description),
    salary,
    jobType: job.job_type ? job.job_type.toLowerCase().replace(/[-_]/g, '-') : detectJobType(title, description),
    experienceLevel: job.experience_level || detectExperienceLevel(title, description),
    applicationUrl: cleanUrl(job.apply_url || job.url || job.application_link || job.link) || '#',
    postedAt: parseDate(job.posted_at || job.created_at || job.date),
    expiresAt: parseDate(job.expires_at || job.expiry_date),
    isActive: job.is_active !== undefined ? job.is_active : true,
    featured: job.featured || job.is_featured || false,
    remoteLevel: job.is_remote || job.remote ? 'fully-remote' : detectRemoteLevel(location, description),
    sourceApi: 'indianapi'
  };
}

module.exports = {
  fetchJobs
};

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
 * Fetch jobs from SerpAPI (Google Jobs)
 * Limit: 100 searches/month
 */
async function fetchJobs(config) {
  const { apiKey, baseUrl, config: apiConfig } = config;
  const jobs = [];

  try {
    logger.info('Starting SerpAPI fetch', { maxResults: apiConfig.maxResults });

    // SerpAPI supports multiple search queries
    for (const query of apiConfig.queries) {
      try {
        const response = await axios.get(baseUrl, {
          params: {
            api_key: apiKey,
            engine: apiConfig.engine,
            q: query,
            num: apiConfig.maxResults
          },
          timeout: 10000
        });

        if (response.data && response.data.jobs_results) {
          const normalizedJobs = response.data.jobs_results.map(job => normalizeJob(job, query));
          jobs.push(...normalizedJobs);
          logger.info(`Fetched ${normalizedJobs.length} jobs from SerpAPI`, { query });
        }

        // Rate limiting: wait 2 seconds between queries
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        logger.error(`SerpAPI error for query: ${query}`, {
          error: error.message
        });
      }
    }

    logger.info(`Total jobs fetched from SerpAPI: ${jobs.length}`);
    return jobs;

  } catch (error) {
    logger.error('SerpAPI service error', {
      error: error.message,
      code: error.code,
      status: error.response?.status
    });
    // Return jobs collected so far instead of throwing
    return jobs;
  }
}

/**
 * Normalize SerpAPI job data to our schema
 */
function normalizeJob(job, query) {
  const title = job.title || 'Untitled Position';
  const description = truncateDescription(job.description || job.snippet || '');
  const company = job.company_name || 'Unknown Company';
  const location = job.location || 'Remote';
  const salary = extractSalary(job.detected_extensions?.salary);

  // Generate unique ID from job link or title + company
  const jobId = job.job_id || `${title}-${company}`.replace(/\s+/g, '-');

  return {
    remoteId: generateRemoteId('serpapi', jobId),
    title,
    company,
    companyLogo: job.thumbnail || null,
    location,
    description,
    tags: extractTags(title, description),
    salary,
    jobType: detectJobType(title, description),
    experienceLevel: detectExperienceLevel(title, description),
    applicationUrl: cleanUrl(job.apply_options?.[0]?.link || job.share_link) || '#',
    postedAt: parseDate(job.detected_extensions?.posted_at || job.posted_at),
    expiresAt: null,
    isActive: true,
    featured: false,
    remoteLevel: detectRemoteLevel(location, description),
    sourceApi: 'serpapi'
  };
}

module.exports = {
  fetchJobs
};

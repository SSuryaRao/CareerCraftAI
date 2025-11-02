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
 * Fetch jobs from Jooble API
 * Limit: 500,000 requests/month (very generous)
 */
async function fetchJobs(config) {
  const { apiKey, baseUrl, config: apiConfig } = config;
  const jobs = [];

  try {
    logger.info('Starting Jooble API fetch', { maxResults: apiConfig.maxResults });

    // Jooble API requires POST request with parameters
    for (const keyword of apiConfig.keywords) {
      for (const location of apiConfig.locations) {
        try {
          const response = await axios.post(
            `${baseUrl}/${apiKey}`,
            {
              keywords: keyword,
              location: location,
              page: 1
            },
            {
              headers: {
                'Content-Type': 'application/json'
              },
              timeout: 10000
            }
          );

          if (response.data && response.data.jobs) {
            const normalizedJobs = response.data.jobs.slice(0, apiConfig.maxResults).map(job =>
              normalizeJob(job)
            );
            jobs.push(...normalizedJobs);
            logger.info(`Fetched ${normalizedJobs.length} jobs from Jooble`, { keyword, location });
          }

          // Rate limiting: wait 1 second between requests
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          logger.error(`Jooble API error for ${keyword} in ${location}`, {
            error: error.message
          });
        }
      }
    }

    logger.info(`Total jobs fetched from Jooble: ${jobs.length}`);
    return jobs;

  } catch (error) {
    logger.error('Jooble service error', { error: error.message, stack: error.stack });
    // Return jobs collected so far instead of throwing
    return jobs;
  }
}

/**
 * Normalize Jooble job data to our schema
 */
function normalizeJob(job) {
  const title = job.title || 'Untitled Position';
  const description = truncateDescription(job.snippet || job.description || '');
  const company = job.company || 'Unknown Company';
  const location = job.location || 'Remote';
  const salary = extractSalary(job.salary);

  return {
    remoteId: generateRemoteId('jooble', job.id || job.link),
    title,
    company,
    companyLogo: job.companyLogo || null,
    location,
    description,
    tags: extractTags(title, description),
    salary,
    jobType: detectJobType(title, description),
    experienceLevel: detectExperienceLevel(title, description),
    applicationUrl: cleanUrl(job.link) || '#',
    postedAt: parseDate(job.updated),
    expiresAt: null,
    isActive: true,
    featured: false,
    remoteLevel: detectRemoteLevel(location, description),
    sourceApi: 'jooble'
  };
}

module.exports = {
  fetchJobs
};

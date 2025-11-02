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
 * Fetch jobs from Adzuna API
 * Limit: 100 calls/day on free tier
 *
 * API Documentation: https://developer.adzuna.com/
 * Endpoint: https://api.adzuna.com/v1/api/jobs/{country}/search/1
 */
async function fetchJobs(config) {
  const { appId, apiKey, baseUrl, config: apiConfig } = config;
  const jobs = [];

  try {
    logger.info('Starting Adzuna API fetch', { maxResults: apiConfig.maxResults });

    // Adzuna requires both app_id and app_key
    if (!appId || !apiKey) {
      logger.error('Adzuna API credentials missing', { hasAppId: !!appId, hasApiKey: !!apiKey });
      return [];
    }

    // Fetch jobs for each country and query combination
    for (const country of apiConfig.countries) {
      for (const query of apiConfig.queries) {
        try {
          // Adzuna URL format: /v1/api/jobs/{country}/search/1
          const url = `${baseUrl}/${country}/search/1`;

          const response = await axios.get(url, {
            params: {
              app_id: appId,
              app_key: apiKey,
              what: query,
              results_per_page: Math.min(apiConfig.maxResults, 50) // Adzuna max is 50 per page
            },
            timeout: 10000
          });

          if (response.data && response.data.results) {
            const normalizedJobs = response.data.results.map(job =>
              normalizeJob(job, country)
            );
            jobs.push(...normalizedJobs);
            logger.info(`Fetched ${normalizedJobs.length} jobs from Adzuna`, {
              country,
              query,
              totalAvailable: response.data.count
            });
          }

          // Rate limiting: wait 1.5 seconds between requests to stay under limits
          await new Promise(resolve => setTimeout(resolve, 1500));

        } catch (error) {
          logger.error(`Adzuna API error for ${query} in ${country}`, {
            error: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText
          });
        }
      }
    }

    logger.info(`Total jobs fetched from Adzuna: ${jobs.length}`);
    return jobs;

  } catch (error) {
    logger.error('Adzuna service error', {
      error: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText
    });

    // Return jobs collected so far instead of throwing
    return jobs;
  }
}

/**
 * Normalize Adzuna job data to our schema
 */
function normalizeJob(job, country) {
  const title = job.title || 'Untitled Position';
  const description = truncateDescription(job.description || '');
  const company = job.company?.display_name || 'Unknown Company';

  // Adzuna location object
  const locationParts = [];
  if (job.location?.area) locationParts.push(...job.location.area);
  if (job.location?.display_name) locationParts.push(job.location.display_name);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Remote';

  // Adzuna salary is in min/max format
  const salary = {
    min: job.salary_min || null,
    max: job.salary_max || null,
    currency: 'USD' // Varies by country
  };

  // Map country codes to currency
  const currencyMap = {
    'us': 'USD',
    'gb': 'GBP',
    'in': 'INR',
    'ca': 'CAD',
    'au': 'AUD'
  };
  salary.currency = currencyMap[country] || 'USD';

  return {
    remoteId: generateRemoteId('adzuna', job.id),
    title,
    company,
    companyLogo: null, // Adzuna doesn't provide company logos in free tier
    location,
    description,
    tags: extractTags(title, description),
    salary,
    jobType: job.contract_type || job.contract_time || detectJobType(title, description),
    experienceLevel: detectExperienceLevel(title, description),
    applicationUrl: cleanUrl(job.redirect_url) || '#',
    postedAt: parseDate(job.created),
    expiresAt: null,
    isActive: true,
    featured: false,
    remoteLevel: detectRemoteLevel(location, description),
    sourceApi: 'adzuna'
  };
}

module.exports = {
  fetchJobs
};

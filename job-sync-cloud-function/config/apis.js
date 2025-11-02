/**
 * API Configuration and Limits
 * All timings are designed to stay within free tier limits
 */

module.exports = {
  // Jooble - 500,000 requests/month
  // Strategy: Run every 6 hours = 4x/day = 120/month
  jooble: {
    name: 'Jooble',
    apiKey: process.env.JOOBLE_API_KEY,
    baseUrl: 'https://jooble.org/api',
    enabled: true,
    limits: {
      perMonth: 500000,
      perDay: 16666,
      perHour: 694
    },
    schedule: {
      frequency: 'every 6 hours',
      cron: '0 */6 * * *',  // Every 6 hours
      times: ['00:00', '06:00', '12:00', '18:00']
    },
    config: {
      maxResults: 100,
      keywords: ['software engineer', 'developer', 'data scientist', 'product manager'],
      locations: ['United States', 'Remote', 'India', 'United Kingdom']
    }
  },

  // Adzuna - 100 calls/day on free tier
  // Strategy: Run every 8 hours = 3x/day = 90/month
  adzuna: {
    name: 'Adzuna',
    appId: process.env.ADZUNA_APP_ID,
    apiKey: process.env.ADZUNA_API_KEY,
    baseUrl: 'https://api.adzuna.com/v1/api/jobs',
    enabled: true,
    limits: {
      perMonth: 3000,
      perDay: 100,
      perHour: 4
    },
    schedule: {
      frequency: 'every 8 hours',
      cron: '0 0,8,16 * * *',  // 00:00, 08:00, 16:00
      times: ['00:00', '08:00', '16:00']
    },
    config: {
      maxResults: 50,
      countries: ['us', 'gb', 'in'],  // US, UK, India
      queries: ['software engineer', 'developer', 'data scientist']
    }
  },

  // TheirStack - 200 job listings/month
  // Strategy: Run once per day = 30/month
  // NOTE: API endpoint returns 404 - needs verification
  theirstack: {
    name: 'TheirStack',
    apiKey: process.env.THEIRSTACK_API_KEY,
    baseUrl: 'https://api.theirstack.com/v1',
    enabled: false,  // Disabled: endpoint returns 404
    limits: {
      perMonth: 200,
      perDay: 6.6,
      perHour: 0.27
    },
    schedule: {
      frequency: 'once per day',
      cron: '0 1 * * *',  // Daily at 1:00 AM
      times: ['01:00']
    },
    config: {
      maxResults: 6,
      jobType: 'tech'
    }
  },

  // SerpAPI - 100 searches/month
  // Strategy: Run every 3 days = 10/month
  serpapi: {
    name: 'SerpAPI',
    apiKey: process.env.SERPAPI_KEY,
    baseUrl: 'https://serpapi.com/search',
    enabled: true,
    limits: {
      perMonth: 100,
      perDay: 3.3,
      perHour: 0.14
    },
    schedule: {
      frequency: 'every 3 days',
      cron: '0 2 */3 * *',  // Every 3 days at 2:00 AM
      times: ['02:00 every 3rd day']
    },
    config: {
      maxResults: 10,
      engine: 'google_jobs',
      queries: ['software engineer jobs', 'remote developer jobs']
    }
  },

  // Indian API - 10 requests/month
  // Strategy: Run once every 3 days = 10/month
  // NOTE: Returns 400 Bad Request - authentication or endpoint issue
  indianApi: {
    name: 'Indian API',
    apiKey: process.env.INDIAN_API_KEY,
    baseUrl: 'https://jobs.indianapi.in',
    enabled: false,  // Disabled: returns 400 Bad Request
    limits: {
      perMonth: 10,
      perDay: 0.33,
      perHour: 0.014
    },
    schedule: {
      frequency: 'every 3 days',
      cron: '0 3 */3 * *',  // Every 3 days at 3:00 AM
      times: ['03:00 every 3rd day']
    },
    config: {
      maxResults: 10,
      location: 'India'
    }
  }
};

/**
 * Get API config by name
 */
function getApiConfig(apiName) {
  return module.exports[apiName];
}

/**
 * Get all enabled APIs
 */
function getEnabledApis() {
  return Object.entries(module.exports)
    .filter(([key, value]) => typeof value === 'object' && value.enabled)
    .map(([key, value]) => ({ key, ...value }));
}

/**
 * Check if API should run at current hour
 */
function shouldRunApi(apiName, currentHour = new Date().getHours()) {
  const config = getApiConfig(apiName);
  if (!config || !config.enabled) return false;

  return config.schedule.times.some(time => {
    const hour = parseInt(time.split(':')[0]);
    return hour === currentHour;
  });
}

module.exports.getApiConfig = getApiConfig;
module.exports.getEnabledApis = getEnabledApis;
module.exports.shouldRunApi = shouldRunApi;

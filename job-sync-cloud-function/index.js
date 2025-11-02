/**
 * Google Cloud Function - Job Sync Service
 *
 * This function fetches jobs from multiple APIs and syncs them to MongoDB.
 * It's designed to be triggered by Cloud Scheduler at different intervals
 * to respect free tier API limits.
 *
 * Trigger Types:
 * - HTTP (for manual triggers and testing)
 * - Cloud Scheduler (for automated scheduled runs)
 */

const mongoose = require('mongoose');
const logger = require('./utils/logger');
const apiConfig = require('./config/apis');
const Job = require('./models/Job');

// Import all API services
const joobleService = require('./services/joobleService');
const adzunaService = require('./services/adzunaService');
const theirstackService = require('./services/theirstackService');
const serpapiService = require('./services/serpapiService');
const indianApiService = require('./services/indianApiService');

// Service map for easy access
const services = {
  jooble: joobleService,
  adzuna: adzunaService,
  theirstack: theirstackService,
  serpapi: serpapiService,
  indianApi: indianApiService
};

// MongoDB connection state
let isConnected = false;

/**
 * Connect to MongoDB
 */
async function connectToDatabase() {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Process jobs from a specific API
 */
async function processApi(apiName, force = false) {
  const config = apiConfig.getApiConfig(apiName);

  if (!config) {
    logger.warn(`API ${apiName} not found in configuration`);
    return { api: apiName, status: 'skipped', reason: 'not found' };
  }

  if (!config.enabled) {
    logger.info(`API ${apiName} is disabled`);
    return { api: apiName, status: 'skipped', reason: 'disabled' };
  }

  // Check if API should run at this time (unless forced)
  if (!force) {
    const currentHour = new Date().getHours();
    const shouldRun = apiConfig.shouldRunApi(apiName, currentHour);

    if (!shouldRun) {
      logger.info(`API ${apiName} not scheduled for current hour (${currentHour}:00)`);
      return { api: apiName, status: 'skipped', reason: 'not scheduled' };
    }
  }

  try {
    logger.info(`Starting job sync for ${config.name}...`);
    const startTime = Date.now();

    // Fetch jobs from the API service
    const service = services[apiName];
    if (!service) {
      throw new Error(`Service implementation not found for ${apiName}`);
    }

    const jobs = await service.fetchJobs(config);
    logger.info(`Fetched ${jobs.length} jobs from ${config.name}`);

    // Save jobs to database
    let newCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const jobData of jobs) {
      try {
        const result = await Job.findOneAndUpdate(
          { remoteId: jobData.remoteId },
          {
            $set: {
              ...jobData,
              lastSynced: new Date()
            }
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );

        // Check if this was an insert (new) or update
        if (result.createdAt &&
            new Date() - new Date(result.createdAt) < 1000) {
          newCount++;
        } else {
          updatedCount++;
        }
      } catch (error) {
        logger.error(`Error saving job ${jobData.remoteId}:`, error.message);
        errorCount++;
      }
    }

    const duration = Date.now() - startTime;
    logger.info(`Completed ${config.name} sync in ${duration}ms: ${newCount} new, ${updatedCount} updated, ${errorCount} errors`);

    return {
      api: apiName,
      status: 'success',
      stats: {
        fetched: jobs.length,
        new: newCount,
        updated: updatedCount,
        errors: errorCount,
        duration
      }
    };

  } catch (error) {
    logger.error(`Error processing ${apiName}:`, error);
    return {
      api: apiName,
      status: 'error',
      error: error.message
    };
  }
}

/**
 * Main Cloud Function entry point
 *
 * Request body options:
 * - api: specific API to run (optional)
 * - force: ignore schedule checks (optional, default: false)
 * - all: run all enabled APIs (optional, default: false)
 */
exports.syncJobs = async (req, res) => {
  const startTime = Date.now();

  try {
    // Parse request parameters
    const { api, force = false, all = false } = req.query || {};

    logger.info('Job sync triggered', { api, force, all });

    // Connect to database
    await connectToDatabase();

    const results = [];

    if (api) {
      // Run specific API
      logger.info(`Running specific API: ${api}`);
      const result = await processApi(api, force);
      results.push(result);
    } else if (all) {
      // Run all enabled APIs
      logger.info('Running all enabled APIs');
      const enabledApis = apiConfig.getEnabledApis();

      for (const apiObj of enabledApis) {
        const result = await processApi(apiObj.key, force);
        results.push(result);
      }
    } else {
      // Run APIs scheduled for current hour
      logger.info('Running scheduled APIs for current hour');
      const currentHour = new Date().getHours();
      const enabledApis = apiConfig.getEnabledApis();

      for (const apiObj of enabledApis) {
        if (apiConfig.shouldRunApi(apiObj.key, currentHour)) {
          const result = await processApi(apiObj.key, false);
          results.push(result);
        }
      }

      if (results.length === 0) {
        logger.info('No APIs scheduled for current hour');
      }
    }

    const duration = Date.now() - startTime;
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      duration,
      results
    };

    logger.info(`Job sync completed in ${duration}ms`, { results });
    res.status(200).json(response);

  } catch (error) {
    logger.error('Fatal error in job sync:', { error: error.message, stack: error.stack });

    const duration = Date.now() - startTime;
    const response = {
      success: false,
      timestamp: new Date().toISOString(),
      duration,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    res.status(500).json(response);
  }
};

/**
 * Health check endpoint
 */
exports.healthCheck = async (req, res) => {
  try {
    await connectToDatabase();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mongodb: isConnected ? 'connected' : 'disconnected',
      apis: apiConfig.getEnabledApis().map(api => ({
        name: api.name,
        enabled: api.enabled
      }))
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};

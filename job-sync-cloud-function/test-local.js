/**
 * Local Testing Script
 *
 * This script allows you to test the Cloud Function locally
 * before deploying to Google Cloud.
 *
 * Usage:
 *   node test-local.js [api-name]
 *
 * Examples:
 *   node test-local.js              # Run scheduled APIs for current hour
 *   node test-local.js jooble       # Test Jooble API only
 *   node test-local.js all          # Test all APIs
 */

require('dotenv').config();
const { syncJobs } = require('./index');

// Mock Express request and response objects
class MockRequest {
  constructor(query = {}) {
    this.query = query;
    this.body = {};
    this.headers = {};
  }
}

class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.data = null;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  json(data) {
    this.data = data;
    console.log('\n========================================');
    console.log('RESPONSE');
    console.log('========================================');
    console.log(`Status: ${this.statusCode}`);
    console.log(JSON.stringify(data, null, 2));
    console.log('========================================\n');
    return this;
  }
}

async function test() {
  const args = process.argv.slice(2);
  const apiArg = args[0];

  console.log('========================================');
  console.log('Local Job Sync Test');
  console.log('========================================\n');

  let query = {};

  if (apiArg === 'all') {
    console.log('Testing: ALL APIs (forced)\n');
    query = { all: 'true', force: 'true' };
  } else if (apiArg) {
    console.log(`Testing: ${apiArg} API (forced)\n`);
    query = { api: apiArg, force: 'true' };
  } else {
    console.log('Testing: Scheduled APIs for current hour\n');
    console.log(`Current hour: ${new Date().getHours()}:00\n`);
  }

  // Check environment variables
  console.log('Environment Check:');
  console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? '✓ Set' : '✗ Not set'}`);
  console.log(`- JOOBLE_API_KEY: ${process.env.JOOBLE_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`- ADZUNA_APP_ID: ${process.env.ADZUNA_APP_ID ? '✓ Set' : '✗ Not set'}`);
  console.log(`- ADZUNA_API_KEY: ${process.env.ADZUNA_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`- THEIRSTACK_API_KEY: ${process.env.THEIRSTACK_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`- SERPAPI_KEY: ${process.env.SERPAPI_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`- INDIAN_API_KEY: ${process.env.INDIAN_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log('');

  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI not set. Create a .env file with your MongoDB connection string.');
    process.exit(1);
  }

  try {
    const req = new MockRequest(query);
    const res = new MockResponse();

    console.log('Starting job sync...\n');
    await syncJobs(req, res);

    if (res.data && res.data.success) {
      console.log('✓ Job sync completed successfully!');

      // Print summary
      const results = res.data.results || [];
      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      const skippedCount = results.filter(r => r.status === 'skipped').length;

      console.log('\nSummary:');
      console.log(`  Total APIs processed: ${results.length}`);
      console.log(`  Success: ${successCount}`);
      console.log(`  Errors: ${errorCount}`);
      console.log(`  Skipped: ${skippedCount}`);
      console.log(`  Duration: ${res.data.duration}ms`);

      // Print details for each API
      results.forEach(result => {
        console.log(`\n  ${result.api}:`);
        console.log(`    Status: ${result.status}`);
        if (result.stats) {
          console.log(`    Fetched: ${result.stats.fetched}`);
          console.log(`    New: ${result.stats.new}`);
          console.log(`    Updated: ${result.stats.updated}`);
          console.log(`    Errors: ${result.stats.errors}`);
          console.log(`    Duration: ${result.stats.duration}ms`);
        }
        if (result.reason) {
          console.log(`    Reason: ${result.reason}`);
        }
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        }
      });

      process.exit(0);
    } else {
      console.error('✗ Job sync failed!');
      console.error(res.data);
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Fatal error during test:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
test();

# Career Advisor - Job Sync Cloud Function

A Google Cloud Function that automatically syncs job listings from multiple job APIs to your MongoDB database. Designed to respect free tier API limits through intelligent scheduling.

## Features

- **Multi-API Support**: Integrates with 5 job APIs (Jooble, Adjuna, TheirStack, SerpAPI, Indian API)
- **Smart Scheduling**: Automatically schedules API calls to stay within free tier limits
- **Automatic Deduplication**: Prevents duplicate job listings using unique remote IDs
- **Comprehensive Job Data**: Extracts and normalizes job titles, descriptions, locations, salaries, and more
- **Cloud-Native**: Runs on Google Cloud Functions with Cloud Scheduler
- **Easy Deployment**: Simple deployment scripts for both Windows and Unix systems

## API Limits & Schedule

| API | Free Tier Limit | Schedule | Requests/Month |
|-----|----------------|----------|----------------|
| Jooble | 500,000/month | Every 6 hours (4x/day) | ~120 |
| Adjuna | 100/day | Every 8 hours (3x/day) | ~90 |
| TheirStack | 200/month | Daily at 1 AM | ~30 |
| SerpAPI | 100/month | Every 3 days at 2 AM | ~10 |
| Indian API | 10/month | Every 3 days at 3 AM | ~10 |

## Architecture

```
┌─────────────────────┐
│  Cloud Scheduler    │  (Triggers at scheduled times)
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Cloud Function     │  (Fetches jobs from APIs)
│  (syncJobs)         │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  MongoDB Atlas      │  (Stores job listings)
└─────────────────────┘
```

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud SDK** (gcloud CLI) installed
3. **Node.js 18+** installed
4. **MongoDB Atlas** account and connection string
5. **API Keys** for all job APIs

## Setup Instructions

### 1. Clone and Configure

```bash
cd job-sync-cloud-function

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Also create .env.yaml for Google Cloud deployment
cp .env.example .env.yaml
```

### 2. Configure Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Test Locally (Optional but Recommended)

```bash
# Create .env file with your credentials first
node test-local.js jooble    # Test Jooble API
node test-local.js all       # Test all APIs
```

### 5. Deploy to Google Cloud

**On Unix/Linux/Mac:**
```bash
chmod +x deploy.sh setup-schedulers.sh
./deploy.sh
```

**On Windows:**
```cmd
deploy.bat
```

### 6. Set Up Cloud Scheduler

**On Unix/Linux/Mac:**
```bash
./setup-schedulers.sh
```

**On Windows:**
```cmd
setup-schedulers.bat
```

## Usage

### Manual Triggers

You can manually trigger the function via HTTP:

```bash
# Get the function URL
gcloud functions describe syncJobs --region=us-central1 --format='value(serviceConfig.uri)'

# Trigger specific API
curl -X POST "FUNCTION_URL?api=jooble&force=true"

# Trigger all APIs
curl -X POST "FUNCTION_URL?all=true&force=true"

# Let it run scheduled APIs for current hour
curl -X POST "FUNCTION_URL"
```

### Cloud Scheduler Management

```bash
# List all scheduled jobs
gcloud scheduler jobs list --location=us-central1

# Manually run a scheduled job
gcloud scheduler jobs run job-sync-jooble --location=us-central1

# Pause a scheduled job
gcloud scheduler jobs pause job-sync-jooble --location=us-central1

# Resume a scheduled job
gcloud scheduler jobs resume job-sync-jooble --location=us-central1

# View job details
gcloud scheduler jobs describe job-sync-jooble --location=us-central1
```

### Monitoring

```bash
# View function logs
gcloud functions logs read syncJobs --region=us-central1 --limit=50

# Follow logs in real-time
gcloud functions logs read syncJobs --region=us-central1 --limit=50 --follow

# View Cloud Scheduler execution logs
gcloud logging read "resource.type=cloud_scheduler_job" --limit=50
```

## Project Structure

```
job-sync-cloud-function/
├── index.js                    # Main Cloud Function entry point
├── package.json                # Dependencies and scripts
├── .env.example                # Environment variables template
├── .env.yaml                   # Google Cloud environment config
├── config/
│   └── apis.js                 # API configuration and schedules
├── models/
│   └── Job.js                  # MongoDB job schema
├── services/
│   ├── joobleService.js        # Jooble API integration
│   ├── adjunaService.js        # Adjuna API integration
│   ├── theirstackService.js    # TheirStack API integration
│   ├── serpapiService.js       # SerpAPI integration
│   └── indianApiService.js     # Indian API integration
├── utils/
│   ├── jobNormalizer.js        # Job data normalization utilities
│   └── logger.js               # Logging utilities
├── deploy.sh                   # Unix deployment script
├── deploy.bat                  # Windows deployment script
├── setup-schedulers.sh         # Unix scheduler setup
├── setup-schedulers.bat        # Windows scheduler setup
├── test-local.js               # Local testing script
└── README.md                   # This file
```

## API Response Format

Each API returns jobs in a normalized format:

```javascript
{
  remoteId: "unique-id-from-api",
  source: "jooble",
  title: "Software Engineer",
  description: "Full job description...",
  company: "Company Name",
  location: {
    city: "San Francisco",
    state: "CA",
    country: "USA",
    remote: true
  },
  salary: {
    min: 100000,
    max: 150000,
    currency: "USD"
  },
  type: "full-time",
  experienceLevel: "mid",
  skills: ["JavaScript", "React", "Node.js"],
  postedDate: "2025-01-15T00:00:00Z",
  expiresDate: "2025-02-15T00:00:00Z",
  applyUrl: "https://..."
}
```

## Cost Estimation

**Google Cloud Functions:**
- Free tier: 2 million invocations/month
- Our usage: ~260 invocations/month
- **Cost: $0/month** (within free tier)

**Cloud Scheduler:**
- Free tier: 3 jobs
- Our usage: 6 jobs
- **Cost: ~$0.30/month** ($0.10 per job after free tier)

**Total estimated cost: ~$0.30/month**

## Troubleshooting

### Function not deploying

```bash
# Check if APIs are enabled
gcloud services list --enabled

# Check function logs
gcloud functions logs read syncJobs --region=us-central1 --limit=50
```

### MongoDB connection issues

- Verify your MongoDB URI in `.env.yaml`
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Cloud Functions)
- Verify database user has read/write permissions

### API rate limits exceeded

- Check the API configuration in `config/apis.js`
- Review Cloud Scheduler execution logs
- Adjust schedules if needed

### Scheduler jobs not running

```bash
# Check if App Engine app exists (required for Cloud Scheduler)
gcloud app describe

# If not, create it
gcloud app create --region=us-central

# Verify scheduler jobs are enabled
gcloud scheduler jobs list --location=us-central1
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JOOBLE_API_KEY` | Jooble API key | Yes |
| `ADJUNA_API_KEY` | Adjuna API key | Yes |
| `THEIRSTACK_API_KEY` | TheirStack API key | Yes |
| `SERPAPI_KEY` | SerpAPI key | Yes |
| `INDIAN_API_KEY` | Indian API key | Yes |
| `NODE_ENV` | Environment (production/development) | No |

## Security Best Practices

1. **Never commit** `.env`, `.env.yaml`, or any file containing API keys
2. Use **Secret Manager** for sensitive credentials in production
3. Enable **Cloud Functions IAM** for authenticated-only access
4. Regularly **rotate API keys**
5. Monitor for **unusual API usage**

## Contributing

When adding new APIs:

1. Create a new service file in `services/`
2. Add API configuration to `config/apis.js`
3. Update the scheduler setup scripts
4. Test locally before deploying
5. Update this README

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Google Cloud Functions logs
3. Check API provider documentation
4. Review MongoDB connection settings

## License

MIT License - See LICENSE file for details

## Changelog

### Version 1.0.0 (2025-01-17)
- Initial release
- Support for 5 job APIs
- Automatic scheduling with Cloud Scheduler
- MongoDB integration
- Comprehensive error handling and logging

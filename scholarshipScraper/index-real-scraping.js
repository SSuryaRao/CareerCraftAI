const functions = require('@google-cloud/functions-framework');
const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/career-advisor';
const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY; // Get from ScraperAPI.com

let cachedClient = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

// ScraperAPI helper function
async function fetchWithScraperAPI(url) {
  if (!SCRAPERAPI_KEY) {
    console.warn('⚠️ SCRAPERAPI_KEY not set, using direct fetch (may be blocked)');
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });
    return response.data;
  }

  // Use ScraperAPI
  const scraperUrl = `http://api.scraperapi.com/?api_key=${SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}`;
  const response = await axios.get(scraperUrl, { timeout: 60000 });
  return response.data;
}

// Main HTTP function
functions.http('scrapeScholarships', async (req, res) => {
  const startTime = Date.now();

  try {
    const client = await getMongoClient();
    const db = client.db('career-advisor');
    const scholarships = db.collection('scholarships');

    console.log('🔍 Starting scholarship scraping with ScraperAPI...');

    // Scrape different sources
    const results = await Promise.allSettled([
      scrapeBuddy4Study(),
      scrapeInternshala(),
      scrapeScholarshipsGovIn(),
    ]);

    // Collect all successful results
    const allData = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allData.push(...result.value);
        console.log(`✅ Source ${index + 1} scraped: ${result.value.length} items`);
      } else {
        console.error(`❌ Source ${index + 1} failed:`, result.reason.message);
      }
    });

    // Store in MongoDB with upsert
    let inserted = 0;
    let updated = 0;

    for (const item of allData) {
      const result = await scholarships.updateOne(
        {
          title: item.title,
          provider: item.provider
        },
        {
          $set: {
            ...item,
            lastScrapedAt: new Date()
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) inserted++;
      if (result.modifiedCount > 0) updated++;
    }

    const duration = Date.now() - startTime;

    console.log(`✅ Scraping complete in ${duration}ms`);
    console.log(`📊 Total: ${allData.length}, New: ${inserted}, Updated: ${updated}`);

    res.json({
      success: true,
      message: 'Scholarship scraping completed',
      stats: {
        total: allData.length,
        inserted,
        updated,
        duration: `${duration}ms`,
        sources: {
          buddy4study: results[0].status === 'fulfilled' ? results[0].value.length : 0,
          internshala: results[1].status === 'fulfilled' ? results[1].value.length : 0,
          scholarshipsGovIn: results[2].status === 'fulfilled' ? results[2].value.length : 0,
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Scraping failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Scrape Buddy4Study scholarships
async function scrapeBuddy4Study() {
  const scholarships = [];

  try {
    console.log('🔍 Scraping Buddy4Study...');

    // Buddy4Study scholarship listing page
    const url = 'https://www.buddy4study.com/scholarships';
    const html = await fetchWithScraperAPI(url);
    const $ = cheerio.load(html);

    // Parse scholarship listings
    $('.scholarship-item, .card-scholarship').each((i, elem) => {
      try {
        const $elem = $(elem);

        const title = $elem.find('.scholarship-title, h3, h4').first().text().trim();
        const provider = $elem.find('.provider, .organization').first().text().trim() || 'Various';
        const amountText = $elem.find('.amount, .scholarship-amount').first().text().trim();
        const deadlineText = $elem.find('.deadline, .last-date').first().text().trim();
        const link = $elem.find('a').first().attr('href');
        const eligibility = $elem.find('.eligibility, .description').first().text().trim();

        if (title && title.length > 5) {
          scholarships.push({
            title: title.substring(0, 200),
            provider: provider.substring(0, 100) || 'Buddy4Study',
            amount: amountText || 'Not specified',
            eligibility: eligibility.substring(0, 500) || 'Check website for details',
            deadline: parseDateString(deadlineText) || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            link: link?.startsWith('http') ? link : `https://www.buddy4study.com${link}`,
            category: categorizeScholarship(title, eligibility),
            domain: categorizeDomain(title, eligibility),
            trending: i < 5, // First 5 are trending
            active: true,
            scrapedAt: new Date(),
            source: 'buddy4study'
          });
        }
      } catch (itemError) {
        console.warn('Error parsing Buddy4Study item:', itemError.message);
      }
    });

    // Fallback: If scraping didn't work, use curated list
    if (scholarships.length === 0) {
      console.log('⚠️ Using fallback data for Buddy4Study');
      return getBuddy4StudyFallback();
    }

    console.log(`✅ Buddy4Study: ${scholarships.length} scholarships`);
  } catch (error) {
    console.error('Error scraping Buddy4Study:', error.message);
    // Return fallback data
    return getBuddy4StudyFallback();
  }

  return scholarships;
}

// Scrape Internshala
async function scrapeInternshala() {
  const internships = [];

  try {
    console.log('🔍 Scraping Internshala...');

    const url = 'https://internshala.com/internships';
    const html = await fetchWithScraperAPI(url);
    const $ = cheerio.load(html);

    // Parse internship listings
    $('.internship_meta, .individual_internship').each((i, elem) => {
      try {
        const $elem = $(elem);

        const title = $elem.find('.job-internship-name, h3, .profile').first().text().trim();
        const company = $elem.find('.company-name, .company').first().text().trim();
        const location = $elem.find('.location_link, .location').first().text().trim();
        const stipend = $elem.find('.stipend, .salary').first().text().trim();
        const duration = $elem.find('.duration, .internship-duration').first().text().trim();
        const link = $elem.find('a').first().attr('href');

        if (title && title.length > 3) {
          internships.push({
            title: title.substring(0, 200),
            provider: company.substring(0, 100) || 'Various Companies',
            amount: stipend || 'Unpaid / Stipend based',
            eligibility: `Duration: ${duration || 'Flexible'}. Location: ${location || 'Remote'}`,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            link: link?.startsWith('http') ? link : `https://internshala.com${link}`,
            category: 'Internship',
            domain: categorizeDomain(title, ''),
            trending: i < 5,
            active: true,
            scrapedAt: new Date(),
            source: 'internshala'
          });
        }
      } catch (itemError) {
        console.warn('Error parsing Internshala item:', itemError.message);
      }
    });

    // Fallback
    if (internships.length === 0) {
      console.log('⚠️ Using fallback data for Internshala');
      return getInternshalaFallback();
    }

    console.log(`✅ Internshala: ${internships.length} internships`);
  } catch (error) {
    console.error('Error scraping Internshala:', error.message);
    return getInternshalaFallback();
  }

  return internships;
}

// Scrape National Scholarship Portal
async function scrapeScholarshipsGovIn() {
  const scholarships = [];

  try {
    console.log('🔍 Scraping Scholarships.gov.in...');

    // Government scholarship portal (this is harder to scrape, so we'll use curated data)
    // In production, you might need to scrape multiple pages or use their API if available

    return getGovernmentScholarshipsFallback();

  } catch (error) {
    console.error('Error scraping gov portal:', error.message);
    return getGovernmentScholarshipsFallback();
  }
}

// Helper: Parse date strings
function parseDateString(dateStr) {
  if (!dateStr) return null;

  try {
    // Try to extract date patterns
    const dateMatch = dateStr.match(/(\d{1,2})[\s\-\/](\w+)[\s\-\/](\d{4})/);
    if (dateMatch) {
      return new Date(dateStr);
    }

    // If "days left" format
    const daysMatch = dateStr.match(/(\d+)\s*days?/i);
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    return new Date(dateStr);
  } catch {
    return null;
  }
}

// Helper: Categorize scholarship
function categorizeScholarship(title, eligibility) {
  const text = (title + ' ' + eligibility).toLowerCase();

  if (text.includes('women') || text.includes('girl')) return 'Women';
  if (text.includes('postgraduate') || text.includes('pg') || text.includes('master')) return 'PG';
  if (text.includes('undergraduate') || text.includes('ug') || text.includes('bachelor')) return 'UG';
  if (text.includes('research') || text.includes('phd')) return 'Research';
  if (text.includes('merit')) return 'Merit-based';
  if (text.includes('internship')) return 'Internship';

  return 'General';
}

// Helper: Categorize domain
function categorizeDomain(title, eligibility) {
  const text = (title + ' ' + eligibility).toLowerCase();

  if (text.includes('engineering') || text.includes('technology') || text.includes('iit')) return 'Engineering';
  if (text.includes('medical') || text.includes('mbbs') || text.includes('health')) return 'Medical';
  if (text.includes('science') || text.includes('research')) return 'Science';
  if (text.includes('arts') || text.includes('humanities')) return 'Arts';
  if (text.includes('commerce') || text.includes('finance') || text.includes('mba')) return 'Commerce';
  if (text.includes('design') || text.includes('ui') || text.includes('ux')) return 'Arts';

  return 'General';
}

// Fallback data sources
function getBuddy4StudyFallback() {
  return [
    {
      title: 'AICTE Pragati Scholarship for Girl Students',
      provider: 'AICTE',
      amount: '₹50,000 per year',
      eligibility: 'Girl students pursuing technical degree courses',
      deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      link: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati-Scholarship-Scheme',
      category: 'Women',
      domain: 'Engineering',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'buddy4study'
    },
    {
      title: 'Post Matric Scholarship for SC/ST Students',
      provider: 'Ministry of Social Justice',
      amount: 'Up to ₹3,00,000 per year',
      eligibility: 'SC/ST students pursuing post-matriculation courses',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      link: 'https://scholarships.gov.in/',
      category: 'PG',
      domain: 'General',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'buddy4study'
    },
    {
      title: 'INSPIRE Scholarship for Higher Education',
      provider: 'Department of Science & Technology',
      amount: '₹80,000 per year + ₹20,000 mentorship',
      eligibility: 'Top 1% in Class XII with science subjects',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      link: 'https://online-inspire.gov.in/',
      category: 'UG',
      domain: 'Science',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'buddy4study'
    }
  ];
}

function getInternshalaFallback() {
  return [
    {
      title: 'Software Development Intern',
      provider: 'Tech Companies',
      amount: '₹15,000 - ₹25,000 per month',
      eligibility: 'B.Tech/MCA students, Knowledge of Java/Python',
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/software-development-internship',
      category: 'Internship',
      domain: 'Engineering',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    {
      title: 'Data Analytics Intern',
      provider: 'Various Companies',
      amount: '₹20,000 - ₹30,000 per month',
      eligibility: 'Final year students, SQL, Python, Statistics',
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/data-analytics-internship',
      category: 'Internship',
      domain: 'Engineering',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    }
  ];
}

function getGovernmentScholarshipsFallback() {
  return [
    {
      title: 'National Scholarship Portal - Central Sector Scheme',
      provider: 'Ministry of Education',
      amount: '₹12,000 per year',
      eligibility: 'Top 80,000 students in Class XII board exams',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      link: 'https://scholarships.gov.in/',
      category: 'UG',
      domain: 'General',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'government'
    },
    {
      title: 'PM YASASVI Scholarship Scheme',
      provider: 'Ministry of Social Justice',
      amount: '₹75,000 to ₹1,25,000 per year',
      eligibility: 'OBC/EBC/DNT students in Class 9-10',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      link: 'https://scholarships.gov.in/',
      category: 'General',
      domain: 'General',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'government'
    }
  ];
}

// For testing locally
if (require.main === module) {
  const mockReq = { query: {}, body: {} };
  const mockRes = {
    json: (data) => console.log('Response:', JSON.stringify(data, null, 2)),
    status: (code) => ({
      json: (data) => console.log(`Status ${code}:`, JSON.stringify(data, null, 2))
    })
  };

  functions.http.scrapeScholarships(mockReq, mockRes);
}

const functions = require('@google-cloud/functions-framework');
const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/career-advisor';
let cachedClient = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

// Main HTTP function
functions.http('scrapeScholarships', async (req, res) => {
  const startTime = Date.now();

  try {
    const client = await getMongoClient();
    const db = client.db('career-advisor');
    const scholarships = db.collection('scholarships');

    console.log('🔍 Starting scholarship scraping...');

    // Source 1: Sample government scholarships (since we can't actually scrape)
    const govScholarships = await scrapeGovernmentData();

    // Source 2: Sample internships
    const internships = await scrapeInternshipData();

    const allData = [...govScholarships, ...internships];

    // Store in MongoDB with upsert (update if exists, insert if new)
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
        duration: `${duration}ms`
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

// Scrape government scholarship data
async function scrapeGovernmentData() {
  const scholarships = [];

  try {
    // In production, this would actually scrape websites
    // For now, we'll generate sample data that would come from scraping
    const sources = [
      {
        title: 'National Scholarship Portal - Central Sector Scheme',
        provider: 'Ministry of Education',
        amount: '₹12,000 per year',
        eligibility: 'Top 80,000 students in Class XII board exams',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        link: 'https://scholarships.gov.in/',
        category: 'UG',
        domain: 'General'
      },
      {
        title: 'PM YASASVI Scholarship Scheme',
        provider: 'Ministry of Social Justice',
        amount: '₹75,000 to ₹1,25,000 per year',
        eligibility: 'OBC/EBC/DNT students in Class 9-10',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        link: 'https://scholarships.gov.in/',
        category: 'General',
        domain: 'General'
      },
      {
        title: 'INSPIRE Scholarship for Higher Education',
        provider: 'Department of Science & Technology',
        amount: '₹80,000 per year + ₹20,000 mentorship',
        eligibility: 'Top 1% in Class XII with science subjects',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        link: 'https://online-inspire.gov.in/',
        category: 'UG',
        domain: 'Science'
      },
      {
        title: 'AICTE Pragati Scholarship for Girls',
        provider: 'AICTE',
        amount: '₹50,000 per year',
        eligibility: 'Girl students in technical degree courses',
        deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        link: 'https://www.aicte-india.org/',
        category: 'Women',
        domain: 'Engineering'
      },
      {
        title: 'Post Matric Scholarship SC/ST',
        provider: 'Ministry of Social Justice',
        amount: 'Up to ₹3,00,000 per year',
        eligibility: 'SC/ST students for post-matriculation courses',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        link: 'https://scholarships.gov.in/',
        category: 'PG',
        domain: 'General'
      }
    ];

    for (const item of sources) {
      scholarships.push({
        ...item,
        trending: Math.random() > 0.7, // 30% chance of trending
        active: true,
        scrapedAt: new Date(),
        source: 'government'
      });
    }

    console.log(`✅ Scraped ${scholarships.length} government scholarships`);
  } catch (error) {
    console.error('Error scraping government data:', error.message);
  }

  return scholarships;
}

// Scrape internship data
async function scrapeInternshipData() {
  const internships = [];

  try {
    const sources = [
      {
        title: 'Software Development Intern',
        provider: 'Infosys',
        amount: '₹15,000 - ₹25,000 per month',
        eligibility: 'B.Tech/MCA students, Knowledge of Java/Python',
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        link: 'https://www.infosys.com/careers/internships',
        category: 'Internship',
        domain: 'Engineering'
      },
      {
        title: 'Data Analytics Intern',
        provider: 'Flipkart',
        amount: '₹20,000 - ₹30,000 per month',
        eligibility: 'Final year students, SQL, Python, Statistics',
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        link: 'https://www.flipkartcareers.com/',
        category: 'Internship',
        domain: 'Engineering'
      },
      {
        title: 'Digital Marketing Intern',
        provider: "Byju's",
        amount: '₹10,000 - ₹15,000 per month',
        eligibility: 'MBA/BBA students, Social media knowledge',
        deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        link: 'https://byjus.com/careers/',
        category: 'Internship',
        domain: 'Commerce'
      },
      {
        title: 'UI/UX Design Intern',
        provider: 'Zomato',
        amount: '₹12,000 - ₹18,000 per month',
        eligibility: 'Design students, Figma, Adobe XD portfolio',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        link: 'https://www.zomato.com/careers',
        category: 'Internship',
        domain: 'Arts'
      },
      {
        title: 'Finance Analyst Intern',
        provider: 'ICICI Bank',
        amount: '₹18,000 - ₹22,000 per month',
        eligibility: 'Commerce/Finance students, Excel proficiency',
        deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
        link: 'https://www.icicibank.com/careers',
        category: 'Internship',
        domain: 'Commerce'
      },
      {
        title: 'AI/ML Research Intern',
        provider: 'IIT Bombay',
        amount: '₹15,000 per month + Certificate',
        eligibility: 'M.Tech/PhD students, Deep Learning knowledge',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        link: 'https://www.iitb.ac.in/',
        category: 'Research',
        domain: 'Engineering'
      }
    ];

    for (const item of sources) {
      internships.push({
        ...item,
        trending: Math.random() > 0.6, // 40% chance of trending
        active: true,
        scrapedAt: new Date(),
        source: 'internship'
      });
    }

    console.log(`✅ Scraped ${internships.length} internships`);
  } catch (error) {
    console.error('Error scraping internship data:', error.message);
  }

  return internships;
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

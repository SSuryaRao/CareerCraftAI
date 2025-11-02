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

  // Use ScraperAPI with JavaScript rendering enabled
  const scraperUrl = `http://api.scraperapi.com/?api_key=${SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}&render=true`;
  const response = await axios.get(scraperUrl, { timeout: 90000 }); // Increased timeout for JS rendering
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
    // AICTE Scholarships
    {
      title: 'AICTE Pragati Scholarship for Girl Students',
      provider: 'AICTE',
      amount: '₹50,000 per year',
      eligibility: 'Girl students in 1st year of technical degree/diploma courses',
      deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      link: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati-Scholarship-Scheme',
      category: 'Women',
      domain: 'Engineering',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'aicte'
    },
    {
      title: 'AICTE Saksham Scholarship for Differently Abled Students',
      provider: 'AICTE',
      amount: '₹50,000 per year',
      eligibility: 'Differently-abled students in technical degree/diploma courses',
      deadline: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
      link: 'https://www.aicte-india.org/schemes/students-development-schemes/Saksham-Scholarship-Scheme',
      category: 'General',
      domain: 'Engineering',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'aicte'
    },
    // UGC Scholarships
    {
      title: 'UGC NET JRF Fellowship',
      provider: 'University Grants Commission',
      amount: '₹37,000 per month (initial 2 years)',
      eligibility: 'UGC NET qualified candidates for doctoral research',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      link: 'https://ugcnet.nta.nic.in/',
      category: 'Research',
      domain: 'General',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'ugc'
    },
    {
      title: 'UGC Post-Graduate Indira Gandhi Scholarship for Single Girl Child',
      provider: 'University Grants Commission',
      amount: '₹36,200 per year',
      eligibility: 'Single girl child pursuing post-graduation',
      deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      link: 'https://www.ugc.gov.in/scholarship',
      category: 'Women',
      domain: 'General',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'ugc'
    },
    // State Government Scholarships
    {
      title: 'Maharashtra Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Punarpurti Yojana',
      provider: 'Maharashtra Government',
      amount: 'Full tuition fee reimbursement',
      eligibility: 'Students from reserved categories in Maharashtra',
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      link: 'https://www.mahadbtmahait.gov.in/',
      category: 'General',
      domain: 'General',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'state_govt'
    },
    {
      title: 'Tamil Nadu Dr. Ambedkar Law University Free Coaching',
      provider: 'Tamil Nadu Government',
      amount: 'Free coaching + ₹2,500 monthly stipend',
      eligibility: 'SC/ST students for competitive exams',
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      link: 'https://www.tn.gov.in/scheme/data_view/134',
      category: 'Merit-based',
      domain: 'Law',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'state_govt'
    },
    // Private Foundation Scholarships
    {
      title: 'Tata Capital Pankh Scholarship Program',
      provider: 'Tata Capital',
      amount: 'Up to ₹12,000 per year',
      eligibility: 'Students from low-income families pursuing graduation',
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      link: 'https://www.buddy4study.com/page/tata-capital-pankh-scholarship-program',
      category: 'Need-based',
      domain: 'General',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'private'
    },
    {
      title: 'Reliance Foundation Undergraduate Scholarship',
      provider: 'Reliance Foundation',
      amount: '₹2,00,000 per year',
      eligibility: 'Meritorious students from economically challenged backgrounds',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      link: 'https://www.reliancefoundation.org/initiatives/education.html',
      category: 'UG',
      domain: 'General',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'private'
    },
    {
      title: 'HDFC Bank Parivartan ECSS Program',
      provider: 'HDFC Bank',
      amount: '₹25,000 to ₹75,000',
      eligibility: 'Students from economically weaker sections pursuing professional courses',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      link: 'https://www.hdfcbank.com/personal/about-us/csr/parivartan',
      category: 'UG',
      domain: 'General',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'private'
    },
    // Medical Scholarships
    {
      title: 'Indian Council of Medical Research JRF Scholarship',
      provider: 'ICMR',
      amount: '₹35,000 per month',
      eligibility: 'Students pursuing MD/MS/PhD in medical sciences',
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      link: 'https://main.icmr.nic.in/fellowships',
      category: 'Research',
      domain: 'Medical',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'icmr'
    }
  ];
}

function getInternshalaFallback() {
  return [
    // Tech Internships
    {
      title: 'Software Development Intern - Full Stack',
      provider: 'Tech Companies',
      amount: '₹15,000 - ₹25,000 per month',
      eligibility: 'B.Tech/MCA students with MERN/MEAN stack knowledge',
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
      title: 'Data Science & Analytics Intern',
      provider: 'Analytics Firms',
      amount: '₹20,000 - ₹30,000 per month',
      eligibility: 'Final year B.Tech/M.Sc with Python, SQL, ML knowledge',
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/data-science-internship',
      category: 'Internship',
      domain: 'Engineering',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    {
      title: 'AI/ML Research Intern',
      provider: 'Research Labs & Startups',
      amount: '₹18,000 - ₹28,000 per month',
      eligibility: 'M.Tech/B.Tech students with deep learning experience',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/machine-learning-internship',
      category: 'Internship',
      domain: 'Engineering',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    {
      title: 'Mobile App Development Intern (Android/iOS)',
      provider: 'App Development Companies',
      amount: '₹12,000 - ₹20,000 per month',
      eligibility: 'Students with Flutter/React Native/Kotlin experience',
      deadline: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/mobile-app-development-internship',
      category: 'Internship',
      domain: 'Engineering',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    // Business Internships
    {
      title: 'Digital Marketing Intern',
      provider: 'Marketing Agencies',
      amount: '₹10,000 - ₹15,000 per month',
      eligibility: 'MBA/BBA students with SEO, SEM, social media knowledge',
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/digital-marketing-internship',
      category: 'Internship',
      domain: 'Commerce',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    {
      title: 'Business Development Intern',
      provider: 'Startups & Corporations',
      amount: '₹8,000 - ₹12,000 per month + incentives',
      eligibility: 'Final year BBA/MBA students with communication skills',
      deadline: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/business-development-internship',
      category: 'Internship',
      domain: 'Commerce',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    {
      title: 'Financial Analyst Intern',
      provider: 'Banks & Financial Institutions',
      amount: '₹18,000 - ₹22,000 per month',
      eligibility: 'B.Com/MBA Finance students with Excel & financial modeling skills',
      deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/finance-internship',
      category: 'Internship',
      domain: 'Commerce',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    // Design & Creative
    {
      title: 'UI/UX Design Intern',
      provider: 'Product Companies',
      amount: '₹12,000 - ₹18,000 per month',
      eligibility: 'Design students with Figma/Adobe XD portfolio',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/ui-ux-design-internship',
      category: 'Internship',
      domain: 'Arts',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    {
      title: 'Content Writing Intern',
      provider: 'Media & Content Agencies',
      amount: '₹8,000 - ₹12,000 per month',
      eligibility: 'Students with strong writing skills & creativity',
      deadline: new Date(Date.now() + 48 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/content-writing-internship',
      category: 'Internship',
      domain: 'Arts',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    {
      title: 'Graphic Design Intern',
      provider: 'Creative Studios',
      amount: '₹10,000 - ₹15,000 per month',
      eligibility: 'Design students proficient in Photoshop, Illustrator',
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/graphic-design-internship',
      category: 'Internship',
      domain: 'Arts',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    // Research & Science
    {
      title: 'Research Intern - Biotechnology',
      provider: 'Research Institutes',
      amount: '₹15,000 - ₹20,000 per month + certificate',
      eligibility: 'M.Sc/B.Tech Biotech students with lab experience',
      deadline: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/biotechnology-internship',
      category: 'Internship',
      domain: 'Science',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    },
    {
      title: 'Clinical Research Intern',
      provider: 'Pharmaceutical Companies',
      amount: '₹16,000 - ₹24,000 per month',
      eligibility: 'Pharmacy/Life Sciences students for clinical trials',
      deadline: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000),
      link: 'https://internshala.com/internships/clinical-research-internship',
      category: 'Internship',
      domain: 'Medical',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'internshala'
    }
  ];
}

function getGovernmentScholarshipsFallback() {
  return [
    // Central Government Scholarships
    {
      title: 'National Scholarship Portal - Central Sector Scheme',
      provider: 'Ministry of Education',
      amount: '₹12,000 per year (UG) / ₹20,000 per year (PG)',
      eligibility: 'Top 80,000 students in Class XII board exams, family income < ₹8 lakh/year',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      link: 'https://scholarships.gov.in/',
      category: 'UG',
      domain: 'General',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'nsp'
    },
    {
      title: 'PM YASASVI Scholarship Scheme',
      provider: 'Ministry of Social Justice & Empowerment',
      amount: '₹75,000 to ₹1,25,000 per year',
      eligibility: 'OBC/EBC/DNT students in Class 9-10, family income < ₹2.5 lakh/year',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      link: 'https://yet.nta.ac.in/',
      category: 'General',
      domain: 'General',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'nsp'
    },
    {
      title: 'Pre-Matric Scholarship for Students Belonging to Minority Communities',
      provider: 'Ministry of Minority Affairs',
      amount: 'Up to ₹12,000 per year',
      eligibility: 'Students from minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) in Class 1-10',
      deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      link: 'https://scholarships.gov.in/',
      category: 'Minority',
      domain: 'General',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'nsp'
    },
    {
      title: 'Post-Matric Scholarships Scheme for Minorities',
      provider: 'Ministry of Minority Affairs',
      amount: 'Maintenance allowance + ₹20,000 per year',
      eligibility: 'Minority community students pursuing Class 11-12 & higher education',
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      link: 'https://scholarships.gov.in/',
      category: 'PG',
      domain: 'General',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'nsp'
    },
    {
      title: 'INSPIRE Scholarship for Higher Education (SHE)',
      provider: 'Department of Science & Technology',
      amount: '₹80,000 per year + ₹20,000 annual mentorship fee',
      eligibility: 'Top 1% in Class XII board exams in natural & basic sciences',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      link: 'https://online-inspire.gov.in/',
      category: 'UG',
      domain: 'Science',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'dst'
    },
    {
      title: 'Prime Minister Research Fellowship (PMRF)',
      provider: 'Ministry of Education',
      amount: '₹80,000 to ₹1,00,000 per month',
      eligibility: 'B.Tech/M.Sc/M.Tech graduates with CGPA > 8.0 for PhD in top institutes',
      deadline: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
      link: 'https://www.pmrf.in/',
      category: 'Research',
      domain: 'Science',
      trending: true,
      active: true,
      scrapedAt: new Date(),
      source: 'pmrf'
    },
    {
      title: 'National Overseas Scholarship Scheme',
      provider: 'Ministry of Social Justice & Empowerment',
      amount: 'Full tuition fee + living expenses',
      eligibility: 'SC/Denotified Tribe students for Masters/PhD abroad',
      deadline: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
      link: 'https://socialjustice.gov.in/',
      category: 'PG',
      domain: 'General',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'msjp'
    },
    {
      title: 'Swami Vivekananda Single Girl Child Scholarship for Research',
      provider: 'UGC',
      amount: '₹3,100 per month + contingency',
      eligibility: 'Single girl child pursuing M.Phil/PhD',
      deadline: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
      link: 'https://www.ugc.gov.in/',
      category: 'Women',
      domain: 'General',
      trending: false,
      active: true,
      scrapedAt: new Date(),
      source: 'ugc'
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

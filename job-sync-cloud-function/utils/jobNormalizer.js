/**
 * Utility functions to normalize job data from different APIs
 * into a consistent format for our database
 */

/**
 * Extract salary range from various formats
 */
function extractSalary(salaryStr, currency = 'USD') {
  if (!salaryStr) return { min: null, max: null, currency };

  const ranges = salaryStr.match(/\$?(\d+)k?\s*-\s*\$?(\d+)k?/i);
  if (ranges) {
    const min = parseInt(ranges[1]) * (ranges[1].length <= 3 ? 1000 : 1);
    const max = parseInt(ranges[2]) * (ranges[2].length <= 3 ? 1000 : 1);
    return { min, max, currency };
  }

  const single = salaryStr.match(/\$?(\d+)k?/i);
  if (single) {
    const amount = parseInt(single[1]) * (single[1].length <= 3 ? 1000 : 1);
    return { min: amount, max: amount, currency };
  }

  return { min: null, max: null, currency };
}

/**
 * Detect job type from title or description
 */
function detectJobType(title, description = '') {
  const text = (title + ' ' + description).toLowerCase();

  if (text.includes('intern')) return 'internship';
  if (text.includes('freelance') || text.includes('contractor')) return 'freelance';
  if (text.includes('contract')) return 'contract';
  if (text.includes('part-time') || text.includes('part time')) return 'part-time';

  return 'full-time';
}

/**
 * Detect experience level from title or description
 */
function detectExperienceLevel(title, description = '') {
  const text = (title + ' ' + description).toLowerCase();

  if (text.includes('senior') || text.includes('sr.') || text.includes('lead')) return 'senior';
  if (text.includes('executive') || text.includes('director') || text.includes('vp') || text.includes('cto') || text.includes('cio')) return 'executive';
  if (text.includes('junior') || text.includes('jr.') || text.includes('entry') || text.includes('graduate')) return 'entry';
  if (text.includes('mid') || text.includes('intermediate')) return 'mid';
  if (text.includes('staff') || text.includes('principal')) return 'lead';

  return 'mid';
}

/**
 * Detect remote level
 */
function detectRemoteLevel(location, description = '') {
  const text = (location + ' ' + description).toLowerCase();

  if (text.includes('remote') || text.includes('work from home') || text.includes('wfh')) {
    if (text.includes('hybrid')) return 'hybrid';
    return 'fully-remote';
  }

  if (text.includes('hybrid')) return 'hybrid';
  if (text.includes('on-site') || text.includes('onsite') || text.includes('office')) return 'office-based';

  return 'office-based';
}

/**
 * Extract tags from title and description
 */
function extractTags(title, description = '') {
  const commonTags = [
    'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
    'node', 'nodejs', 'express', 'mongodb', 'postgresql', 'mysql', 'redis',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'devops', 'ci/cd',
    'machine learning', 'ml', 'ai', 'data science', 'analytics',
    'frontend', 'backend', 'full-stack', 'fullstack', 'mobile',
    'ios', 'android', 'flutter', 'react native', 'swift', 'kotlin',
    'golang', 'rust', 'ruby', 'php', 'c++', 'c#', '.net',
    'sql', 'nosql', 'graphql', 'rest', 'api', 'microservices',
    'agile', 'scrum', 'git', 'github', 'gitlab'
  ];

  const text = (title + ' ' + description).toLowerCase();
  const tags = [];

  commonTags.forEach(tag => {
    if (text.includes(tag)) {
      tags.push(tag);
    }
  });

  return [...new Set(tags)];
}

/**
 * Truncate description to max length
 */
function truncateDescription(description, maxLength = 5000) {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
}

/**
 * Clean and validate URL
 */
function cleanUrl(url) {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    return null;
  }
}

/**
 * Parse date from various formats
 */
function parseDate(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date();
    return date;
  } catch {
    return new Date();
  }
}

/**
 * Generate unique ID for job (prevents duplicates)
 */
function generateRemoteId(sourceApi, jobId) {
  return `${sourceApi}_${jobId}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

module.exports = {
  extractSalary,
  detectJobType,
  detectExperienceLevel,
  detectRemoteLevel,
  extractTags,
  truncateDescription,
  cleanUrl,
  parseDate,
  generateRemoteId
};

/**
 * Question Review and Import Tool
 *
 * Reviews AI-generated questions and imports them to the frontend
 *
 * Usage: node scripts/review-and-import.js <domain>
 */

const fs = require('fs');
const path = require('path');

function reviewQuestions(domain) {
  const inputPath = path.join(__dirname, `../generated-questions/${domain}-generated.json`);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ No generated questions found for ${domain}`);
    console.error(`   Run: node scripts/generate-questions.js ${domain} <count>`);
    return;
  }

  const questions = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  console.log(`\n📊 Review Summary for ${domain}:`);
  console.log(`   Total Questions: ${questions.length}`);

  // Analyze by difficulty
  const byDifficulty = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});

  console.log(`\n   Difficulty Distribution:`);
  Object.entries(byDifficulty).forEach(([diff, count]) => {
    console.log(`     ${diff}: ${count}`);
  });

  // Analyze by topic
  const byTopic = questions.reduce((acc, q) => {
    acc[q.topic] = (acc[q.topic] || 0) + 1;
    return acc;
  }, {});

  console.log(`\n   Topics Covered:`);
  Object.entries(byTopic).forEach(([topic, count]) => {
    console.log(`     ${topic}: ${count}`);
  });

  // Validation checks
  console.log(`\n🔍 Validation Checks:`);

  const issues = [];

  questions.forEach((q, index) => {
    if (!q.question || q.question.length < 10) {
      issues.push(`Question ${index + 1}: Question text too short`);
    }

    if (!q.options || q.options.length !== 4) {
      issues.push(`Question ${index + 1}: Must have exactly 4 options`);
    }

    if (q.correctAnswer < 0 || q.correctAnswer > 3) {
      issues.push(`Question ${index + 1}: Invalid correct answer index`);
    }

    if (!q.explanation || q.explanation.length < 10) {
      issues.push(`Question ${index + 1}: Explanation too short`);
    }

    if (!q.topic) {
      issues.push(`Question ${index + 1}: Missing topic tag`);
    }
  });

  if (issues.length > 0) {
    console.log(`   ⚠️  Found ${issues.length} issues:`);
    issues.slice(0, 10).forEach(issue => console.log(`     - ${issue}`));
    if (issues.length > 10) {
      console.log(`     ... and ${issues.length - 10} more`);
    }
  } else {
    console.log(`   ✅ All validation checks passed!`);
  }

  return questions;
}

function importToFrontend(domain, questions) {
  // Map domain names to file names
  const fileMap = {
    'data-science': 'data-science-pool',
    'web-development': 'web-development-pool',
    'cybersecurity': 'cybersecurity-pool',
    'cloud-computing': 'cloud-computing-pool',
    'mobile-development': 'mobile-development-pool',
    'ai-ml': 'ai-ml-pool',
    'faang': 'faang-pool',
    'startup': 'startup-pool',
    'service-based': 'service-based-pool'
  };

  const fileName = fileMap[domain];
  if (!fileName) {
    console.error(`❌ Unknown domain: ${domain}`);
    return;
  }

  const frontendPath = path.join(__dirname, `../../frontend/src/data/question-pools/${fileName}.ts`);

  console.log(`\n📝 Generating TypeScript file...`);

  const tsContent = `import { AptitudeQuestion } from '../aptitude-questions'

/**
 * ${domain.toUpperCase()} QUESTION POOL
 * Total: ${questions.length} questions
 * Auto-generated on ${new Date().toISOString()}
 */

const ${fileName.replace(/-/g, '')}Questions: AptitudeQuestion[] = ${JSON.stringify(questions, null, 2)}

export default ${fileName.replace(/-/g, '')}Questions
`;

  const dir = path.dirname(frontendPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(frontendPath, tsContent);

  console.log(`✅ Imported to: ${frontendPath}`);
  console.log(`\n🎯 Next steps:`);
  console.log(`   1. Review the generated file in your editor`);
  console.log(`   2. Test a few questions manually`);
  console.log(`   3. Update the main domain-aptitude-questions.ts to import this pool`);
}

// Main execution
const domain = process.argv[2];

if (!domain) {
  console.error('❌ Please specify a domain');
  console.error('   Usage: node scripts/review-and-import.js <domain>');
  process.exit(1);
}

console.log(`\n🔍 Reviewing questions for: ${domain}\n`);

const questions = reviewQuestions(domain);

if (questions && questions.length > 0) {
  console.log(`\n❓ Import these questions to frontend? (y/n)`);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('> ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      importToFrontend(domain, questions);
      console.log('\n✅ Import complete!');
    } else {
      console.log('\n❌ Import cancelled');
    }
    readline.close();
  });
}

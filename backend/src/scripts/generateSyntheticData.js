/**
 * Generate Synthetic Training Data
 *
 * This script generates synthetic resume analysis examples
 * to supplement real data when you have fewer samples.
 *
 * Usage: node src/scripts/generateSyntheticData.js [count]
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../../training-data');
const DEFAULT_COUNT = 200;

// Sample resume templates for different experience levels
const RESUME_TEMPLATES = {
  fresher: {
    score: [55, 70],
    text: `John Doe
Email: john.doe@email.com
Phone: +91-9876543210

OBJECTIVE
Recent B.Tech graduate in Computer Science seeking entry-level software development position.

EDUCATION
B.Tech in Computer Science
ABC College of Engineering, Mumbai
2020-2024 | CGPA: 7.8/10

TECHNICAL SKILLS
Languages: Java, Python, C++
Web Technologies: HTML, CSS, JavaScript
Databases: MySQL
Tools: Git, VS Code

PROJECTS
1. Student Management System
   - Developed using Java and MySQL
   - Features include student enrollment, attendance tracking

2. Weather App
   - Created using HTML, CSS, JavaScript
   - Fetches real-time weather data

INTERNSHIPS
Summer Intern - XYZ Technologies
June 2023 - July 2023
- Worked on web development projects
- Learned React framework

CERTIFICATIONS
- Java Programming - Coursera
- Web Development Basics - Udemy`,
    suggestions: [
      {
        section: 'Summary',
        issue: 'Using outdated "OBJECTIVE" instead of professional summary',
        improvement: 'Replace with a compelling summary highlighting skills and value proposition',
        beforeAfter: {
          before: 'Recent B.Tech graduate seeking entry-level position',
          after: 'Results-oriented Computer Science graduate with hands-on experience in full-stack development, proficient in Java and Python, seeking to contribute technical expertise to innovative software projects'
        },
        priority: 'high'
      },
      {
        section: 'Projects',
        issue: 'Project descriptions lack quantifiable metrics',
        improvement: 'Add specific numbers and impact measurements',
        beforeAfter: {
          before: 'Developed using Java and MySQL',
          after: 'Developed database-driven application using Java and MySQL, managing 500+ student records with 95% data accuracy'
        },
        priority: 'critical'
      }
    ]
  },
  intermediate: {
    score: [68, 82],
    text: `Priya Sharma
priya.sharma@email.com | +91-9876543210 | LinkedIn: linkedin.com/in/priyasharma

PROFESSIONAL SUMMARY
Software Engineer with 3 years of experience in developing web applications using React and Node.js.

WORK EXPERIENCE

Software Engineer | Tech Solutions Pvt Ltd
Mumbai, India | Jan 2022 - Present
• Developed web applications using React.js
• Worked with REST APIs
• Collaborated with team members on projects
• Fixed bugs and improved performance

Junior Developer | StartUp Inc
Bangalore, India | Jun 2021 - Dec 2021
• Worked on frontend development
• Used HTML, CSS, JavaScript
• Participated in team meetings

EDUCATION
B.E. in Information Technology
University of Mumbai | 2017-2021 | 8.2 CGPA

TECHNICAL SKILLS
Frontend: React.js, HTML5, CSS3, JavaScript
Backend: Node.js, Express.js
Database: MongoDB, MySQL
Tools: Git, Docker, VS Code
Cloud: AWS basics

CERTIFICATIONS
- React Advanced Patterns - Udemy
- AWS Certified Cloud Practitioner`,
    suggestions: [
      {
        section: 'Work Experience',
        issue: 'Bullet points lack strong action verbs and quantifiable results',
        improvement: 'Use powerful action verbs and add metrics to demonstrate impact',
        beforeAfter: {
          before: 'Developed web applications using React.js',
          after: 'Architected and deployed 5+ scalable web applications using React.js, improving user engagement by 40% and reducing page load time by 30%'
        },
        priority: 'critical'
      },
      {
        section: 'Technical Skills',
        issue: 'Missing trending technologies and frameworks',
        improvement: 'Add modern tech stack keywords like TypeScript, GraphQL, Microservices',
        beforeAfter: {
          before: 'Backend: Node.js, Express.js',
          after: 'Backend: Node.js, Express.js, TypeScript, GraphQL, RESTful APIs, Microservices Architecture'
        },
        priority: 'high'
      }
    ]
  },
  senior: {
    score: [75, 90],
    text: `Rahul Kumar
Senior Software Engineer | Bangalore
Email: rahul.kumar@email.com | Phone: +91-9876543210
LinkedIn: linkedin.com/in/rahulkumar | GitHub: github.com/rahulkumar

PROFESSIONAL SUMMARY
Senior Software Engineer with 6 years of experience in designing and developing scalable web applications. Expertise in React, Node.js, AWS, and microservices architecture. Led teams of 5+ developers and delivered multiple high-impact projects.

WORK EXPERIENCE

Senior Software Engineer | Amazon Development Centre India
Bangalore, India | Mar 2020 - Present
• Lead development of microservices-based e-commerce platform serving 10M+ users
• Architected RESTful APIs handling 50K requests/minute with 99.9% uptime
• Mentored team of 5 junior developers, improving code quality by 35%
• Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes
• Optimized database queries resulting in 60% performance improvement
• Technologies: React, Node.js, TypeScript, AWS (EC2, S3, Lambda), Docker, Kubernetes

Software Engineer | Flipkart Internet Pvt Ltd
Bangalore, India | Jul 2018 - Feb 2020
• Developed customer-facing features for product catalog using React and Redux
• Built Node.js microservices processing 100K+ transactions daily
• Reduced API response time by 40% through caching strategies
• Collaborated with product managers and designers in Agile environment

Associate Software Engineer | TCS
Pune, India | Jun 2017 - Jun 2018
• Developed enterprise web applications for banking clients
• Worked on full-stack development using Java, Spring Boot, and Angular
• Participated in code reviews and maintained high code quality standards

EDUCATION
B.Tech in Computer Science and Engineering
IIT Kharagpur | 2013-2017 | CGPA: 8.9/10

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java
Frontend: React.js, Redux, Next.js, HTML5, CSS3, Material-UI
Backend: Node.js, Express.js, GraphQL, RESTful APIs, Microservices
Databases: MongoDB, PostgreSQL, Redis, DynamoDB
Cloud & DevOps: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes, Jenkins, GitHub Actions
Tools: Git, JIRA, Postman, VS Code

PROJECTS & ACHIEVEMENTS
• Built real-time analytics dashboard processing 1M+ events/day using React and WebSockets
• Designed and implemented API gateway handling authentication for 20+ microservices
• Awarded "Best Performer Q4 2022" for exceptional delivery and leadership

CERTIFICATIONS
• AWS Certified Solutions Architect - Associate
• Professional Scrum Master (PSM I)
• React Advanced Concepts - Frontend Masters`,
    suggestions: [
      {
        section: 'Professional Summary',
        issue: 'Summary could emphasize leadership and business impact more strongly',
        improvement: 'Highlight measurable business outcomes and leadership achievements',
        beforeAfter: {
          before: 'Led teams of 5+ developers and delivered multiple high-impact projects',
          after: 'Led cross-functional teams of 5+ developers to deliver mission-critical projects that increased revenue by $2M annually and improved customer satisfaction by 45%'
        },
        priority: 'medium'
      },
      {
        section: 'Technical Skills',
        issue: 'Could add more trending technologies and cloud-native tools',
        improvement: 'Include Terraform, Serverless, Event-driven architecture',
        beforeAfter: {
          before: 'Cloud & DevOps: AWS, Docker, Kubernetes',
          after: 'Cloud & DevOps: AWS (Lambda, ECS, CloudFormation), Terraform, Docker, Kubernetes, Serverless Framework, Event-driven Architecture, CI/CD Automation'
        },
        priority: 'low'
      }
    ]
  }
};

// Indian companies and technologies
const INDIAN_COMPANIES = [
  'TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra',
  'Flipkart', 'Amazon India', 'Google India', 'Microsoft India',
  'Accenture India', 'Cognizant', 'Capgemini India', 'Paytm',
  'Zomato', 'Swiggy', 'PhonePe', 'CRED', 'Razorpay', 'Freshworks'
];

const INDIAN_CITIES = [
  'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Chennai',
  'Noida', 'Gurugram', 'Delhi', 'Kolkata', 'Ahmedabad'
];

const TECH_SKILLS = {
  frontend: ['React', 'Angular', 'Vue.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Material-UI'],
  backend: ['Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'GraphQL', 'REST API'],
  database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'DynamoDB', 'Cassandra', 'ElasticSearch'],
  cloud: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions'],
  tools: ['Git', 'JIRA', 'Postman', 'VS Code', 'IntelliJ IDEA', 'Figma']
};

/**
 * Generate a random resume based on template
 */
function generateResume(template, index) {
  const names = [
    'Amit Sharma', 'Priya Patel', 'Rahul Kumar', 'Sneha Singh', 'Vikram Reddy',
    'Anita Desai', 'Arjun Mehta', 'Kavya Iyer', 'Rohan Gupta', 'Neha Joshi'
  ];

  const name = names[index % names.length];
  const company = INDIAN_COMPANIES[Math.floor(Math.random() * INDIAN_COMPANIES.length)];
  const city = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];

  let resumeText = template.text;
  resumeText = resumeText.replace(/John Doe|Priya Sharma|Rahul Kumar/g, name);
  resumeText = resumeText.replace(/TCS|Tech Solutions Pvt Ltd|Amazon Development Centre India/g, company);
  resumeText = resumeText.replace(/Mumbai|Bangalore/g, city);

  return resumeText;
}

/**
 * Generate analysis for a resume
 */
function generateAnalysis(template, resumeText) {
  const baseScore = template.score[0];
  const maxScore = template.score[1];
  const score = Math.floor(Math.random() * (maxScore - baseScore + 1)) + baseScore;

  return {
    overallScore: score,
    scores: {
      keywords: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
      formatting: Math.min(100, score + Math.floor(Math.random() * 10)),
      experience: Math.max(0, score - Math.floor(Math.random() * 8)),
      skills: Math.min(100, score + Math.floor(Math.random() * 5))
    },
    suggestions: template.suggestions,
    keywordAnalysis: {
      found: TECH_SKILLS.frontend.slice(0, 5).concat(TECH_SKILLS.backend.slice(0, 3)),
      missing: TECH_SKILLS.cloud.slice(0, 4),
      suggested: ['TypeScript', 'Docker', 'Kubernetes', 'CI/CD', 'Microservices', 'GraphQL'],
      density: Math.floor(Math.random() * 30) + 50
    },
    strengths: [
      'Clear contact information',
      'Relevant technical skills listed',
      'Educational qualifications mentioned',
      'Professional work experience included'
    ],
    weaknesses: [
      'Could add more quantifiable achievements',
      'Missing some trending technologies',
      'Could improve action verbs in descriptions'
    ]
  };
}

/**
 * Generate synthetic training examples
 */
async function generateSyntheticExamples(count) {
  console.log(`\n🤖 Generating ${count} synthetic training examples...\n`);

  const examples = [];
  const templateKeys = Object.keys(RESUME_TEMPLATES);

  for (let i = 0; i < count; i++) {
    // Randomly select template (weighted towards intermediate)
    let templateKey;
    const rand = Math.random();
    if (rand < 0.2) templateKey = 'fresher';
    else if (rand < 0.7) templateKey = 'intermediate';
    else templateKey = 'senior';

    const template = RESUME_TEMPLATES[templateKey];
    const resumeText = generateResume(template, i);
    const analysis = generateAnalysis(template, resumeText);

    const example = {
      text_input: `Analyze this resume for ATS compatibility and provide detailed feedback.

RESUME TEXT:
${resumeText}

Provide your analysis in JSON format with overall score (0-100), individual scores for keywords/formatting/experience/skills, improvement suggestions with priority levels, keyword analysis with found/missing/suggested keywords, and lists of strengths and weaknesses.`,
      output: JSON.stringify(analysis, null, 2)
    };

    examples.push(example);

    if ((i + 1) % 50 === 0) {
      console.log(`   Generated ${i + 1}/${count} examples...`);
    }
  }

  console.log(`✅ Generated ${examples.length} synthetic examples\n`);
  return examples;
}

/**
 * Main function
 */
async function main() {
  const count = parseInt(process.argv[2]) || DEFAULT_COUNT;

  console.log('🚀 Synthetic Training Data Generator');
  console.log('=' .repeat(70));
  console.log(`Target: ${count} examples\n`);

  try {
    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Generate examples
    const examples = await generateSyntheticExamples(count);

    // Split into training and validation
    const validationSize = Math.floor(examples.length * 0.1);
    const validation = examples.slice(0, validationSize);
    const training = examples.slice(validationSize);

    // Save to JSONL
    const trainingJSONL = training.map(e => JSON.stringify(e)).join('\n');
    const validationJSONL = validation.map(e => JSON.stringify(e)).join('\n');

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'synthetic-training-data.jsonl'),
      trainingJSONL,
      'utf-8'
    );

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'synthetic-validation-data.jsonl'),
      validationJSONL,
      'utf-8'
    );

    // Save sample for inspection
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'synthetic-sample.json'),
      JSON.stringify(examples.slice(0, 3), null, 2),
      'utf-8'
    );

    console.log('✅ Files saved:');
    console.log(`   - synthetic-training-data.jsonl (${training.length} examples)`);
    console.log(`   - synthetic-validation-data.jsonl (${validation.length} examples)`);
    console.log(`   - synthetic-sample.json (3 sample examples)\n`);

    console.log('💡 Next steps:');
    console.log('   1. Review the sample data to ensure quality');
    console.log('   2. Combine with real data using: node src/scripts/combineTrainingData.js');
    console.log('   3. Upload to GCS and start fine-tuning\n');

  } catch (error) {
    console.error('❌ Error generating synthetic data:', error);
    process.exit(1);
  }
}

main();

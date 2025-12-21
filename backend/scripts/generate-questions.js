/**
 * AI-Assisted Question Generator
 *
 * This script uses Gemini AI to generate high-quality aptitude questions
 * for each domain, then saves them for human review before adding to production.
 *
 * Usage: node scripts/generate-questions.js <domain> <count>
 * Example: node scripts/generate-questions.js data-science 100
 */

const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');
const path = require('path');

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID || 'careercraftai-475216',
  location: 'us-central1'
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash'
});

const domainPrompts = {
  'data-science': `Generate high-quality Data Science aptitude questions covering:
- Statistics (mean, median, mode, probability, distributions)
- Python & Pandas (dataframes, operations, libraries)
- SQL (queries, joins, aggregations)
- Machine Learning (algorithms, metrics, concepts)
- Data Visualization (charts, best practices)

Each question should have:
- Clear question text
- 4 multiple choice options
- Correct answer index (0-3)
- Detailed explanation
- Difficulty level (easy/medium/hard)
- Specific topic tag

Return ONLY valid JSON array format.`,

  'web-development': `Generate high-quality Web Development questions covering:
- HTML/CSS (semantic HTML, selectors, flexbox, grid)
- JavaScript (ES6+, async/await, promises, DOM)
- React/Frontend Frameworks (hooks, state, components)
- Backend (Node.js, Express, REST APIs)
- Databases (SQL, NoSQL, queries)
- Security (XSS, CSRF, authentication)`,

  'cybersecurity': `Generate high-quality Cybersecurity questions covering:
- Network Security (protocols, firewalls, VPN)
- Cryptography (encryption, hashing, SSL/TLS)
- Attacks (phishing, DDoS, SQL injection, XSS)
- Authentication (MFA, OAuth, JWT)
- Penetration Testing (reconnaissance, exploitation)
- Security Tools (Wireshark, Metasploit, Nmap)`,

  'cloud-computing': `Generate high-quality Cloud Computing questions covering:
- Cloud Models (IaaS, PaaS, SaaS)
- AWS Services (EC2, S3, Lambda, RDS)
- Containers (Docker, Kubernetes)
- DevOps (CI/CD, automation)
- Scalability (load balancing, auto-scaling)
- Cloud Security (IAM, encryption)`,

  'mobile-development': `Generate high-quality Mobile Development questions covering:
- iOS Development (Swift, UIKit, SwiftUI)
- Android Development (Kotlin, Activities, Fragments)
- Cross-platform (React Native, Flutter)
- Mobile UI/UX (responsive design, navigation)
- APIs & Networking (REST, GraphQL)
- Performance & Optimization`,

  'ai-ml': `Generate high-quality AI/ML questions covering:
- Neural Networks (architecture, layers, activation functions)
- Deep Learning (CNNs, RNNs, transformers)
- NLP (tokenization, embeddings, sentiment analysis)
- Computer Vision (object detection, image classification)
- ML Libraries (TensorFlow, PyTorch, scikit-learn)
- Training (backpropagation, gradient descent, optimization)`,

  'faang': `Generate high-quality FAANG-style interview questions covering:
- Data Structures (arrays, trees, graphs, heaps)
- Algorithms (sorting, searching, dynamic programming)
- System Design (scalability, distributed systems)
- Complexity Analysis (Big O notation)
- Problem Solving (two pointers, sliding window)
- Advanced Topics (tries, union-find, topological sort)`,

  'startup': `Generate practical Startup-style questions covering:
- Full-stack Development (frontend + backend integration)
- Modern Frameworks (React, Node.js, databases)
- Agile & MVP concepts
- Deployment (Docker, cloud platforms)
- APIs & Microservices
- Performance Optimization`,

  'service-based': `Generate Service Company interview questions covering:
- Object-Oriented Programming (inheritance, polymorphism)
- Java/C++ fundamentals
- DBMS (normalization, transactions, ACID)
- Design Patterns (singleton, factory, observer)
- SDLC (waterfall, agile, testing)
- Core CS concepts (OS, networks, algorithms)`
};

const questionTemplate = {
  id: "generated-XXX",
  category: "logical", // or "quantitative" or "verbal"
  difficulty: "medium", // easy, medium, hard
  topic: "specific-topic",
  question: "Question text here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 0, // Index of correct answer (0-3)
  explanation: "Detailed explanation of why the answer is correct"
};

async function generateQuestions(domain, count) {
  console.log(`🤖 Generating ${count} questions for ${domain}...`);

  const prompt = `${domainPrompts[domain]}

Generate exactly ${Math.min(count, 20)} unique, high-quality multiple-choice questions.

CRITICAL REQUIREMENTS:
1. Each question must be factually correct
2. All 4 options should be plausible but only 1 correct
3. Avoid ambiguous wording
4. Include detailed explanations
5. Mix difficulty levels (easy, medium, hard)
6. Use specific topic tags

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "temp-001",
    "category": "logical",
    "difficulty": "medium",
    "topic": "specific-topic-name",
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct"
  }
]

NO additional text, ONLY the JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.candidates[0].content.parts[0].text;

    // Clean up response (remove markdown code blocks if present)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const questions = JSON.parse(text);

    // Fix category field to match frontend expectations
    questions.forEach(q => {
      // Map AI-generated categories to frontend format
      const categoryLower = (q.category || '').toLowerCase();
      if (categoryLower.includes('statistic') || categoryLower.includes('quantitative') ||
          categoryLower.includes('probability') || categoryLower.includes('math')) {
        q.category = 'quantitative';
      } else if (categoryLower.includes('verbal') || categoryLower.includes('language')) {
        q.category = 'verbal';
      } else {
        q.category = 'logical'; // Default for Python, SQL, ML, etc.
      }
    });

    console.log(`✅ Generated ${questions.length} questions`);
    return questions;

  } catch (error) {
    console.error('❌ Error generating questions:', error.message);
    return [];
  }
}

async function generateBatch(domain, totalCount) {
  const batchSize = 20; // Generate 20 at a time to stay within token limits
  const batches = Math.ceil(totalCount / batchSize);
  let allQuestions = [];

  for (let i = 0; i < batches; i++) {
    const count = Math.min(batchSize, totalCount - allQuestions.length);
    console.log(`\n📦 Batch ${i + 1}/${batches} (${count} questions)...`);

    const questions = await generateQuestions(domain, count);

    // Assign unique IDs
    questions.forEach((q, index) => {
      q.id = `${domain}-gen-${String(allQuestions.length + index + 1).padStart(3, '0')}`;
    });

    allQuestions = allQuestions.concat(questions);

    // Add delay to avoid rate limiting
    if (i < batches - 1) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Save to review file
  const outputPath = path.join(__dirname, `../generated-questions/${domain}-generated.json`);
  const dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));

  console.log(`\n✅ Generated ${allQuestions.length} questions`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`\n⚠️  IMPORTANT: Review these questions before adding to production!`);
  console.log(`   Check for accuracy, clarity, and correctness of answers.`);

  return allQuestions;
}

// Main execution
const domain = process.argv[2];
const count = parseInt(process.argv[3]) || 50;

if (!domain || !domainPrompts[domain]) {
  console.error('❌ Invalid domain. Available domains:');
  console.error(Object.keys(domainPrompts).join(', '));
  process.exit(1);
}

generateBatch(domain, count)
  .then(() => {
    console.log('\n🎉 Generation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

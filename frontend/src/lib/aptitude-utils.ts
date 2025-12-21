import { AptitudeQuestion } from '@/data/aptitude-questions'

export function shuffleArray<T>(array: T[]): T[] {
  if (!Array.isArray(array)) {
    console.error('shuffleArray received non-array:', array)
    return []
  }
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomQuestions(
  pool: AptitudeQuestion[],
  count: number
): AptitudeQuestion[] {
  const shuffled = shuffleArray(pool)
  return shuffled.slice(0, Math.min(count, pool.length))
}

export function calculateScore(
  questions: AptitudeQuestion[],
  userAnswers: (number | null)[]
): {
  correctCount: number
  incorrectCount: number
  totalQuestions: number
  percentage: number
  results: { questionId: string; correct: boolean; userAnswer: number | null; correctAnswer: number }[]
} {
  let correctCount = 0
  let incorrectCount = 0
  const results = questions.map((question, index) => {
    const userAnswer = userAnswers[index]
    const correct = userAnswer === question.correctAnswer
    if (correct) {
      correctCount++
    } else if (userAnswer !== null) {
      incorrectCount++
    }

    return {
      questionId: question.id,
      correct,
      userAnswer,
      correctAnswer: question.correctAnswer
    }
  })

  return {
    correctCount,
    incorrectCount,
    totalQuestions: questions.length,
    percentage: Math.round((correctCount / questions.length) * 100),
    results
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Domain mappings by category
const technicalDomains = ['frontend', 'backend', 'fullstack', 'data-science', 'mobile', 'ai-ml']
const itInfrastructureDomains = ['devops', 'cloud', 'database', 'cybersecurity', 'network', 'sysadmin']
const businessDomains = ['business-analyst', 'product-manager', 'project-manager', 'hr-talent', 'marketing', 'finance']
const companyPatterns = ['faang', 'startup', 'service-based']

// Get the API category key for backend
export function getCategoryKey(testId: number): string {
  // Technical domains (100-105)
  if (testId >= 100 && testId <= 105) {
    return technicalDomains[testId - 100] || 'frontend'
  }

  // IT & Infrastructure domains (200-205)
  if (testId >= 200 && testId <= 205) {
    return itInfrastructureDomains[testId - 200] || 'devops'
  }

  // Business & Management domains (300-305)
  if (testId >= 300 && testId <= 305) {
    return businessDomains[testId - 300] || 'business-analyst'
  }

  // Company pattern tests (400-402)
  if (testId >= 400 && testId <= 402) {
    return companyPatterns[testId - 400] || 'faang'
  }

  // Basic aptitude tests (1-3)
  switch (testId) {
    case 1:
      return 'logical-reasoning'
    case 2:
      return 'quantitative-aptitude'
    case 3:
      return 'verbal-ability'
    default:
      return 'logical-reasoning'
  }
}

// Get the question pool key for frontend data
export function getQuestionPoolKey(testId: number): string {
  // Technical domains (100-105)
  if (testId >= 100 && testId <= 105) {
    return technicalDomains[testId - 100] || 'frontend'
  }

  // IT & Infrastructure domains (200-205)
  if (testId >= 200 && testId <= 205) {
    return itInfrastructureDomains[testId - 200] || 'devops'
  }

  // Business & Management domains (300-305)
  if (testId >= 300 && testId <= 305) {
    return businessDomains[testId - 300] || 'business-analyst'
  }

  // Company pattern tests (400-402)
  if (testId >= 400 && testId <= 402) {
    return companyPatterns[testId - 400] || 'faang'
  }

  // Basic aptitude tests (1-3)
  switch (testId) {
    case 1:
      return 'logical'
    case 2:
      return 'quantitative'
    case 3:
      return 'verbal'
    default:
      return 'logical'
  }
}

// Title mappings
const technicalTitles = [
  'Software Engineering - Frontend',
  'Software Engineering - Backend',
  'Software Engineering - Full-Stack',
  'Data Science & Machine Learning',
  'Mobile Development',
  'AI & ML Engineering'
]

const itInfrastructureTitles = [
  'DevOps & Site Reliability Engineering',
  'Cloud Architecture',
  'Database Engineering',
  'Cybersecurity & Ethical Hacking',
  'Network Engineering',
  'System Administration'
]

const businessTitles = [
  'Business Analyst',
  'Product Manager',
  'Project Manager',
  'HR & Talent Acquisition',
  'Marketing & Growth',
  'Finance & Operations'
]

const companyPatternTitles = [
  { title: 'FAANG Companies', count: 20, duration: 30 },
  { title: 'Startups', count: 20, duration: 25 },
  { title: 'Service Companies', count: 20, duration: 25 }
]

export function getTestMetadata(testId: number) {
  // Technical domains (100-105)
  if (testId >= 100 && testId <= 105) {
    return {
      title: technicalTitles[testId - 100] || 'Technical Test',
      questionCount: 15,
      duration: 20 * 60
    }
  }

  // IT & Infrastructure domains (200-205)
  if (testId >= 200 && testId <= 205) {
    return {
      title: itInfrastructureTitles[testId - 200] || 'IT & Infrastructure Test',
      questionCount: 15,
      duration: 20 * 60
    }
  }

  // Business & Management domains (300-305)
  if (testId >= 300 && testId <= 305) {
    return {
      title: businessTitles[testId - 300] || 'Business & Management Test',
      questionCount: 15,
      duration: 20 * 60
    }
  }

  // Company pattern tests (400-402)
  if (testId >= 400 && testId <= 402) {
    const pattern = companyPatternTitles[testId - 400]
    return {
      title: pattern?.title || 'Company Pattern Test',
      questionCount: pattern?.count || 20,
      duration: (pattern?.duration || 25) * 60
    }
  }

  // Basic aptitude tests
  const metadata: { [key: number]: { title: string; questionCount: number; duration: number } } = {
    1: {
      title: "Logical Reasoning",
      questionCount: 15,
      duration: 20 * 60,
    },
    2: {
      title: "Quantitative Aptitude",
      questionCount: 20,
      duration: 25 * 60,
    },
    3: {
      title: "Verbal Ability",
      questionCount: 12,
      duration: 15 * 60,
    }
  }

  return metadata[testId] || metadata[1]
}

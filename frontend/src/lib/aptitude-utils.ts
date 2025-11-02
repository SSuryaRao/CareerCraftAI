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

// Get the API category key for backend
export function getCategoryKey(testId: number): 'logical-reasoning' | 'quantitative-aptitude' | 'verbal-ability' {
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
export function getQuestionPoolKey(testId: number): 'logical' | 'quantitative' | 'verbal' {
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

export function getTestMetadata(testId: number) {
  const metadata = {
    1: {
      title: "Logical Reasoning",
      questionCount: 15,
      duration: 20 * 60, // 20 minutes in seconds
    },
    2: {
      title: "Quantitative Aptitude",
      questionCount: 20,
      duration: 25 * 60, // 25 minutes in seconds
    },
    3: {
      title: "Verbal Ability",
      questionCount: 12,
      duration: 15 * 60, // 15 minutes in seconds
    }
  }

  return metadata[testId as keyof typeof metadata] || metadata[1]
}

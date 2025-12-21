import { AptitudeQuestion } from '@/data/aptitude-questions'

/**
 * Fetch questions from the API by category
 * @param category - The question category (e.g., 'data-science', 'web-development', 'ai-ml', 'faang', etc.)
 * @param options - Optional filters (difficulty, limit, offset)
 * @returns Array of questions
 */
export async function fetchQuestionsByCategory(
  category: string,
  options?: {
    difficulty?: 'easy' | 'medium' | 'hard'
    limit?: number
    offset?: number
  }
): Promise<AptitudeQuestion[]> {
  try {
    const params = new URLSearchParams({
      category,
      ...(options?.difficulty && { difficulty: options.difficulty }),
      ...(options?.limit && { limit: options.limit.toString() }),
      ...(options?.offset && { offset: options.offset.toString() }),
    })

    const response = await fetch(`/api/questions?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`)
    }

    const data = await response.json()
    return data.questions
  } catch (error) {
    console.error('Error fetching questions:', error)
    throw error
  }
}

/**
 * Get random questions from a pool
 * @param questions - The question pool
 * @param count - Number of questions to return
 * @returns Random subset of questions
 */
export function getRandomQuestions(
  questions: AptitudeQuestion[],
  count: number
): AptitudeQuestion[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, questions.length))
}

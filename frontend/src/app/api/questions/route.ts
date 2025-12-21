import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Map of category keys to JSON filenames
// Includes mappings for both frontend getCategoryKey() values and direct category names
const CATEGORY_FILE_MAP: { [key: string]: string } = {
  // Technical domains (testId 100-105)
  'frontend': 'web-development-generated.json',
  'backend': 'web-development-generated.json',
  'fullstack': 'web-development-generated.json',
  'data-science': 'data-science-generated.json',
  'mobile': 'mobile-development-generated.json',
  'ai-ml': 'ai-ml-generated.json',

  // IT & Infrastructure domains (testId 200-205)
  'devops': 'cloud-computing-generated.json',
  'cloud': 'cloud-computing-generated.json',
  'database': 'data-science-generated.json', // Fallback to data-science for now
  'cybersecurity': 'cybersecurity-generated.json',
  'network': 'cloud-computing-generated.json', // Fallback to cloud for now
  'sysadmin': 'cloud-computing-generated.json', // Fallback to cloud for now

  // Business & Management domains (testId 300-305)
  'business-analyst': 'service-based-generated.json', // Fallback for now
  'product-manager': 'startup-generated.json', // Fallback for now
  'project-manager': 'service-based-generated.json', // Fallback for now
  'hr-talent': 'service-based-generated.json', // Fallback for now
  'marketing': 'startup-generated.json', // Fallback for now
  'finance': 'service-based-generated.json', // Fallback for now

  // Company pattern tests (testId 400-402)
  'faang': 'faang-generated.json',
  'startup': 'startup-generated.json',
  'service-based': 'service-based-generated.json',

  // Legacy/direct category names
  'web-development': 'web-development-generated.json',
  'cloud-computing': 'cloud-computing-generated.json',
  'mobile-development': 'mobile-development-generated.json',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      )
    }

    // Get the corresponding filename
    const filename = CATEGORY_FILE_MAP[category]

    if (!filename) {
      return NextResponse.json(
        { error: `Invalid category: ${category}. Valid categories: ${Object.keys(CATEGORY_FILE_MAP).join(', ')}` },
        { status: 400 }
      )
    }

    // Read the JSON file from public/questions
    const filePath = path.join(process.cwd(), 'public', 'questions', filename)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `Questions file not found for category: ${category}` },
        { status: 404 }
      )
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    let questions = JSON.parse(fileContents)

    // Filter by difficulty if provided
    if (difficulty) {
      questions = questions.filter((q: any) => q.difficulty === difficulty)
    }

    // Apply pagination if provided
    const startIndex = offset ? parseInt(offset) : 0
    const endIndex = limit ? startIndex + parseInt(limit) : questions.length

    const paginatedQuestions = questions.slice(startIndex, endIndex)

    return NextResponse.json({
      category,
      total: questions.length,
      returned: paginatedQuestions.length,
      offset: startIndex,
      questions: paginatedQuestions,
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

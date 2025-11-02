// PDF text extraction is handled on the backend
// This file only contains client-side validation utilities

export function validatePDFFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' }
  }

  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    return { isValid: false, error: 'Please upload a PDF file only' }
  }

  // Check file size (limit to 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large. Please upload a file smaller than 10MB.' }
  }

  return { isValid: true }
}
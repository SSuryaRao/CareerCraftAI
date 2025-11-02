'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Download, Zap, Target, Star, TrendingUp, AlertCircle, CheckCircle, Award, Sparkles, BarChart3, Info, Copy, Check, ArrowRight } from 'lucide-react'
import { uploadAndAnalyzeResume, type BackendResumeAnalysis } from '@/lib/api/resume'
import { validatePDFFile } from '@/lib/pdf-utils'
import jsPDF from 'jspdf'
import ImproveResumeButton from '@/components/resume/ImproveResumeButton'
import Navbar from '@/components/layout/navbar'
import { motion, AnimatePresence } from 'framer-motion'

interface ProcessingStep {
  id: number
  label: string
  description: string
  status: 'pending' | 'processing' | 'completed'
}

// Animated Counter Component
function AnimatedCounter({ value, duration = 2000 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)

          const startTime = Date.now()
          const startValue = 0

          const updateCounter = () => {
            const elapsedTime = Date.now() - startTime
            const progress = Math.min(elapsedTime / duration, 1)

            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentValue = Math.floor(startValue + (value - startValue) * easeOutQuart)

            setCount(currentValue)

            if (progress < 1) {
              requestAnimationFrame(updateCounter)
            } else {
              setCount(value)
            }
          }

          requestAnimationFrame(updateCounter)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration, hasStarted])

  return <div ref={ref}>{count}</div>
}

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<BackendResumeAnalysis | null>(null)
  const [error, setError] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: 1, label: 'Uploading', description: 'Uploading your resume to secure servers', status: 'pending' },
    { id: 2, label: 'Extracting', description: 'Extracting text and analyzing structure', status: 'pending' },
    { id: 3, label: 'ATS Analysis', description: 'Running ATS compatibility checks', status: 'pending' },
    { id: 4, label: 'Generating Insights', description: 'Creating personalized suggestions', status: 'pending' },
    { id: 5, label: 'Finalizing', description: 'Preparing your detailed report', status: 'pending' },
  ])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const validation = validatePDFFile(file)
      if (validation.isValid) {
        setFile(file)
        setError('')
      } else {
        setError(validation.error || 'Invalid file')
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const updateProcessingStep = (stepId: number, status: 'pending' | 'processing' | 'completed') => {
    setProcessingSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, status } : step
    ))
  }

  const resetProcessingSteps = () => {
    setProcessingSteps([
      { id: 1, label: 'Uploading', description: 'Uploading your resume to secure servers', status: 'pending' },
      { id: 2, label: 'Extracting', description: 'Extracting text and analyzing structure', status: 'pending' },
      { id: 3, label: 'ATS Analysis', description: 'Running ATS compatibility checks', status: 'pending' },
      { id: 4, label: 'Generating Insights', description: 'Creating personalized suggestions', status: 'pending' },
      { id: 5, label: 'Finalizing', description: 'Preparing your detailed report', status: 'pending' },
    ])
  }

  const analyzeResume = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError('')
    setUploadProgress(0)
    resetProcessingSteps()

    try {
      // Step 1: Uploading (0-30%)
      updateProcessingStep(1, 'processing')

      const uploadMethod = 'file-picker'
      const result = await uploadAndAnalyzeResume(
        file,
        uploadMethod,
        (progress) => {
          setUploadProgress(progress * 0.3) // Upload is 30% of total

          if (progress >= 100) {
            updateProcessingStep(1, 'completed')

            // Step 2: Extracting (30-50%)
            updateProcessingStep(2, 'processing')
            setUploadProgress(40)

            // Simulate extraction time
            setTimeout(() => {
              updateProcessingStep(2, 'completed')

              // Step 3: ATS Analysis (50-70%)
              updateProcessingStep(3, 'processing')
              setUploadProgress(60)

              setTimeout(() => {
                updateProcessingStep(3, 'completed')

                // Step 4: Generating Insights (70-90%)
                updateProcessingStep(4, 'processing')
                setUploadProgress(80)

                setTimeout(() => {
                  updateProcessingStep(4, 'completed')

                  // Step 5: Finalizing (90-100%)
                  updateProcessingStep(5, 'processing')
                  setUploadProgress(95)
                }, 500)
              }, 500)
            }, 500)
          }
        }
      )

      // Complete all steps
      updateProcessingStep(5, 'completed')
      setAnalysis(result)
      setUploadProgress(100)
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to analyze resume. Please try again.'
      setError(errorMessage)
      console.error('Resume analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadReport = () => {
    if (!analysis) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPos = 20

    // Helper function to add text with wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      doc.setTextColor(color[0], color[1], color[2])
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
      doc.text(lines, margin, yPos)
      yPos += lines.length * fontSize * 0.5 + 5
    }

    // Check if new page is needed
    const checkNewPage = (spaceNeeded: number = 40) => {
      if (yPos + spaceNeeded > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        yPos = 20
      }
    }

    // Title
    doc.setFillColor(37, 99, 235) // Blue color
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Resume Analysis Report', pageWidth / 2, 25, { align: 'center' })
    yPos = 50

    // Overall ATS Score
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text('Overall ATS Score', margin, yPos)
    yPos += 10

    const score = analysis.atsAnalysis.overallScore
    const scoreColor = score >= 80 ? [16, 185, 129] : score >= 60 ? [245, 158, 11] : [239, 68, 68]
    doc.setFontSize(40)
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
    doc.text(`${score}/100`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 20

    const scoreLabel = score >= 80 ? 'Excellent! Highly ATS-friendly' :
                       score >= 60 ? 'Good! Some improvements needed' :
                       'Needs improvement to pass ATS systems'
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text(scoreLabel, pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // Section Scores
    checkNewPage(60)
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    addText('Section Breakdown', 14, true)
    yPos += 5

    const sections = [
      { name: 'Keywords', score: analysis.atsAnalysis.scores.keywords },
      { name: 'Formatting', score: analysis.atsAnalysis.scores.formatting },
      { name: 'Experience', score: analysis.atsAnalysis.scores.experience },
      { name: 'Skills', score: analysis.atsAnalysis.scores.skills }
    ]

    sections.forEach(section => {
      checkNewPage(15)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(section.name, margin, yPos)

      const sectionScoreColor = section.score >= 80 ? [16, 185, 129] :
                                section.score >= 60 ? [245, 158, 11] : [239, 68, 68]
      doc.setTextColor(sectionScoreColor[0], sectionScoreColor[1], sectionScoreColor[2])
      doc.text(`${section.score}/100`, pageWidth - margin - 20, yPos)

      // Progress bar
      doc.setFillColor(230, 230, 230)
      doc.rect(margin, yPos + 2, pageWidth - 2 * margin - 30, 4, 'F')
      doc.setFillColor(sectionScoreColor[0], sectionScoreColor[1], sectionScoreColor[2])
      doc.rect(margin, yPos + 2, (pageWidth - 2 * margin - 30) * (section.score / 100), 4, 'F')

      yPos += 12
    })

    yPos += 10

    // Suggestions
    checkNewPage(40)
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    addText('Improvement Suggestions', 14, true)
    yPos += 5

    analysis.atsAnalysis.suggestions.forEach((suggestion, index) => {
      checkNewPage(50)

      // Priority badge color
      const priorityColors = {
        critical: [239, 68, 68],
        high: [249, 115, 22],
        medium: [59, 130, 246],
        low: [34, 197, 94]
      }
      const priorityColor = priorityColors[suggestion.priority as keyof typeof priorityColors] || priorityColors.medium

      // Section title with priority
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(`${index + 1}. ${suggestion.section}`, margin, yPos)

      doc.setFontSize(9)
      doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2])
      doc.text(`[${suggestion.priority?.toUpperCase() || 'MEDIUM'}]`, pageWidth - margin - 30, yPos)
      yPos += 8

      // Issue
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(60, 60, 60)
      const issueLines = doc.splitTextToSize(suggestion.issue, pageWidth - 2 * margin)
      doc.text(issueLines, margin, yPos)
      yPos += issueLines.length * 5 + 5

      // Improvement suggestion
      checkNewPage(30)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('Suggested Improvement:', margin, yPos)
      yPos += 5

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(37, 99, 235)
      const improvementLines = doc.splitTextToSize(suggestion.improvement, pageWidth - 2 * margin)
      doc.text(improvementLines, margin, yPos)
      yPos += improvementLines.length * 4 + 10

      // Before/After if available
      if (suggestion.beforeAfter) {
        checkNewPage(40)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(220, 38, 38)
        doc.text('Before:', margin, yPos)
        yPos += 4

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const beforeLines = doc.splitTextToSize(suggestion.beforeAfter.before, pageWidth - 2 * margin)
        doc.text(beforeLines, margin, yPos)
        yPos += beforeLines.length * 4 + 6

        checkNewPage(20)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(16, 185, 129)
        doc.text('After:', margin, yPos)
        yPos += 4

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const afterLines = doc.splitTextToSize(suggestion.beforeAfter.after, pageWidth - 2 * margin)
        doc.text(afterLines, margin, yPos)
        yPos += afterLines.length * 4 + 10
      }

      yPos += 5
    })

    // Footer on last page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Generated by CareerCraft AI - Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    // Save the PDF
    const fileName = file?.name ? `${file.name.replace('.pdf', '')}_analysis_report.pdf` : 'resume_analysis_report.pdf'
    doc.save(fileName)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 60) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700'
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500'
    if (score >= 60) return 'bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500'
    return 'bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-400 dark:to-rose-500'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 dark:border-l-red-400 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10'
      case 'high': return 'border-l-orange-500 dark:border-l-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10'
      case 'medium': return 'border-l-blue-500 dark:border-l-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10'
      case 'low': return 'border-l-emerald-500 dark:border-l-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10'
      default: return 'border-l-gray-500 dark:border-l-gray-400 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <Navbar variant="light" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center mb-6"
          >
            <motion.div
              className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl shadow-lg"
              animate={{
                boxShadow: [
                  "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                  "0 20px 25px -5px rgba(99, 102, 241, 0.4)",
                  "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6"
          >
            AI Resume Analyzer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Get instant ATS score, detailed feedback, and actionable suggestions to optimize your resume
            and <span className="text-blue-600 dark:text-blue-400 font-semibold">land your dream job</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" />
              <span>ATS Optimized</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
              <span>Expert Analysis</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" />
              <span>Detailed Insights</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Upload Section */}
        {!analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <motion.div
              {...getRootProps()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                isDragActive
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg transform scale-105'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800/50 hover:shadow-md'
              } bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm`}
            >
              <input {...getInputProps()} />

              {/* Animated border effect */}
              {isDragActive && (
                <motion.div
                  className="absolute inset-0 border-2 border-blue-500 dark:border-blue-400 rounded-2xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              <motion.div
                animate={isDragActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isDragActive ? Infinity : 0 }}
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                  isDragActive ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30'
                }`}
              >
                <Upload className={`h-8 w-8 transition-colors ${isDragActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`} />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                {isDragActive
                  ? 'Release to upload your PDF resume'
                  : 'Drag and drop your PDF resume here, or click to select'}
              </p>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FileText className="mr-3 h-5 w-5" />
                Choose File
              </motion.div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 font-medium">
                Max file size: 10MB • Supported format: PDF
              </p>
            </motion.div>

            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                {/* Beautiful File Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-900/10 dark:to-purple-900/10 backdrop-blur-xl rounded-3xl border-2 border-gray-200/60 dark:border-gray-700/60 shadow-2xl">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none" />

                  {/* Animated background pattern */}
                  <motion.div
                    className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />

                  <div className="relative z-10 p-6 md:p-8">
                    {/* File Info and Button Container */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
                      {/* File Info Section */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* File Icon */}
                        <motion.div
                          initial={{ rotate: -10, scale: 0.8 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="relative flex-shrink-0"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-40" />
                          <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                            <FileText className="h-8 w-8 text-white" />
                          </div>
                        </motion.div>

                        {/* File Details */}
                        <div className="flex-1 min-w-0">
                          {/* File Name with Check Icon */}
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white truncate">
                              {file.name}
                            </h3>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              className="flex-shrink-0"
                            >
                              <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                            </motion.div>
                          </div>

                          {/* File Badges */}
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                              <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-200 dark:border-red-800">
                              <FileText className="h-3 w-3 text-red-600 dark:text-red-400" />
                              <span className="font-medium text-red-700 dark:text-red-300 text-xs">PDF Document</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="font-medium text-emerald-700 dark:text-emerald-300 text-xs">Ready to Analyze</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Analyze Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={analyzeResume}
                        disabled={isAnalyzing}
                        className="group relative overflow-hidden flex-shrink-0 w-full lg:w-auto"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 dark:from-emerald-500 dark:via-green-500 dark:to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
                        <div className="relative flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 hover:from-emerald-700 hover:to-green-700 dark:hover:from-emerald-600 dark:hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-2xl whitespace-nowrap">
                          {isAnalyzing ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                              <span>Analyzing...</span>
                              {uploadProgress > 0 && (
                                <span className="text-sm font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                                  {Math.round(uploadProgress)}%
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <Zap className="h-5 w-5" />
                              <span>Start Analysis</span>
                              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </div>
                      </motion.button>
                    </div>
                    {/* Divider */}
                    {isAnalyzing && (
                      <div className="border-t border-gray-200 dark:border-gray-700" />
                    )}

                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        {/* Overall Progress Bar */}
                        <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                                  <Zap className="w-5 h-5 text-white" />
                                </div>
                                <motion.div
                                  className="absolute inset-0 bg-emerald-400 rounded-full"
                                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">Analyzing Your Resume</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">AI is processing your document...</p>
                              </div>
                            </div>
                            <motion.div
                              key={Math.round(uploadProgress)}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                              className="text-right"
                            >
                              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                                {Math.round(uploadProgress)}%
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Complete</div>
                            </motion.div>
                          </div>
                          <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 dark:from-emerald-400 dark:via-green-400 dark:to-emerald-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              />
                            </motion.div>
                          </div>
                        </div>

                        {/* Detailed Processing Steps */}
                        <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                            <h4 className="font-bold text-base text-gray-900 dark:text-white">Processing Steps</h4>
                          </div>
                          <div className="space-y-4">
                            {processingSteps.map((step, index) => (
                              <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                                  step.status === 'completed'
                                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                                    : step.status === 'processing'
                                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-700 shadow-md'
                                    : 'bg-gray-50/50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                {/* Step Number/Icon */}
                                <motion.div
                                  animate={step.status === 'processing' ? { scale: [1, 1.15, 1] } : {}}
                                  transition={{ duration: 1, repeat: step.status === 'processing' ? Infinity : 0 }}
                                  className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg transition-all duration-300 ${
                                    step.status === 'completed'
                                      ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white'
                                      : step.status === 'processing'
                                      ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                  }`}
                                >
                                  {step.status === 'completed' ? (
                                    <CheckCircle className="w-6 h-6" />
                                  ) : step.status === 'processing' ? (
                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <span>{step.id}</span>
                                  )}

                                  {/* Pulsing ring for processing */}
                                  {step.status === 'processing' && (
                                    <motion.div
                                      className="absolute inset-0 border-2 border-blue-400 dark:border-blue-300 rounded-xl"
                                      animate={{ scale: [1, 1.3], opacity: [0.8, 0] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                  )}
                                </motion.div>

                                {/* Step Content */}
                                <div className="flex-1 min-w-0">
                                  <p className={`font-bold text-base mb-0.5 ${
                                    step.status === 'processing'
                                      ? 'text-blue-800 dark:text-blue-300'
                                      : step.status === 'completed'
                                      ? 'text-emerald-800 dark:text-emerald-300'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {step.label}
                                  </p>
                                  <p className={`text-sm ${
                                    step.status === 'processing'
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : step.status === 'completed'
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-gray-500 dark:text-gray-500'
                                  }`}>
                                    {step.description}
                                  </p>
                                </div>

                                {/* Status Badge */}
                                <div className="flex-shrink-0">
                                  {step.status === 'processing' ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                      className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                                    >
                                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </motion.div>
                                  ) : step.status === 'completed' ? (
                                    <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Done</span>
                                    </div>
                                  ) : null}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                    </div>

                        {/* Animated Tip */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={processingSteps.findIndex(s => s.status === 'processing')}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-indigo-900/10 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-lg"
                          >
                            {/* Animated background gradient */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-400/10 to-indigo-400/10 dark:from-purple-500/5 dark:via-blue-500/5 dark:to-indigo-500/5"
                              animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                              }}
                              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                              style={{ backgroundSize: '200% 200%' }}
                            />

                            <div className="relative flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg"
                                >
                                  <Sparkles className="w-6 h-6 text-white" />
                                </motion.div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-bold text-base text-purple-900 dark:text-purple-200">💡 Did you know?</h5>
                                  <div className="px-2 py-0.5 bg-purple-200 dark:bg-purple-800 rounded-full">
                                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-200">Pro Tip</span>
                                  </div>
                                </div>
                                <p className="text-sm leading-relaxed text-purple-800 dark:text-purple-200 font-medium">
                                  {processingSteps[0].status === 'processing' && "We use industry-standard ATS algorithms to score your resume, just like Fortune 500 companies."}
                                  {processingSteps[1].status === 'processing' && "Our AI analyzes formatting, structure, and content quality using machine learning trained on millions of resumes."}
                                  {processingSteps[2].status === 'processing' && "75% of resumes are rejected by ATS before reaching recruiters—make sure yours isn't one of them!"}
                                  {processingSteps[3].status === 'processing' && "Our suggestions are based on thousands of successful resumes from top tech companies and startups."}
                                  {processingSteps[4].status === 'processing' && "Your personalized report will include specific, actionable improvements to boost your ATS score by 30%+."}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            {/* ATS Score Overview - Enhanced */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 dark:from-black dark:via-slate-950 dark:to-gray-950 rounded-3xl shadow-2xl p-8 sm:p-12 border-2 border-slate-700/50 dark:border-slate-800/50"
            >
              {/* Enhanced Decorative gradients */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-purple-600/15 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/15 via-purple-600/10 to-pink-600/15 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-full blur-3xl" />

              <div className="relative z-10 text-center mb-12">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                  className="relative inline-block mb-8"
                >
                  {/* Larger circular score display with improved colors */}
                  <div className="relative w-56 h-56 sm:w-72 sm:h-72">
                    {/* Outer glow ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-full ${
                        analysis.atsAnalysis.overallScore >= 80 ? 'bg-gradient-to-br from-emerald-400/30 to-green-500/30' :
                        analysis.atsAnalysis.overallScore >= 60 ? 'bg-gradient-to-br from-cyan-400/30 via-blue-400/30 to-indigo-500/30' :
                        'bg-gradient-to-br from-red-400/30 to-rose-500/30'
                      } blur-3xl`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Main circle with enhanced border */}
                    <div className="absolute inset-6 rounded-full bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-gray-900/80 backdrop-blur-xl flex items-center justify-center shadow-2xl border-2 border-slate-700/50">
                      {/* Animated SVG ring with better visibility */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="42%"
                          stroke="currentColor"
                          strokeWidth="14"
                          fill="none"
                          className="text-slate-700/40"
                        />
                        <motion.circle
                          cx="50%"
                          cy="50%"
                          r="42%"
                          stroke="url(#scoreGradient)"
                          strokeWidth="14"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: analysis.atsAnalysis.overallScore / 100 }}
                          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                          strokeDasharray="1 1"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={
                              analysis.atsAnalysis.overallScore >= 80 ? '#34d399' :
                              analysis.atsAnalysis.overallScore >= 60 ? '#22d3ee' : '#f87171'
                            } />
                            <stop offset="50%" stopColor={
                              analysis.atsAnalysis.overallScore >= 80 ? '#10b981' :
                              analysis.atsAnalysis.overallScore >= 60 ? '#06b6d4' : '#ef4444'
                            } />
                            <stop offset="100%" stopColor={
                              analysis.atsAnalysis.overallScore >= 80 ? '#059669' :
                              analysis.atsAnalysis.overallScore >= 60 ? '#0891b2' : '#dc2626'
                            } />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Score number with improved color and glow */}
                      <div className="relative z-10 text-center">
                        <div className={`text-7xl sm:text-8xl font-black mb-1 ${
                          analysis.atsAnalysis.overallScore >= 80
                            ? 'text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.5)]'
                            : analysis.atsAnalysis.overallScore >= 60
                            ? 'text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]'
                            : 'text-red-400 drop-shadow-[0_0_25px_rgba(248,113,113,0.5)]'
                        }`}>
                          <AnimatedCounter value={analysis.atsAnalysis.overallScore} duration={1500} />
                        </div>
                        <div className="text-xl sm:text-2xl text-gray-400 font-semibold">/100</div>
                      </div>
                    </div>

                    {/* Award badge with enhanced styling */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 1, type: "spring", stiffness: 200 }}
                      className="absolute -top-6 -right-6"
                    >
                      <motion.div
                        animate={{
                          boxShadow: analysis.atsAnalysis.overallScore >= 80
                            ? ["0 0 0 0 rgba(52, 211, 153, 0.7)", "0 0 0 25px rgba(52, 211, 153, 0)", "0 0 0 0 rgba(52, 211, 153, 0)"]
                            : analysis.atsAnalysis.overallScore >= 60
                            ? ["0 0 0 0 rgba(34, 211, 238, 0.7)", "0 0 0 25px rgba(34, 211, 238, 0)", "0 0 0 0 rgba(34, 211, 238, 0)"]
                            : []
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className={`p-5 rounded-2xl shadow-2xl ${
                          analysis.atsAnalysis.overallScore >= 80
                            ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600'
                            : analysis.atsAnalysis.overallScore >= 60
                            ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600'
                            : 'bg-gradient-to-br from-red-500 via-red-600 to-rose-600'
                        }`}
                      >
                        <Award className="h-9 w-9 text-white" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight"
                >
                  Your ATS Score
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg sm:text-xl font-bold shadow-2xl border-2 ${
                    analysis.atsAnalysis.overallScore >= 80
                      ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 border-emerald-400/30 text-white'
                      : analysis.atsAnalysis.overallScore >= 60
                      ? 'bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 border-cyan-400/30 text-white'
                      : 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 border-red-400/30 text-white'
                  }`}
                >
                  <span className="text-2xl">
                    {analysis.atsAnalysis.overallScore >= 80 ? '🎉' :
                     analysis.atsAnalysis.overallScore >= 60 ? '👍' : '⚠️'}
                  </span>
                  {analysis.atsAnalysis.overallScore >= 80 ? 'Excellent! Highly ATS-friendly' :
                   analysis.atsAnalysis.overallScore >= 60 ? 'Good! Some improvements needed' :
                   'Needs improvement to pass ATS systems'}
                </motion.div>
              </div>

              {/* Improve Resume CTA - Featured */}
              {analysis.atsAnalysis.overallScore < 90 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="my-8"
                >
                  <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                    />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-white text-center md:text-left">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center justify-center md:justify-start">
                          <Sparkles className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                          Want to Improve Your Score?
                        </h3>
                        <p className="text-indigo-100 dark:text-indigo-200 text-base sm:text-lg">
                          Let AI apply all {analysis.atsAnalysis.suggestions.length} suggestions and generate an improved resume instantly
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <ImproveResumeButton
                          resumeId={analysis.resumeId}
                          currentScore={analysis.atsAnalysis.overallScore}
                          suggestionsCount={analysis.atsAnalysis.suggestions.length}
                          onImproveComplete={() => {
                            console.log('Resume improved successfully!');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Section Breakdown - Enhanced Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
                  { icon: Target, label: 'Keywords', score: analysis.atsAnalysis.scores.keywords, color: 'emerald', bgGradient: 'from-emerald-500/10 to-green-500/10', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
                  { icon: FileText, label: 'Formatting', score: analysis.atsAnalysis.scores.formatting, color: 'red', bgGradient: 'from-red-500/10 to-rose-500/10', iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400' },
                  { icon: TrendingUp, label: 'Experience', score: analysis.atsAnalysis.scores.experience, color: 'orange', bgGradient: 'from-orange-500/10 to-amber-500/10', iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
                  { icon: Star, label: 'Skills', score: analysis.atsAnalysis.scores.skills, color: 'blue', bgGradient: 'from-blue-500/10 to-indigo-500/10', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -12, scale: 1.05 }}
                    className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-gray-100 dark:border-gray-700"
                  >
                    {/* Gradient background overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        className={`inline-flex items-center justify-center p-4 rounded-2xl ${item.iconBg} mb-6 shadow-lg`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                      </motion.div>

                      {/* Label */}
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        {item.label}
                      </h4>

                      {/* Score - Large and prominent */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <div className={`text-5xl font-black ${getScoreColor(item.score)}`}>
                          <AnimatedCounter value={item.score} duration={1500} />
                        </div>
                        <div className="text-2xl font-semibold text-gray-400 dark:text-gray-500">/100</div>
                      </div>

                      {/* Progress bar - Sleeker design */}
                      <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                        <motion.div
                          className={`absolute inset-y-0 left-0 rounded-full ${getProgressColor(item.score)} shadow-lg`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1.5, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                        />
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, delay: 1.5 + index * 0.1, ease: "easeInOut" }}
                        />
                      </div>

                      {/* Status badge */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        item.score >= 80
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : item.score >= 60
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {item.score >= 80 ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Excellent
                          </>
                        ) : item.score >= 60 ? (
                          <>
                            <Info className="h-3 w-3" />
                            Good
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            Needs Work
                          </>
                        )}
                      </div>
                    </div>

                    {/* Hover effect - Animated corner accent */}
                    <motion.div
                      className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${item.bgGradient} rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Suggestions - Enhanced Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-br from-white via-gray-50/50 to-slate-50 dark:from-gray-800 dark:via-gray-850 dark:to-slate-900 rounded-3xl shadow-2xl p-6 sm:p-10 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-10 gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-4 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 dark:from-indigo-500 dark:via-blue-500 dark:to-purple-500 rounded-2xl shadow-xl"
                    whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Target className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                      Improvement Suggestions
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {analysis.atsAnalysis.suggestions.length} ways to enhance your resume
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {analysis.atsAnalysis.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.08 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="group"
                  >
                    <div className={`relative overflow-hidden rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                      suggestion.priority === 'critical'
                        ? 'bg-gradient-to-r from-red-50 via-rose-50 to-red-50 dark:from-red-950/40 dark:via-rose-950/30 dark:to-red-950/40 border-red-300 dark:border-red-800'
                        : suggestion.priority === 'high'
                        ? 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-orange-950/40 border-orange-300 dark:border-orange-800'
                        : suggestion.priority === 'medium'
                        ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-blue-950/40 border-blue-300 dark:border-blue-800'
                        : 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    }`}>
                      {/* Priority indicator bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                        suggestion.priority === 'critical' ? 'bg-gradient-to-b from-red-500 to-rose-600' :
                        suggestion.priority === 'high' ? 'bg-gradient-to-b from-orange-500 to-amber-600' :
                        suggestion.priority === 'medium' ? 'bg-gradient-to-b from-blue-500 to-indigo-600' :
                        'bg-gradient-to-b from-emerald-500 to-green-600'
                      }`} />

                      <div className="p-6 pl-8">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-black text-xl sm:text-2xl text-gray-900 dark:text-white">
                                {suggestion.section}
                              </h4>
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1 + index * 0.08, type: "spring" }}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
                                  suggestion.priority === 'critical' ? 'bg-red-600 dark:bg-red-500 text-white' :
                                  suggestion.priority === 'high' ? 'bg-orange-600 dark:bg-orange-500 text-white' :
                                  suggestion.priority === 'medium' ? 'bg-blue-600 dark:bg-blue-500 text-white' :
                                  'bg-emerald-600 dark:bg-emerald-500 text-white'
                                }`}>
                                {suggestion.priority || 'MEDIUM'}
                              </motion.span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setExpandedSuggestion(expandedSuggestion === index ? null : index)}
                            className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-600"
                            aria-label={expandedSuggestion === index ? "Collapse" : "Expand"}
                          >
                            <Info className={`h-5 w-5 transition-colors ${
                              suggestion.priority === 'critical' ? 'text-red-600 dark:text-red-400' :
                              suggestion.priority === 'high' ? 'text-orange-600 dark:text-orange-400' :
                              suggestion.priority === 'medium' ? 'text-blue-600 dark:text-blue-400' :
                              'text-emerald-600 dark:text-emerald-400'
                            }`} />
                          </motion.button>
                        </div>

                        {/* Issue description */}
                        <p className="text-gray-800 dark:text-gray-200 mb-5 text-base leading-relaxed font-medium">
                          {suggestion.issue}
                        </p>

                        {/* Suggested Improvement Box - Enhanced */}
                        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-md">
                          {/* Decorative corner */}
                          <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 ${
                            suggestion.priority === 'critical' ? 'bg-red-500' :
                            suggestion.priority === 'high' ? 'bg-orange-500' :
                            suggestion.priority === 'medium' ? 'bg-blue-500' :
                            'bg-emerald-500'
                          } rounded-bl-full`} />

                          <div className="relative flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                              >
                                <Sparkles className={`h-5 w-5 ${
                                  suggestion.priority === 'critical' ? 'text-red-600 dark:text-red-400' :
                                  suggestion.priority === 'high' ? 'text-orange-600 dark:text-orange-400' :
                                  suggestion.priority === 'medium' ? 'text-blue-600 dark:text-blue-400' :
                                  'text-emerald-600 dark:text-emerald-400'
                                }`} />
                              </motion.div>
                              <p className="font-black text-sm uppercase tracking-wide text-gray-900 dark:text-white">
                                Suggested Improvement
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => {
                                navigator.clipboard.writeText(suggestion.improvement)
                                setCopiedIndex(index)
                                setTimeout(() => setCopiedIndex(null), 2000)
                              }}
                              className={`p-2 rounded-lg shadow-sm transition-all ${
                                copiedIndex === index
                                  ? 'bg-emerald-100 dark:bg-emerald-900/50'
                                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                              aria-label="Copy suggestion"
                            >
                              <AnimatePresence mode="wait">
                                {copiedIndex === index ? (
                                  <motion.div
                                    key="check"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                  >
                                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="copy"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                  >
                                    <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium text-base">
                            {suggestion.improvement}
                          </p>
                        </div>

                        {/* Expandable Before/After */}
                        <AnimatePresence>
                          {(expandedSuggestion === index && suggestion.beforeAfter) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="grid md:grid-cols-2 gap-5 mt-5">
                                <motion.div
                                  className="bg-red-100 dark:bg-red-950/60 rounded-xl p-5 border-2 border-red-300 dark:border-red-800 shadow-md"
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <p className="text-sm font-black text-red-900 dark:text-red-200 mb-3 flex items-center uppercase tracking-wide">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Before
                                  </p>
                                  <p className="text-red-800 dark:text-red-300 text-sm leading-relaxed font-medium">
                                    {suggestion.beforeAfter.before}
                                  </p>
                                </motion.div>
                                <motion.div
                                  className="bg-emerald-100 dark:bg-emerald-950/60 rounded-xl p-5 border-2 border-emerald-300 dark:border-emerald-800 shadow-md"
                                  initial={{ x: 20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <p className="text-sm font-black text-emerald-900 dark:text-emerald-200 mb-3 flex items-center uppercase tracking-wide">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    After
                                  </p>
                                  <p className="text-emerald-800 dark:text-emerald-300 text-sm leading-relaxed font-medium">
                                    {suggestion.beforeAfter.after}
                                  </p>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAnalysis(null)
                  setFile(null)
                  setError('')
                  setUploadProgress(0)
                  setExpandedSuggestion(null)
                  setCopiedIndex(null)
                  resetProcessingSteps()
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                <Upload className="mr-3 h-5 w-5" />
                Analyze Another Resume
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadReport}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="mr-3 h-5 w-5" />
                Download Report
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
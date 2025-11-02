'use client'

import { useState } from 'react'
import { Download, Sparkles, TrendingUp, CheckCircle2, Loader2 } from 'lucide-react'
import { improveResume, type ImproveResumeResponse } from '@/lib/api/resume'
import { getAbsoluteResumeUrl } from '@/lib/utils/resumeUrl'
import { Button } from '@/components/ui/button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Progress } from '@/components/ui/progress'

interface ImproveResumeButtonProps {
  resumeId: string
  currentScore: number
  suggestionsCount: number
  onImproveComplete?: (result: ImproveResumeResponse) => void
}

export default function ImproveResumeButton({
  resumeId,
  currentScore,
  suggestionsCount,
  onImproveComplete
}: ImproveResumeButtonProps) {
  const [isImproving, setIsImproving] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [improvementResult, setImprovementResult] = useState<ImproveResumeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  const handleImprove = async () => {
    try {
      setIsImproving(true)
      setError(null)
      setStatus('Generating improved content...')

      // Call API to improve resume
      const result = await improveResume(resumeId, (progressStatus) => {
        setStatus(progressStatus)
      })

      setImprovementResult(result)
      setShowResult(true)
      setIsImproving(false)

      // Notify parent component
      if (onImproveComplete) {
        onImproveComplete(result)
      }

    } catch (err) {
      console.error('Resume improvement error:', err)
      setError(err instanceof Error ? err.message : 'Failed to improve resume')
      setIsImproving(false)
    }
  }

  const handleDownload = () => {
    if (improvementResult?.download.url) {
      const absoluteUrl = getAbsoluteResumeUrl(improvementResult.download.url);
      if (absoluteUrl) {
        window.open(absoluteUrl, '_blank');
      }
    }
  }

  return (
    <>
      {/* Improve Resume Button */}
      <Button
        onClick={handleImprove}
        disabled={isImproving}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
      >
        {isImproving ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Improving...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Improve Resume with AI
          </>
        )}
      </Button>

      {/* Processing Modal - Enhanced with Dark Mode */}
      <Modal open={isImproving} onOpenChange={() => {}}>
        <ModalContent className="sm:max-w-lg bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-3 text-2xl font-black text-gray-900 dark:text-white">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-700 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              Improving Your Resume
            </ModalTitle>
            <ModalDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
              Please wait while AI enhances your resume with powerful improvements...
            </ModalDescription>
          </ModalHeader>

          <div className="space-y-6 py-6">
            {/* Status indicator */}
            <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
              <div className="relative">
                <Loader2 className="h-7 w-7 animate-spin text-purple-600 dark:text-purple-400" />
                <div className="absolute inset-0 h-7 w-7 animate-ping text-purple-400 dark:text-purple-500 opacity-20">
                  <Loader2 className="h-7 w-7" />
                </div>
              </div>
              <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{status}</span>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Processing...</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">66%</span>
              </div>
              <Progress value={isImproving ? 66 : 0} className="h-3 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Improvements list */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-blue-950/40 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <p className="text-base font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Applying {suggestionsCount} AI-Powered Improvements:
              </p>
              <ul className="text-sm text-indigo-800 dark:text-indigo-300 space-y-2.5 ml-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                  <span className="font-medium">Adding missing keywords and optimizing content</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                  <span className="font-medium">Enhancing action verbs for impact</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  <span className="font-medium">Improving formatting and structure</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></div>
                  <span className="font-medium">Optimizing for ATS compatibility</span>
                </li>
              </ul>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Results Modal - Enhanced with Dark Mode */}
      <Modal open={showResult} onOpenChange={setShowResult}>
        <ModalContent className="sm:max-w-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-3 text-3xl font-black text-gray-900 dark:text-white">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 rounded-2xl shadow-lg">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
              Resume Improved Successfully!
            </ModalTitle>
            <ModalDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
              Your resume has been enhanced with AI-powered improvements
            </ModalDescription>
          </ModalHeader>

          {improvementResult && (
            <div className="space-y-6 py-6">
              {/* Score Improvement - Enhanced */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 dark:from-emerald-950/40 dark:via-green-950/40 dark:to-blue-950/40 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-3xl" />

                <div className="relative grid grid-cols-3 gap-6 mb-6">
                  {/* Original Score */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Original Score</p>
                    <p className="text-5xl font-black text-gray-800 dark:text-gray-200">
                      {improvementResult.improvement.originalScore}
                      <span className="text-lg text-gray-500 dark:text-gray-500">/100</span>
                    </p>
                  </div>

                  {/* Score Increase */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 rounded-2xl shadow-lg mb-2">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      +{improvementResult.improvement.scoreIncrease}
                    </p>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {improvementResult.improvement.percentageIncrease}% increase
                    </p>
                  </div>

                  {/* Improved Score */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Improved Score</p>
                    <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                      {improvementResult.improvement.improvedScore}
                      <span className="text-lg text-gray-500 dark:text-gray-500">/100</span>
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-700 dark:text-gray-300">ATS Compatibility</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{improvementResult.improvement.improvedScore}%</span>
                  </div>
                  <Progress
                    value={improvementResult.improvement.improvedScore}
                    className="h-4 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Stats - Enhanced */}
              <div className="grid grid-cols-2 gap-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl" />
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3 uppercase tracking-wide">
                    Suggestions Applied
                  </p>
                  <p className="text-4xl font-black text-blue-600 dark:text-blue-400">
                    {improvementResult.appliedSuggestions}
                  </p>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mt-1">
                    AI-powered improvements
                  </p>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl" />
                  <p className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-3 uppercase tracking-wide">
                    Processing Time
                  </p>
                  <p className="text-4xl font-black text-purple-600 dark:text-purple-400">
                    {(improvementResult.processingTime / 1000).toFixed(1)}s
                  </p>
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mt-1">
                    Lightning fast AI
                  </p>
                </div>
              </div>

              {/* Download Button - Enhanced */}
              <div className="flex gap-4">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 dark:from-emerald-500 dark:via-green-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:via-green-600 dark:hover:to-emerald-700 text-white font-bold text-lg py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200"
                >
                  <Download className="mr-3 h-6 w-6" />
                  Download Improved Resume
                </Button>

                <Button
                  onClick={() => setShowResult(false)}
                  variant="outline"
                  className="px-8 py-6 text-base font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Close
                </Button>
              </div>

              {/* Success Message - Enhanced */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 shadow-lg">
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-2">
                      Your Resume is Ready! 🎉
                    </p>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      Your improved resume has been generated with enhanced keywords, better formatting,
                      and optimized content for ATS systems. Download and use it for your job applications!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Error Alert */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </>
  )
}

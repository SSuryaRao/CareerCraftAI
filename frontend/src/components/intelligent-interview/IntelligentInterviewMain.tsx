'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { DomainSelector } from './DomainSelector'
import { InterviewSession } from './InterviewSession'
import { SessionResults } from './SessionResults'
import { intelligentInterviewApi, SessionData, Answer } from '@/lib/intelligentInterviewApi'
import toast from 'react-hot-toast'

type Mode = 'selection' | 'interview' | 'results'

export function IntelligentInterviewMain() {
  const { user } = useAuth()
  const [mode, setMode] = useState<Mode>('selection')
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(false)

  const handleStartSession = async (
    domainId: string,
    level: string,
    questionCount: number,
    analysisMode: 'standard' | 'advanced'
  ) => {
    if (!user) {
      toast.error('Please sign in to start an interview')
      return
    }

    setLoading(true)
    try {
      const token = await user.getIdToken();
      const session = await intelligentInterviewApi.startSession(
        user.uid,
        domainId,
        level,
        questionCount,
        analysisMode,
        token
      )

      setSessionData(session)
      setMode('interview')
      toast.success('Interview session started!')
    } catch (error) {
      console.error('Error starting session:', error)
      toast.error('Failed to start interview session')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteInterview = async (completedAnswers: Answer[]) => {
    if (!user || !sessionData) return

    setAnswers(completedAnswers)
    setMode('results')

    // Save session in background
    try {
      await intelligentInterviewApi.saveSession(user.uid, sessionData, completedAnswers)
      toast.success('Interview session saved!')
    } catch (error) {
      console.error('Error saving session:', error)
      toast.error('Failed to save session')
    }
  }

  const handleCancelInterview = () => {
    if (confirm('Are you sure you want to end this interview? Your progress will be lost.')) {
      setMode('selection')
      setSessionData(null)
      setAnswers([])
    }
  }

  const handleRestartInterview = () => {
    setMode('selection')
    setSessionData(null)
    setAnswers([])
  }

  const handleNewSession = () => {
    setMode('selection')
    setSessionData(null)
    setAnswers([])
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your interview session...</p>
      </div>
    )
  }

  return (
    <div>
      {mode === 'selection' && (
        <DomainSelector onStartSession={handleStartSession} />
      )}

      {mode === 'interview' && sessionData && user && (
        <InterviewSession
          sessionData={sessionData}
          userId={user.uid}
          onComplete={handleCompleteInterview}
          onCancel={handleCancelInterview}
        />
      )}

      {mode === 'results' && sessionData && answers.length > 0 && (
        <SessionResults
          sessionData={sessionData}
          answers={answers}
          onRestart={handleRestartInterview}
          onNewSession={handleNewSession}
        />
      )}
    </div>
  )
}

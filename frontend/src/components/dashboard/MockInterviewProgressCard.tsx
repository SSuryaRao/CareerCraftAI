import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  MessageSquareText,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  ChevronRight,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface PerformanceByType {
  testsTaken: number
  avgScore: number
  bestScore: number
  lastScore: number
  improvement: number
}

interface MockInterviewStatsProps {
  totalInterviews: number
  totalAptitudeTests: number
  avgAptitudeScore: number
  performanceByType: {
    'logical-reasoning'?: PerformanceByType
    'quantitative-aptitude'?: PerformanceByType
    'verbal-ability'?: PerformanceByType
  }
  strongCategories: string[]
  weakCategories: string[]
  recentInterviews: number
  recentTests: number
}

export function MockInterviewProgressCard({
  totalInterviews,
  totalAptitudeTests,
  avgAptitudeScore,
  performanceByType,
  strongCategories,
  weakCategories,
  recentInterviews,
  recentTests
}: MockInterviewStatsProps) {
  const router = useRouter()

  const testTypes = [
    {
      key: 'logical-reasoning',
      label: 'Logical Reasoning',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      key: 'quantitative-aptitude',
      label: 'Quantitative',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      key: 'verbal-ability',
      label: 'Verbal Ability',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  ]

  const hasActivity = totalInterviews > 0 || totalAptitudeTests > 0

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mr-3 shadow-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Mock Interview Stats</h3>
            <p className="text-sm text-gray-600">Practice makes perfect</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/mock-interview')}
          className="hover:bg-blue-100"
        >
          Practice
        </Button>
      </div>

      {!hasActivity ? (
        <div className="text-center py-8">
          <BrainCircuit className="w-12 h-12 text-blue-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Start practicing interviews and aptitude tests</p>
          <Button
            onClick={() => router.push('/mock-interview')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            Start Practicing
          </Button>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-xl border border-blue-100">
              <MessageSquareText className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">{totalInterviews}</div>
              <div className="text-xs text-gray-600">Interviews</div>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-blue-100">
              <BrainCircuit className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">{totalAptitudeTests}</div>
              <div className="text-xs text-gray-600">Tests</div>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-blue-100">
              <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-600">{avgAptitudeScore}%</div>
              <div className="text-xs text-gray-600">Avg Score</div>
            </div>
          </div>

          {/* Performance by Test Type */}
          {totalAptitudeTests > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Test Performance</h4>
              {testTypes.map((testType, index) => {
                const performance = performanceByType[testType.key as keyof typeof performanceByType]
                if (!performance) return null

                return (
                  <motion.div
                    key={testType.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 ${testType.bgColor} rounded-xl border border-blue-100`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${testType.textColor}`}>
                        {testType.label}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${testType.textColor}`}>
                          {performance.avgScore}%
                        </span>
                        {performance.improvement !== 0 && (
                          <div className={`flex items-center text-xs ${
                            performance.improvement > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {performance.improvement > 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {Math.abs(performance.improvement)}%
                          </div>
                        )}
                      </div>
                    </div>
                    <Progress value={performance.avgScore} className="h-2" />
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>{performance.testsTaken} test{performance.testsTaken > 1 ? 's' : ''}</span>
                      <span>Best: {performance.bestScore}%</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Strong & Weak Areas */}
          {(strongCategories.length > 0 || weakCategories.length > 0) && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {strongCategories.length > 0 && (
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <h5 className="text-xs font-semibold text-green-800">Strong Areas</h5>
                  </div>
                  <div className="space-y-1">
                    {strongCategories.slice(0, 3).map((category, index) => (
                      <div key={index} className="text-xs text-green-700 capitalize truncate">
                        • {category.replace(/-/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {weakCategories.length > 0 && (
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-center mb-2">
                    <Target className="w-4 h-4 text-orange-600 mr-2" />
                    <h5 className="text-xs font-semibold text-orange-800">Improve</h5>
                  </div>
                  <div className="space-y-1">
                    {weakCategories.slice(0, 3).map((category, index) => (
                      <div key={index} className="text-xs text-orange-700 capitalize truncate">
                        • {category.replace(/-/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Activity */}
          <div className="p-4 bg-white rounded-xl border border-blue-200">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">This Week</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">
                  {recentInterviews} interview{recentInterviews !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">
                  {recentTests} test{recentTests !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <Button
            variant="ghost"
            className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => router.push('/mock-interview')}
          >
            View Detailed Analytics
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </>
      )}
    </Card>
  )
}

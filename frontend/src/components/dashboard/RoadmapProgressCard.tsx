import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MapPin, ChevronRight, Target, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Roadmap {
  careerDomain: string
  skillLevel: string
  totalMilestones: number
  completedMilestones: number
  progressPercentage: number
  lastUpdated: string
}

interface RoadmapProgressCardProps {
  roadmaps: Roadmap[]
  totalMilestones: number
  completedMilestones: number
  percentage: number
  recentActivity: number
}

export function RoadmapProgressCard({
  roadmaps,
  totalMilestones,
  completedMilestones,
  percentage,
  recentActivity
}: RoadmapProgressCardProps) {
  const router = useRouter()

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'advanced':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mr-3 shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Roadmap Progress</h3>
            <p className="text-sm text-gray-600">Track your learning paths</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/solutions/roadmap')}
          className="hover:bg-purple-100"
        >
          View All
        </Button>
      </div>

      {roadmaps.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-purple-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No active roadmaps yet</p>
          <Button
            onClick={() => router.push('/solutions/roadmap')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            Create Your First Roadmap
          </Button>
        </div>
      ) : (
        <>
          {/* Overall Progress */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-purple-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Overall Completion</span>
              <span className="text-2xl font-bold text-purple-600">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3 mb-2" />
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>{completedMilestones} of {totalMilestones} milestones completed</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {recentActivity} this week
              </Badge>
            </div>
          </div>

          {/* Active Roadmaps */}
          <div className="space-y-3">
            {roadmaps.slice(0, 3).map((roadmap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white rounded-xl border border-purple-100 hover:border-purple-300 transition-all cursor-pointer group"
                onClick={() => router.push('/solutions/roadmap')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 capitalize group-hover:text-purple-600 transition-colors">
                      {roadmap.careerDomain.replace(/-/g, ' ')}
                    </h4>
                    <Badge
                      className={`text-xs mt-1 ${getSkillLevelColor(roadmap.skillLevel)}`}
                    >
                      {roadmap.skillLevel}
                    </Badge>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {roadmap.completedMilestones}/{roadmap.totalMilestones} milestones
                    </span>
                    <span className="font-bold text-purple-600">
                      {roadmap.progressPercentage}%
                    </span>
                  </div>
                  <Progress value={roadmap.progressPercentage} className="h-2" />
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    Updated {new Date(roadmap.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {roadmaps.length > 3 && (
            <Button
              variant="ghost"
              className="w-full mt-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={() => router.push('/solutions/roadmap')}
            >
              View {roadmaps.length - 3} More Roadmap{roadmaps.length - 3 > 1 ? 's' : ''}
            </Button>
          )}
        </>
      )}
    </Card>
  )
}

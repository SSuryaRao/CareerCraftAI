'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  IndianRupee, 
  Briefcase, 
  TrendingUp, 
  Target,
  BarChart3,
  Users,
  Calendar,
  Star,
  Award
} from 'lucide-react'

interface ROIData {
  estimatedTimeWeeks: number
  estimatedInvestment: number
  expectedSalaryRange: {
    min: number
    max: number
    average: number
  }
  roiSummary: {
    multiplier: number
    paybackPeriodMonths: number
    description: string
  }
  marketInsights: {
    demand: string
    growthRate: string
    avgTimeToJob: number
  }
  keySkills: string[]
  explanation: string
}

interface ROISummaryCardProps {
  roiData: ROIData
  domain: string
}

export function ROISummaryCard({ roiData, domain }: ROISummaryCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} LPA`
    }
    return `₹${(amount / 1000).toFixed(0)}K`
  }

  const getDemandColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'extremely high': return 'from-red-500 to-pink-500'
      case 'very high': return 'from-orange-500 to-yellow-500'
      case 'high': return 'from-green-500 to-emerald-500'
      case 'moderate': return 'from-blue-500 to-indigo-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const getDemandBadgeColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'extremely high': return 'bg-red-100 text-red-800 border-red-300'
      case 'very high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'high': return 'bg-green-100 text-green-800 border-green-300'
      case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="relative p-8 pb-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a855f7' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")` 
               }} />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-40 animate-pulse" />
                  <div className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                    💰 Skill-to-Salary ROI Calculator
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Investment Analysis for <span className="font-semibold text-purple-600 dark:text-purple-400">{domain}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`px-3 py-1 font-bold border ${getDemandBadgeColor(roiData.marketInsights.demand)}`}>
                  🔥 {roiData.marketInsights.demand} Demand
                </Badge>
              </div>
            </div>

            {/* ROI Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Estimated Time */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{roiData.estimatedTimeWeeks}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">weeks</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">⏳ Estimated Time</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Learning Duration</div>
                </div>
              </div>

              {/* Investment */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <IndianRupee className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{(roiData.estimatedInvestment/1000).toFixed(0)}K</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">investment</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">💰 Total Investment</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Course & Resources</div>
                </div>
              </div>

              {/* Expected Salary */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-lg">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(roiData.expectedSalaryRange.min)}-{formatCurrency(roiData.expectedSalaryRange.max)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">salary range</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">💼 Expected Salary</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">After Completion</div>
                </div>
              </div>

              {/* ROI Summary */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{roiData.roiSummary.multiplier}x</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">return</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">📈 ROI Summary</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">In 2 Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="px-8 pb-8">
          {/* Market Insights */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              🎯 Market Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">Market Demand</span>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{roiData.marketInsights.demand}</div>
                <div className={`mt-2 h-2 rounded-full bg-gradient-to-r ${getDemandColor(roiData.marketInsights.demand)} shadow-inner`} />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-800 dark:text-green-300">Job Growth Rate</span>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{roiData.marketInsights.growthRate}</div>
                <div className="mt-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-inner" style={{ width: '85%' }} />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Avg. Time to Job</span>
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{roiData.marketInsights.avgTimeToJob} months</div>
                <div className="mt-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-inner" style={{ width: '70%' }} />
              </div>
            </div>
          </div>

          {/* Key Skills */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              🛠️ Key Skills You'll Master
            </h4>
            <div className="flex flex-wrap gap-3">
              {roiData.keySkills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all duration-300 cursor-default font-medium shadow-sm">
                    <Star className="w-3 h-3 mr-1" />
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ROI Explanation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 rounded-2xl opacity-50" />
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 dark:border-purple-800/30 shadow-inner">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    🚀 Your ROI Journey Summary
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                    {roiData.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual ROI Chart */}
          <div className="mt-8">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              📊 Investment vs Returns Visualization
            </h4>
            <div className="relative">
              <div className="flex items-end justify-between h-32 bg-gradient-to-t from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="text-center flex-1">
                  <div
                    className="bg-gradient-to-t from-red-400 to-red-500 rounded-t-lg shadow-lg mx-2"
                    style={{ height: '30%', minHeight: '20px' }}
                  />
                  <div className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Investment</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">₹{(roiData.estimatedInvestment/1000).toFixed(0)}K</div>
                </div>
                <div className="text-center flex-1">
                  <div
                    className="bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg shadow-lg mx-2"
                    style={{ height: '100%' }}
                  />
                  <div className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">2-Year Returns</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(roiData.expectedSalaryRange.average * 2)}</div>
                </div>
                <div className="text-center flex-1">
                  <div
                    className="bg-gradient-to-t from-purple-400 to-purple-500 rounded-t-lg shadow-lg mx-2"
                    style={{ height: '85%' }}
                  />
                  <div className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Net Profit</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(roiData.expectedSalaryRange.average * 2 - roiData.estimatedInvestment)}</div>
                </div>
              </div>
              <div className="text-center mt-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-800 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  🎉 {roiData.roiSummary.multiplier}x Return on Investment!
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
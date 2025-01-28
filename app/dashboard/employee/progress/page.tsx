'use client'

import { useState } from 'react'
import ProgressChart from '@/components/learning/ProgressChart'
import AchievementCard from '@/components/learning/AchievementCard'

export default function EmployeeProgress() {
  const [progressData] = useState({
    learningHours: [4, 6, 7.5, 5],
    completionRate: 65,
    averageScore: 85,
    learningStreak: 7
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Progress</h1>
          <p className="text-gray-500 mt-1">Track your learning journey</p>
        </div>
      </div>

      {/* Learning Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Activity</h2>
        <div className="h-64">
          <ProgressChart data={progressData.learningHours} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AchievementCard
          title="Course Completion"
          value="5/8"
          description="Courses completed"
        />
        <AchievementCard
          title="Average Score"
          value="85%"
          description="Across all assessments"
        />
        <AchievementCard
          title="Learning Streak"
          value={`${progressData.learningStreak} days`}
          description="Keep it up!"
        />
      </div>
    </div>
  )
} 
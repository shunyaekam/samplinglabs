'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import ProgressChart from '@/components/learning/ProgressChart'
import AchievementCard from '@/components/learning/AchievementCard'

export default function EmployeeProgress() {
  const [progressData] = useState({
    completedCourses: 5,
    totalCourses: 8,
    averageScore: 85,
    learningStreak: 7,
    timeSpent: '24h 30m',
    certificates: 3,
  })

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-600 mt-1">Track your learning journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold mb-4">Learning Activity</h2>
          <ProgressChart />
        </div>
        <div className="space-y-6">
          <AchievementCard
            title="Course Completion"
            value={`${progressData.completedCourses}/${progressData.totalCourses}`}
            description="Courses completed"
          />
          <AchievementCard
            title="Average Score"
            value={`${progressData.averageScore}%`}
            description="Across all assessments"
          />
          <AchievementCard
            title="Learning Streak"
            value={`${progressData.learningStreak} days`}
            description="Keep it up!"
          />
        </div>
      </div>
    </DashboardLayout>
  )
} 
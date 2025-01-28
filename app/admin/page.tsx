'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Users, BookOpen, Award } from 'lucide-react'

type AnalyticsData = {
  activeUsers: number
  completionRate: number
  totalCourses: number
  totalEnrollments: number
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    activeUsers: 0,
    completionRate: 0,
    totalCourses: 0,
    totalEnrollments: 0
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const response = await fetch('/api/admin/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const stats = [
    {
      name: 'Active Users',
      value: analytics.activeUsers,
      icon: <Users className="w-6 h-6" />,
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Courses',
      value: analytics.totalCourses,
      icon: <BookOpen className="w-6 h-6" />,
      change: '+4',
      changeType: 'positive'
    },
    {
      name: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      icon: <Award className="w-6 h-6" />,
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      name: 'Total Enrollments',
      value: analytics.totalEnrollments,
      icon: <BarChart3 className="w-6 h-6" />,
      change: '+18%',
      changeType: 'positive'
    }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                {stat.icon}
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Add charts or other analytics visualizations here */}
    </div>
  )
} 
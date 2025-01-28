'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import AnalyticsChart from '@/components/admin/AnalyticsChart'
import EmployeeList from '@/components/admin/EmployeeList'

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('month')

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Learning Analytics</h1>
        <p className="text-gray-600 mt-1">Detailed insights into learning patterns</p>
      </div>

      <div className="mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold mb-4">Learning Engagement</h2>
          <AnalyticsChart timeRange={timeRange} />
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Top Performers</h2>
          <EmployeeList />
        </div>
      </div>
    </DashboardLayout>
  )
} 
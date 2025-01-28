'use client'

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type AnalyticsData = {
  activeUsers: number[]
  completions: number[]
  enrollments: number[]
  timestamps: string[]
}

export default function RealTimeAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    activeUsers: [],
    completions: [],
    enrollments: [],
    timestamps: []
  })

  useEffect(() => {
    fetchInitialData()
    const interval = setInterval(fetchLatestData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function fetchInitialData() {
    try {
      const response = await fetch('/api/admin/analytics/realtime?hours=24')
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  async function fetchLatestData() {
    try {
      const response = await fetch('/api/admin/analytics/realtime?latest=true')
      if (response.ok) {
        const newData = await response.json()
        setData(prev => ({
          activeUsers: [...prev.activeUsers.slice(1), newData.activeUsers],
          completions: [...prev.completions.slice(1), newData.completions],
          enrollments: [...prev.enrollments.slice(1), newData.enrollments],
          timestamps: [...prev.timestamps.slice(1), newData.timestamp]
        }))
      }
    } catch (error) {
      console.error('Error fetching latest analytics:', error)
    }
  }

  const chartData = {
    labels: data.timestamps.map(t => new Date(t).toLocaleTimeString()),
    datasets: [
      {
        label: 'Active Users',
        data: data.activeUsers,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Course Completions',
        data: data.completions,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      },
      {
        label: 'New Enrollments',
        data: data.enrollments,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Real-time Learning Analytics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line data={chartData} options={options} />
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">Current Active Users</div>
          <div className="text-2xl font-semibold text-gray-900">
            {data.activeUsers[data.activeUsers.length - 1] || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">Today's Completions</div>
          <div className="text-2xl font-semibold text-gray-900">
            {data.completions[data.completions.length - 1] || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">Today's Enrollments</div>
          <div className="text-2xl font-semibold text-gray-900">
            {data.enrollments[data.enrollments.length - 1] || 0}
          </div>
        </div>
      </div>
    </div>
  )
} 
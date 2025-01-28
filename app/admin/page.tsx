'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import CourseContentUploader from '@/components/admin/CourseContentUploader'
import EnterpriseManager from '@/components/admin/EnterpriseManager'
import { useState, useEffect } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

type AnalyticsData = {
  activeUsers: number
  completionRate: number
  totalCourses: number
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('courses')
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    activeUsers: 0,
    completionRate: 0,
    totalCourses: 0
  })

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/admin/analytics')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      }
    }

    if (session?.user) {
      fetchAnalytics()
    }
  }, [session])

  if (!session?.user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {['Courses', 'Analytics', 'Enterprises'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeTab === tab.toLowerCase()
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex items-center">
                <div className="relative">
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-md"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">
                      {session.user.email}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'courses' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Course Content Management</h2>
            <CourseContentUploader />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {analytics.activeUsers}
                </p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-500">Average Completion Rate</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {analytics.completionRate}%
                </p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {analytics.totalCourses}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'enterprises' && (
          <div className="bg-white shadow rounded-lg p-6">
            <EnterpriseManager />
          </div>
        )}
      </div>
    </div>
  )
} 
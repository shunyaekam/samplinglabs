'use client'

import { useState } from 'react'
import { demoStorage } from '@/lib/utils/storage'
import CourseCard from '@/components/learning/CourseCard'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/layouts/TopBar'

export default function EmployeeDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'inProgress' | 'completed'>('inProgress')
  const courses = Array.from(demoStorage.courses.values())
  
  const inProgressCourses = courses.filter(course => course.progress > 0 && course.progress < 100)
  const completedCourses = courses.filter(course => course.progress === 100)

  if (!session?.user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        onMenuClick={() => {}} 
        userEmail={session.user.email || ''}
        userImage={session.user.image}
      />

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Overview</h2>
              <p className="text-gray-500">Progress overview component coming soon</p>
            </div>
            <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Path</h2>
              <p className="text-gray-500">Learning path component coming soon</p>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Learning</h2>
                <p className="text-sm text-gray-500 mt-1">Track your course progress</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('inProgress')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'inProgress'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  In Progress ({inProgressCourses.length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'completed'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Completed ({completedCourses.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeTab === 'inProgress' ? inProgressCourses : completedCourses).map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={{
                    ...course,
                    id: Number(course.id)
                  }} 
                />
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recommended Courses</h2>
              <p className="text-sm text-gray-500">Courses picked for you based on your interests</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add recommended courses content here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
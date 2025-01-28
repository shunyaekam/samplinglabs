'use client'

import { useState } from 'react'
import { demoStorage } from '@/lib/utils/storage'
import CourseCard from '@/components/learning/CourseCard'

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'inProgress' | 'completed'>('all')
  const courses = Array.from(demoStorage.courses.values())
  
  const filteredCourses = {
    all: courses,
    inProgress: courses.filter(course => course.progress > 0 && course.progress < 100),
    completed: courses.filter(course => course.progress === 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <div className="flex space-x-2">
          {(['all', 'inProgress', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === tab
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'all' ? 'All Courses' : 
               tab === 'inProgress' ? 'In Progress' :
               'Completed'} ({filteredCourses[tab].length})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses[activeTab].map((course) => (
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
  )
} 
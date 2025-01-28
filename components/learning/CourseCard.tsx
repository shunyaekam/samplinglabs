'use client'

import Link from 'next/link'

interface CourseCardProps {
  course: {
    id: number
    title: string
    description?: string
    progress: number
    category: string
  }
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link 
      href={`/dashboard/employee/courses/${course.id}`}
      className="block group"
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
              {course.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {course.description || 'No description available'}
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {course.category}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium text-gray-900">{course.progress}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 
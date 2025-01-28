'use client'

import { useState } from 'react'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import CourseViewModal from './CourseViewModal'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    status: string
    progress?: number
    thumbnail?: string | null
  }
  isAdmin?: boolean
}

export default function CourseCard({ course, isAdmin }: CourseCardProps) {
  const [isViewingCourse, setIsViewingCourse] = useState(false)

  return (
    <>
      <div 
        onClick={() => setIsViewingCourse(true)}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {course.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {course.description}
            </p>
          </div>
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-indigo-600" />
            </div>
          )}
        </div>

        {!isAdmin && typeof course.progress === 'number' && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{course.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
            >
              {course.status}
            </span>
          </div>
        )}
      </div>

      <CourseViewModal 
        courseId={course.id}
        open={isViewingCourse}
        onOpenChange={setIsViewingCourse}
      />
    </>
  )
} 
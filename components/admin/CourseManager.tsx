'use client'

import { useState, useEffect } from 'react'
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline'
import CourseContentUploader from './CourseContentUploader'
import CourseViewModal from '@/components/learning/CourseViewModal'

type Course = {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
}

export default function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showUploader, setShowUploader] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleViewCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete course')
      fetchCourses() // Refresh the list
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  if (loading) {
    return <div>Loading courses...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Course Management</h2>
        <button
          onClick={() => setShowUploader(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Course
        </button>
      </div>

      {showUploader && (
        <div className="mb-8">
          <CourseContentUploader 
            onSuccess={() => {
              setShowUploader(false)
              fetchCourses()
            }}
            onCancel={() => setShowUploader(false)}
          />
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  <div className="text-sm text-gray-500">{course.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(course.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewCourse(course.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCourseId && (
        <CourseViewModal
          courseId={selectedCourseId}
          open={!!selectedCourseId}
          onOpenChange={(open) => !open && setSelectedCourseId(null)}
        />
      )}
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import CourseContentUploader from '@/components/admin/CourseContentUploader'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import CourseCard from '@/components/learning/CourseCard'
import CourseManager from '@/components/admin/CourseManager'

export default function AdminCoursesPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCourseCreated = () => {
    setIsCreating(false)
    setRefreshTrigger(prev => prev + 1) // Trigger refresh
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-500 mt-1">Create and manage learning content</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'cards' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'table' 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Table
            </button>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Course
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <CourseManager key={refreshTrigger} />
      ) : (
        <AdminCourseGrid key={refreshTrigger} />
      )}

      {/* Create Course Modal */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Course
          </DialogTitle>
          <div className="mt-4">
            <CourseContentUploader onSuccess={handleCourseCreated} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AdminCourseGrid() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchCourses()
  }, [])

  if (loading) {
    return <div>Loading courses...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={{
            id: course.id,
            title: course.title,
            description: course.description,
            status: course.status,
            progress: 0,
            thumbnail: null
          }}
          isAdmin
        />
      ))}
    </div>
  )
} 
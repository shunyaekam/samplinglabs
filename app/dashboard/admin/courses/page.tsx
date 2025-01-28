'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import CourseManager from '@/components/admin/CourseManager'
import CourseCreator from '@/components/admin/CourseCreator'

export default function AdminCourses() {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Create and manage learning content</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setIsCreating(true)}
        >
          Create New Course
        </button>
      </div>

      <CourseManager />

      {isCreating && (
        <CourseCreator onClose={() => setIsCreating(false)} />
      )}
    </DashboardLayout>
  )
} 
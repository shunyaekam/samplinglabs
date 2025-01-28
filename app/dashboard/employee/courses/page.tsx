'use client'

import { useState, useEffect } from 'react'
import CourseCard from '@/components/learning/CourseCard'

export default function EmployeeCoursesPage() {
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

  if (loading) return <div>Loading courses...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Courses</h1>
        <p className="text-gray-500 mt-1">Browse and enroll in courses</p>
      </div>

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
          />
        ))}
      </div>
    </div>
  )
} 
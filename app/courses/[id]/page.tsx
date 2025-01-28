'use client'

import { useEffect, useState } from 'react'
import PDFViewer from '@/components/learning/PDFViewer'

interface CourseViewProps {
  params: {
    id: string
  }
}

export default function CourseView({ params }: CourseViewProps) {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch course')
        const data = await response.json()
        setCourse(data)
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  if (loading) return <div>Loading...</div>
  if (!course) return <div>Course not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{course.title}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <PDFViewer pdfData={course.content} />
      </div>
    </div>
  )
} 
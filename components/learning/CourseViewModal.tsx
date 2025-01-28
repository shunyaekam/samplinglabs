'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import DocumentViewer from './DocumentViewer'
import { Loader2 } from 'lucide-react'
import StructuredContentViewer from './StructuredContentViewer'

interface CourseViewModalProps {
  courseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CourseViewModal({ courseId, open, onOpenChange }: CourseViewModalProps) {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && courseId) {
      const fetchCourse = async () => {
        try {
          const response = await fetch(`/api/courses/${courseId}`)
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
    }
  }, [courseId, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] h-[90vh] w-[1200px] flex flex-col p-0 mx-auto">
        <DialogTitle className="sr-only">
          {course ? course.title : 'Loading course...'}
        </DialogTitle>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : course ? (
          <>
            <div className="px-6 py-4 border-b flex-shrink-0">
              <h2 className="text-xl font-semibold text-white">
                {course.title}
              </h2>
            </div>
            <div className="flex-1 min-h-0 mb-[10vh]">
              {course.structuredContent ? (
                <StructuredContentViewer course={course} />
              ) : (
                <DocumentViewer 
                  fileType={course.fileType}
                  content={course.content}
                  fileName={course.originalFileName}
                />
              )}
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Course not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 
'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PencilIcon, TrashIcon, UserIcon, BookOpenIcon, ChartBarIcon, XMarkIcon } from '@heroicons/react/24/outline'

type Course = {
  id: string
  title: string
  description: string
  enrollments: number
  status: 'active' | 'draft' | 'archived'
  thumbnail?: string
  lastUpdated: Date
}

interface CourseDetailsModalProps {
  course: Course
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CourseDetailsModal({ course, open, onOpenChange }: CourseDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {course.title}
            </DialogTitle>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="px-6 border-b flex space-x-6">
                <TabsTrigger value="overview" className="pb-3 border-b-2 border-transparent data-[state=active]:border-indigo-600">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="content" className="pb-3 border-b-2 border-transparent data-[state=active]:border-indigo-600">
                  Content
                </TabsTrigger>
                <TabsTrigger value="enrollments" className="pb-3 border-b-2 border-transparent data-[state=active]:border-indigo-600">
                  Enrollments
                </TabsTrigger>
                <TabsTrigger value="analytics" className="pb-3 border-b-2 border-transparent data-[state=active]:border-indigo-600">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Course Details</h3>
                      <div className="text-sm text-gray-600">{course.description}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">Students</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {course.enrollments}
                          </span>
                        </div>
                      </div>
                      {/* Add more stats */}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content">
                  {/* Course content section */}
                </TabsContent>

                <TabsContent value="enrollments">
                  {/* List of enrolled users */}
                </TabsContent>

                <TabsContent value="analytics">
                  {/* Course analytics */}
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
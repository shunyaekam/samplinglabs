'use client'

import { useState } from 'react'
import { demoStorage } from '@/lib/utils/storage'
import AIChatButton from './AIChatButton'
import CourseProgress from './CourseProgress'
import CourseResources from './CourseResources'
import CourseNotes from './CourseNotes'

interface CourseViewerProps {
  courseId: string
}

export default function CourseViewer({ courseId }: CourseViewerProps) {
  const course = demoStorage.courses.get(courseId)
  const [showChat, setShowChat] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'notes'>('content')

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-1">{course.category}</p>
            </div>
            <div className="flex items-center space-x-4">
              <CourseProgress progress={course.progress} />
              <button
                onClick={() => setShowChat(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Course Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['content', 'resources', 'notes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Section Navigation */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">Course Sections</h2>
              </div>
              <nav className="p-2">
                {course.sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === index
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.title}</span>
                      {index < activeSection && (
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'content' && (
                <div className="prose max-w-none">
                  <h2>{course.sections[activeSection].title}</h2>
                  {course.sections[activeSection].content}
                </div>
              )}
              {activeTab === 'resources' && <CourseResources courseId={courseId} />}
              {activeTab === 'notes' && <CourseNotes courseId={courseId} />}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showChat && (
        <AIChatButton 
          courseContent={demoStorage.getContent(courseId)}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  )
} 
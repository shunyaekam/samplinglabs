'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface StructuredContentViewerProps {
  course: any // Type this properly based on your schema
}

export default function StructuredContentViewer({ course }: StructuredContentViewerProps) {
  const [activeModule, setActiveModule] = useState(0)
  const [activeLesson, setActiveLesson] = useState(0)

  const currentModule = course.modules[activeModule]
  const currentLesson = currentModule?.lessons[activeLesson]

  return (
    <div className="flex h-full">
      {/* Navigation Sidebar */}
      <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
        {course.modules.map((module, moduleIndex) => (
          <div key={module.id} className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              {module.title}
            </h3>
            <ul className="space-y-1">
              {module.lessons.map((lesson, lessonIndex) => (
                <li key={lesson.id}>
                  <button
                    onClick={() => {
                      setActiveModule(moduleIndex)
                      setActiveLesson(lessonIndex)
                    }}
                    className={cn(
                      "w-full text-left px-2 py-1 rounded text-sm",
                      moduleIndex === activeModule && lessonIndex === activeLesson
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {lesson.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentLesson ? (
          <div className="prose max-w-none">
            <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
            <div 
              dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              className="mt-4"
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No lesson selected
          </div>
        )}
      </div>
    </div>
  )
} 
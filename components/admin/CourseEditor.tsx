'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

type Section = {
  id: string
  title: string
  content: string
  order: number
}

type Course = {
  id: string
  title: string
  description: string
  sections: Section[]
}

export default function CourseEditor({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  async function fetchCourse() {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    }
  }

  async function saveCourseSection(sectionId: string, content: string) {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/sections/${sectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      if (response.ok) {
        fetchCourse()
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving section:', error)
    }
  }

  if (!course) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Sections Sidebar */}
      <div className="col-span-1 bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-900 mb-4">Course Sections</h3>
        <ul className="space-y-2">
          {course.sections.map((section) => (
            <li
              key={section.id}
              className={`p-2 rounded cursor-pointer ${
                selectedSection?.id === section.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedSection(section)}
            >
              {section.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Content Editor */}
      <div className="col-span-3 bg-white p-6 rounded-lg shadow">
        {selectedSection ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">{selectedSection.title}</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                {isEditing ? 'Preview' : 'Edit'}
              </button>
            </div>
            {isEditing ? (
              <div className="prose max-w-none">
                <ReactQuill
                  value={selectedSection.content}
                  onChange={(content) => {
                    setSelectedSection({
                      ...selectedSection,
                      content
                    })
                  }}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => saveCourseSection(selectedSection.id, selectedSection.content)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedSection.content }}
              />
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Select a section to edit
          </div>
        )}
      </div>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CourseContentUploaderProps {
  onSuccess: () => void
  onCancel?: () => void
}

export default function CourseContentUploader({ onSuccess, onCancel }: CourseContentUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [courseName, setCourseName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allowedFileTypes = [
    'application/pdf',                     // PDF
    'text/plain',                         // TXT
    'application/msword',                 // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-powerpoint',      // PPT
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'text/markdown',                      // MD
    'text/csv'                           // CSV
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (allowedFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setError(null)
        // Set default course name from file name if not already set
        if (!courseName) {
          setCourseName(selectedFile.name.split('.')[0])
        }
      } else {
        setError('Invalid file type. Please upload a PDF, DOC, DOCX, TXT, PPT, PPTX, MD, or CSV file.')
        setFile(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !courseName) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', courseName)

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload course')
      }

      setCourseName('')
      setFile(null)
      onSuccess()
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload course')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
          type="text"
          id="courseName"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course Content
        </label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.md,.csv"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX, TXT, PPT, PPTX, MD, or CSV up to 10MB
            </p>
            {file && (
              <p className="text-sm text-gray-600">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={uploading || !file || !courseName}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Course'
          )}
        </button>
      </div>
    </form>
  )
} 
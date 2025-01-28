'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Upload, FileText, Loader2 } from 'lucide-react'

export default function CourseContentUploader() {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const [courseName, setCourseName] = useState('')

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length || !courseName) return

    try {
      setUploading(true)
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('courseName', courseName)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast({
        title: 'Success',
        description: 'Course content uploaded successfully',
      })
      setCourseName('')
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload course content',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Upload Course Content</h3>
        <p className="text-sm text-gray-500">
          Upload text files containing course materials. Supported formats include .txt, .md, .doc, .docx, .pdf, and more.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Enter course name"
          />
        </div>

        <div className="relative">
          <input
            type="file"
            accept=".txt,.md,.doc,.docx,.pdf,.rtf,.odt"
            onChange={handleUpload}
            disabled={uploading || !courseName}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-black file:text-white hover:file:bg-gray-800
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {uploading && (
            <div className="absolute right-0 top-0 h-full flex items-center pr-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
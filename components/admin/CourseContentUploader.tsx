'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface CourseContentUploaderProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CourseContentUploader({ onSuccess, onCancel }: CourseContentUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const [courseName, setCourseName] = useState('')

  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length || !courseName) return

    const file = e.target.files[0]
    
    // Validate file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: 'Error',
        description: 'File size must be less than 10MB',
        variant: 'destructive',
      })
      return
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload PDF, Text, Markdown, or Word documents',
        variant: 'destructive'
      })
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('courseName', courseName)

      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      })

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      // Read the response text first
      const responseText = await response.text()
      let data

      try {
        data = JSON.parse(responseText)
      } catch (error) {
        console.error('Failed to parse response:', responseText)
        throw new Error('Invalid response from server')
      }

      if (!response.ok) {
        throw new Error(data.error || `Upload failed with status ${response.status}`)
      }

      toast({
        title: 'Success',
        description: data.message || 'Course uploaded successfully',
      })

      setCourseName('')
      if (e.target.form) {
        e.target.form.reset()
      }
      onSuccess?.()

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload file',
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
          Upload PDF files or text documents to create courses. The content will be processed and made available for AI-assisted learning.
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
            accept=".pdf,application/pdf,.txt,text/plain,.md,text/markdown"
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
'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface PDFViewerProps {
  pdfData: string
}

export default function PDFViewer({ pdfData }: PDFViewerProps) {
  const [loading, setLoading] = useState(true)
  const [objectUrl, setObjectUrl] = useState<string>('')

  useEffect(() => {
    if (pdfData) {
      try {
        // Convert base64 to blob
        const byteCharacters = atob(pdfData)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/pdf' })
        
        // Create object URL
        const url = URL.createObjectURL(blob)
        setObjectUrl(url)
        setLoading(false)

        // Cleanup function
        return () => {
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error('Error creating PDF URL:', error)
        setLoading(false)
      }
    }
  }, [pdfData])

  if (!pdfData) {
    return <div className="text-center text-gray-500">No PDF data available</div>
  }

  return (
    <div className="h-full w-full overflow-hidden relative">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <object
          data={objectUrl}
          type="application/pdf"
          className="w-full h-full"
        >
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Unable to display PDF. <a href={objectUrl} className="text-blue-500 hover:underline" download>Download</a> instead.
            </p>
          </div>
        </object>
      )}
    </div>
  )
} 
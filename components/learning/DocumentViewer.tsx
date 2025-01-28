'use client'

import { useState } from 'react'
import PDFViewer from './PDFViewer'
import TextViewer from './TextViewer'
import DocxViewer from './DocxViewer'
import { Loader2 } from 'lucide-react'

interface DocumentViewerProps {
  fileType: string
  content: string
  fileName: string
}

export default function DocumentViewer({ fileType, content, fileName }: DocumentViewerProps) {
  if (!content) {
    return <div className="text-center text-gray-500">No content available</div>
  }

  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <PDFViewer pdfData={content} />
    case 'txt':
      return <TextViewer content={content} />
    case 'docx':
      return <DocxViewer content={content} fileName={fileName} />
    default:
      return (
        <div className="text-center text-gray-500">
          Unsupported file type: {fileType}
        </div>
      )
  }
} 
'use client'

interface TextViewerProps {
  content: string
}

export default function TextViewer({ content }: TextViewerProps) {
  // Decode base64 content
  const decodedContent = atob(content)

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[calc(90vh-200px)]">
          {decodedContent}
        </pre>
      </div>
    </div>
  )
} 
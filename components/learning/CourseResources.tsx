'use client'

interface Resource {
  id: string
  title: string
  type: 'pdf' | 'video' | 'link'
  url: string
  size?: string
}

export default function CourseResources({ courseId }: { courseId: string }) {
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Course Handbook',
      type: 'pdf',
      url: '#',
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Introduction Video',
      type: 'video',
      url: '#',
    },
    {
      id: '3',
      title: 'Additional Reading',
      type: 'link',
      url: '#',
    }
  ]

  const getIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      case 'video':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'link':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Course Resources</h3>
      <div className="space-y-2">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {getIcon(resource.type)}
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{resource.title}</p>
              {resource.size && (
                <p className="text-sm text-gray-500">{resource.size}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
} 
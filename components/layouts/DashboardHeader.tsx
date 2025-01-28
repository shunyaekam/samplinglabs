'use client'

import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function DashboardHeader() {
  const pathname = usePathname()
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    paths.forEach((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`
      breadcrumbs.push({
        label: path.charAt(0).toUpperCase() + path.slice(1),
        href: index < paths.length - 1 ? href : undefined
      })
    })
    
    return breadcrumbs
  }

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col space-y-2">
          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {getBreadcrumbs().map((item, index, array) => (
                <li key={item.label} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 text-gray-400 mx-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  <span
                    className={`text-sm ${
                      index === array.length - 1
                        ? 'text-gray-700 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ol>
          </nav>

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900">
            {getBreadcrumbs().slice(-1)[0]?.label}
          </h1>
        </div>
      </div>
    </div>
  )
} 
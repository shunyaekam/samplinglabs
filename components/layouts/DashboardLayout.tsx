'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import DashboardHeader from './DashboardHeader'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'SUPER_ADMIN'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Single TopBar */}
      <TopBar 
        onMenuClick={() => setSidebarOpen(true)} 
        userEmail={session?.user?.email || ''}
        userImage={session?.user?.image}
      />
      
      {/* Mobile sidebar */}
      <div className={`
        fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity lg:hidden
        ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="fixed inset-0 flex">
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Sidebar isAdmin={isAdmin} />
          </div>
          <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
        <Sidebar isAdmin={isAdmin} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <div className="pt-16"> {/* Add padding for fixed header */}
          <DashboardHeader />
          <main className="flex-1 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import AIChatDialog from '../learning/AIChatDialog'

interface TopBarProps {
  onMenuClick: () => void
  userEmail?: string
  userImage?: string | null
}

export default function TopBar({ onMenuClick, userEmail, userImage }: TopBarProps) {
  const [chatOpen, setChatOpen] = useState(false)
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'SUPER_ADMIN'

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow z-10">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 lg:hidden"
            onClick={onMenuClick}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-semibold text-black">
              Sampling Labs
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {!isAdmin && (
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="w-5 h-5" />
              <span>AI Tutor</span>
            </button>
          )}
          <div className="flex items-center space-x-2">
            {userImage ? (
              <Image
                src={userImage}
                alt="Profile"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {!isAdmin && (
        <AIChatDialog 
          courseId="" 
          open={chatOpen}
          onOpenChange={setChatOpen}
        />
      )}
    </div>
  )
} 
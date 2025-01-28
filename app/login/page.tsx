'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !isRedirecting) {
      setIsRedirecting(true)
      const redirectPath = session.user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard/employee'
      router.push(redirectPath)
    }
  }, [session, status, router, isRedirecting])

  const handleSignIn = async () => {
    try {
      await signIn('google', { 
        redirect: true,
        callbackUrl: '/login'
      })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  if (status === 'loading' || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to LearningHub
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your learning dashboard
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <img
              className="h-5 w-5 mr-2"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Logo"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
} 
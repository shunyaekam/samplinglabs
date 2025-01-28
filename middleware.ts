import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public routes - no auth required
    if (
      path === '/' ||
      path === '/login' ||
      path === '/enterprise/register' ||
      path.startsWith('/api/') ||
      path.startsWith('/_next/') ||
      path.includes('favicon.ico')
    ) {
      return NextResponse.next()
    }

    // No token - redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Admin routes protection
    if (path.startsWith('/admin') && token.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/employee', req.url))
    }

    // Employee routes protection
    if (path.startsWith('/dashboard/employee') && token.role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
      signOut: '/login',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
} 
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'SUPER_ADMIN'
    const path = req.nextUrl.pathname

    // Skip middleware for API routes
    if (path.startsWith('/api/')) {
      return NextResponse.next()
    }

    // If accessing root path, redirect based on role
    if (path === '/') {
      if (!token) {
        return NextResponse.next()
      }
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.redirect(new URL('/dashboard/employee', req.url))
    }

    // Allow access to auth routes
    if (path.startsWith('/auth')) {
      return NextResponse.next()
    }

    // If not logged in, redirect to home
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Redirect admin to admin dashboard
    if (path.startsWith('/dashboard') && isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    // Redirect employee to employee dashboard
    if (path.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard/employee', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true
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
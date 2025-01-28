import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'SUPER_ADMIN'
    const path = req.nextUrl.pathname

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
      authorized: () => true // Let the middleware function handle authorization
    },
  }
)

export const config = {
  matcher: ['/', '/dashboard/:path*', '/admin/:path*', '/auth/:path*']
} 
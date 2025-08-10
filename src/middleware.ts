import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Chặn tất cả các route admin trong production
  if (process.env.NODE_ENV === 'production') {
    const { pathname } = request.nextUrl

    // Chặn trang admin
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Chặn API admin routes  
    if (pathname.startsWith('/api/admin')) {
      return new NextResponse(
        JSON.stringify({ error: 'Admin API not available in production' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Chặn login page (vì không cần admin trong production)
    if (pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Chặn auth APIs
    if (pathname.startsWith('/api/auth')) {
      return new NextResponse(
        JSON.stringify({ error: 'Auth API not available in production' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Chặn profile APIs (admin only)
    if (pathname.startsWith('/api/profile')) {
      return new NextResponse(
        JSON.stringify({ error: 'Profile API not available in production' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/api/admin/:path*',
    '/api/auth/:path*',
    '/api/profile/:path*'
  ]
}

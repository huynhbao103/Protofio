import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isLocalRequest } from '@/lib/isLocal'

export function middleware(request: NextRequest) {
  if (!isLocalRequest(request)) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/auth')) {
      return new NextResponse(
        JSON.stringify({ error: 'Admin access is only available on localhost' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (pathname.startsWith('/api/profile') && request.method !== 'GET') {
      return new NextResponse(
        JSON.stringify({ error: 'Profile write API is only available on localhost' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (pathname.startsWith('/api/projects') && request.method !== 'GET') {
      return new NextResponse(
        JSON.stringify({ error: 'Project write API is only available on localhost' }),
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
    '/api/profile/:path*',
    '/api/projects/:path*',
  ],
}

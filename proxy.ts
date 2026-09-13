import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('rdw_token')?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const payload = await verifyToken(token)
    if (!payload) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      // Clear invalid cookie
      response.cookies.delete('rdw_token')
      return response
    }

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-email', String(payload.email || ''))
    requestHeaders.set('x-user-role', String(payload.role || ''))

    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Redirect /admin/login to /admin/dashboard if already authenticated
  if (pathname === '/admin/login') {
    const token = request.cookies.get('rdw_token')?.value
    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on admin routes and skip static files
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
}

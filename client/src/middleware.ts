import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register']
const PROTECTED_PREFIX = '/dashboard'

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const isAuthenticated = Boolean(token)
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX)

  if (!isAuthenticated && isProtectedRoute)
    return NextResponse.redirect(new URL('/login', request.url))
  if (isAuthenticated && isPublicRoute)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  if (pathname === '/')
    return NextResponse.redirect(
      new URL(isAuthenticated ? '/dashboard' : '/login', request.url),
    )

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

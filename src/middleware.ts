import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname)
  
  // Get user from cookie or header (for now we'll check localStorage on client side)
  // In a real app, you'd check for a JWT token in cookies
  
  // If trying to access a protected route
  if (!isPublicRoute) {
    // For now, we'll let the client-side auth handle redirects
    // In production, you'd validate the JWT token here
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

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
  ],
}
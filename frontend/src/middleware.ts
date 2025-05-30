import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname;

  // Define paths that require authentication
  const isProtectedPath = path.startsWith('/protected');

  // Get the token from the cookies
  const token = request.cookies.get('authToken')?.value;

  // Redirect to login if accessing a protected route without a token
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to home if accessing auth pages while logged in
  if ((path === '/login' || path === '/signup') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}; 
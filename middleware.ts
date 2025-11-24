import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes (auth pages)
  const publicRoutes = ['/login', '/signup', '/error-404'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If accessing protected route without token, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
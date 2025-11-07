import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read session cookies. These have NO expires attribute, so they die on full browser close.
  const token = request.cookies.get('token')?.value || null;
  const userCookie = request.cookies.get('user')?.value || null;

  let userRole = null;
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      userRole = user?.role || null;
    } catch {
      // bad cookie, ignore
    }
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isStudentRoute = pathname.startsWith('/student');
  const isAuthRoute = pathname.startsWith('/auth');

  // Block protected routes w/o token
  if ((isAdminRoute || isStudentRoute) && !token) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Role gate protected areas
  if (token && userRole && (isAdminRoute || isStudentRoute)) {
    // Admin-like user trying to access student area
    if (isStudentRoute && ['admin', 'super-admin', 'school'].includes(userRole)) {
      const res = NextResponse.redirect(new URL('/auth/sign-in', request.url));
      res.cookies.delete('token');
      res.cookies.delete('user');
      return res;
    }
    // Student trying to access admin area
    if (isAdminRoute && userRole === 'student') {
      const res = NextResponse.redirect(new URL('/auth/sign-in', request.url));
      res.cookies.delete('token');
      res.cookies.delete('user');
      return res;
    }
  }

  // Already authenticated? Keep out of /auth/*
  if (isAuthRoute && token && userRole) {
    const url = userRole === 'student'
      ? new URL('/student/dashboard', request.url)
      : new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/auth/:path*',
  ],
};

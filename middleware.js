import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('adminToken')?.value;

  if (pathname === '/admin/users' || pathname.startsWith('/admin/users/')) {
    const normalizedUrl = request.nextUrl.clone();
    normalizedUrl.pathname = pathname.replace('/admin/users', '/admin/Users');
    return NextResponse.redirect(normalizedUrl);
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/api/admin/') && !adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
export default auth(async (req) => {

  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/feed', req.nextUrl));
    }
    return NextResponse.next();
  }

  // Define protected routes
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/feed') || 
                           req.nextUrl.pathname.startsWith('/bookmarks') ||
                           req.nextUrl.pathname.startsWith('/profile');

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Keep Auth.js routes out of the proxy so OAuth callbacks are not intercepted.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

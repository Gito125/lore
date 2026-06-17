import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ratelimit } from '@/lib/cache/rate-limit';

export default auth(async (req) => {
  // Rate limiting for API routes
  if (req.nextUrl.pathname.startsWith('/api') && process.env.UPSTASH_REDIS_REST_URL) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    try {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (e) {
      // If redis is not configured or down, continue gracefully
      console.error('Rate limit error:', e);
    }
  }

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

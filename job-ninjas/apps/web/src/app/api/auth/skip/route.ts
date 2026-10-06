import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // In a real app this would initialize a secure session.
  // For Prototype 1, we just set a cookie to indicate we are in demo mode.
  const cookieStore = await cookies();
  cookieStore.set('demo_session', 'Acme AI Hiring', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  return NextResponse.redirect(new URL('/dashboard', request.url));
}

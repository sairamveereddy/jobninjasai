import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('jobninjas_session');
  cookieStore.delete('demo_session');

  return NextResponse.json({ success: true, redirectUrl: '/login' });
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('jobninjas_session');
  cookieStore.delete('demo_session');

  return NextResponse.redirect(new URL('/login', request.url));
}

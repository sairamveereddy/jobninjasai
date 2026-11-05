import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role = 'Lead Technical Recruiter', org = 'Acme AI Hiring', plan = 'Team Pro' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid work email' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionPayload = {
      email,
      name: email.split('@')[0],
      role,
      org,
      plan,
      isAdmin: email.includes('admin') || role.toLowerCase().includes('admin'),
      loggedInAt: new Date().toISOString(),
    };

    cookieStore.set('jobninjas_session', JSON.stringify(sessionPayload), {
      path: '/',
      httpOnly: false, // Accessible to client components for display
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookieStore.set('demo_session', org, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });

    const redirectUrl = sessionPayload.isAdmin ? '/admin' : '/dashboard';

    return NextResponse.json({
      success: true,
      user: sessionPayload,
      redirectUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Login failed' }, { status: 500 });
  }
}

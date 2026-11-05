import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('jobninjas_session');
  const demoCookie = cookieStore.get('demo_session');

  if (sessionCookie?.value) {
    try {
      const user = JSON.parse(sessionCookie.value);
      return NextResponse.json({ authenticated: true, user });
    } catch {
      // fallback
    }
  }

  // Fallback demo user
  const user = {
    email: 'demo@jobninjas.ai',
    name: 'Demo User (Hiring Operations Lead)',
    role: 'Head of Talent & Hiring Operations',
    org: demoCookie?.value || 'JobNinjas AI Demo',
    plan: 'Enterprise Pro',
    isAdmin: true,
  };

  return NextResponse.json({ authenticated: true, user });
}

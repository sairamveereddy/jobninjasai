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
    email: 'recruiter@jobninjas.ai',
    name: 'Sarah Lin',
    role: 'Lead Technical Recruiter',
    org: demoCookie?.value || 'Acme AI Hiring',
    plan: 'Team Pro',
    isAdmin: false,
  };

  return NextResponse.json({ authenticated: true, user });
}

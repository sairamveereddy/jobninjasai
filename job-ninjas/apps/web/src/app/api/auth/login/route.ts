import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { 
      email, 
      password, 
      role = 'Head of Talent & Hiring Operations', 
      org = 'JobNinjas AI Demo', 
      plan = 'Enterprise Pro' 
    } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid work email' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check for demo or admin accounts
    let userName = cleanEmail.split('@')[0];
    let isAdmin = cleanEmail.includes('admin') || role.toLowerCase().includes('admin');

    if (cleanEmail === 'demo@jobninjas.ai') {
      userName = 'Demo User (Hiring Operations Lead)';
      role = 'Head of Talent & Hiring Operations';
      org = 'JobNinjas AI Demo';
      plan = 'Enterprise Pro';
      isAdmin = true;
    } else if (cleanEmail === 'admin@jobninjas.ai') {
      userName = 'Platform Administrator';
      role = 'Platform Administrator';
      org = 'JobNinjas Global';
      plan = 'Enterprise Pro';
      isAdmin = true;
    } else if (cleanEmail === 'recruiter@jobninjas.ai' || cleanEmail.includes('sarah')) {
      userName = 'Sarah Lin (Lead Recruiter)';
      role = 'Lead Technical Recruiter';
      org = 'JobNinjas AI Demo';
      plan = 'Team Pro';
    } else if (cleanEmail === 'hiringmanager@jobninjas.ai' || cleanEmail.includes('rad')) {
      userName = 'Rad Vance (VP Engineering)';
      role = 'VP of Engineering';
      org = 'JobNinjas AI Demo';
      plan = 'Enterprise Pro';
    }

    const cookieStore = await cookies();
    const sessionPayload = {
      email: cleanEmail,
      name: userName,
      role,
      org,
      plan,
      isAdmin,
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

    const redirectUrl = sessionPayload.isAdmin && cleanEmail === 'admin@jobninjas.ai' ? '/admin' : '/dashboard';

    return NextResponse.json({
      success: true,
      user: sessionPayload,
      redirectUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Login failed' }, { status: 500 });
  }
}

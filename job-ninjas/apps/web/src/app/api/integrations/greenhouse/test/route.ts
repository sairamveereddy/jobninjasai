import { NextResponse } from 'next/server';
import { greenhouseAuthMessage } from '@/lib/integrations/greenhouse-message';

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Harvest API Key is required' }, { status: 400 });
    }

    // Demo / Sandbox key
    if (apiKey.toLowerCase() === 'demo' || apiKey.toLowerCase() === 'test') {
      return NextResponse.json({
        success: true,
        isDemo: true,
        accountName: 'Acme Corp (Greenhouse Sandbox)',
        user: { name: 'Demo Recruiter', email: 'recruiter@acme-corp.demo' }
      });
    }

    // Real Greenhouse Harvest API v3 validation
    // Uses HTTP Basic Auth: apiKey as username, empty password
    const basicAuth = Buffer.from(`${apiKey}:`).toString('base64');
    const ghRes = await fetch('https://harvest.greenhouse.io/v3/users/me', {
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!ghRes.ok) {
      return NextResponse.json({
        success: false,
        error: greenhouseAuthMessage(ghRes.status, 'confirm this key'),
      }, { status: ghRes.status === 401 || ghRes.status === 403 ? 401 : ghRes.status });
    }

    const userData = await ghRes.json();
    return NextResponse.json({
      success: true,
      isDemo: false,
      user: userData
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

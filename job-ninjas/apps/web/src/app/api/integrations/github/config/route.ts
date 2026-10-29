import { NextResponse } from 'next/server';
import { getConnectorConfig, setConnectorConfig } from '@/lib/integrations/connector-service';
import { verifyGitHubProfile } from '@/lib/integrations/github';

export async function GET() {
  try {
    const config = await getConnectorConfig('', 'GITHUB');
    return NextResponse.json({
      success: true,
      provider: 'GITHUB',
      status: config.status,
      settings: {
        hasToken: !!config.settings?.token,
        rateLimitTier: config.settings?.token ? 'Authenticated (5,000 req/hr)' : 'Public API (60 req/hr)',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify profile action
    if (body.action === 'verify' || body.username) {
      const config = await getConnectorConfig('', 'GITHUB');
      const profile = await verifyGitHubProfile(body.username, config.settings?.token);
      return NextResponse.json({ success: true, profile });
    }

    // Configure token
    const { token, status = 'ACTIVE' } = body;
    const saved = await setConnectorConfig('', 'GITHUB', {
      token: token || 'demo_token',
      isDemo: !token || token === 'demo',
    }, status);

    return NextResponse.json({
      success: true,
      status: saved.status,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getConnectorConfig, setConnectorConfig } from '@/lib/integrations/connector-service';
import { greenhouseAuthMessage } from '@/lib/integrations/greenhouse-message';

export async function GET(req: Request) {
  try {
    const config = await getConnectorConfig('', 'GREENHOUSE');
    return NextResponse.json({
      success: true,
      provider: 'GREENHOUSE',
      status: config.status,
      lastSyncAt: config.lastSyncAt,
      settings: {
        hasKey: !!config.settings?.apiKey,
        accountName: config.settings?.accountName || 'Greenhouse ATS',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { apiKey, status = 'ACTIVE' } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Harvest API Key is required' }, { status: 400 });
    }

    let accountName = 'Greenhouse Sandbox';
    let isDemo = false;

    if (apiKey.toLowerCase() === 'demo' || apiKey.toLowerCase() === 'test') {
      isDemo = true;
      accountName = 'Acme Corp (Greenhouse Sandbox)';
    } else {
      const basicAuth = Buffer.from(`${apiKey}:`).toString('base64');
      const ghRes = await fetch('https://harvest.greenhouse.io/v3/users/me', {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
      });

      if (!ghRes.ok) {
        return NextResponse.json({
          success: false,
          error: greenhouseAuthMessage(ghRes.status, 'validate Harvest key'),
        }, { status: 401 });
      }

      const userData = await ghRes.json();
      accountName = userData?.name ? `${userData.name}'s Organization` : 'Verified Greenhouse Account';
    }

    const saved = await setConnectorConfig('', 'GREENHOUSE', {
      apiKey,
      accountName,
      isDemo,
    }, status);

    return NextResponse.json({
      success: true,
      accountName,
      isDemo,
      status: saved.status,
      lastSyncAt: saved.lastSyncAt,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

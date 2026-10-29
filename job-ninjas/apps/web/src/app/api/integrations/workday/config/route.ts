import { NextResponse } from 'next/server';
import { getConnectorConfig, setConnectorConfig } from '@/lib/integrations/connector-service';
import { validateWorkdayCredentials } from '@/lib/integrations/workday';

export async function GET() {
  try {
    const config = await getConnectorConfig('', 'WORKDAY');
    return NextResponse.json({
      success: true,
      provider: 'WORKDAY',
      status: config.status,
      lastSyncAt: config.lastSyncAt,
      settings: {
        tenantUrl: config.settings?.tenantUrl || '',
        clientId: config.settings?.clientId || '',
        tenantName: config.settings?.tenantName || 'Workday ATS',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isDemo = body.isDemo || body.tenantUrl === 'demo' || !body.tenantUrl;

    const validation = await validateWorkdayCredentials({
      tenantUrl: body.tenantUrl,
      clientId: body.clientId,
      clientSecret: body.clientSecret,
      isDemo,
    });

    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const saved = await setConnectorConfig('', 'WORKDAY', {
      tenantUrl: body.tenantUrl || 'https://wd5-impl-services1.workday.com/demo',
      clientId: body.clientId || 'demo_client',
      tenantName: validation.tenantName,
      isDemo,
    }, body.status || 'ACTIVE');

    return NextResponse.json({
      success: true,
      tenantName: validation.tenantName,
      status: saved.status,
      lastSyncAt: saved.lastSyncAt,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

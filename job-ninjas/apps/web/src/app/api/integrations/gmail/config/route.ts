import { NextResponse } from 'next/server';
import { getConnectorConfig, setConnectorConfig } from '@/lib/integrations/connector-service';

export async function GET() {
  try {
    const config = await getConnectorConfig('', 'GMAIL');
    return NextResponse.json({
      success: true,
      provider: 'GMAIL',
      status: config.status,
      settings: {
        email: config.settings?.email || '',
        senderName: config.settings?.senderName || 'JobNinjas Recruiter',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, senderName, appPassword, status = 'ACTIVE' } = await req.json();

    const saved = await setConnectorConfig('', 'GMAIL', {
      email: email || 'recruiting@jobninjas.ai',
      senderName: senderName || 'JobNinjas Talent Team',
      appPassword: appPassword || 'app_pwd_demo',
      isDemo: !appPassword || appPassword === 'demo',
    }, status);

    return NextResponse.json({
      success: true,
      status: saved.status,
      email: saved.settings.email,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

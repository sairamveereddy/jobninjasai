import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getConnectorConfig, setConnectorConfig } from '@/lib/integrations/connector-service';

export async function GET() {
  try {
    const config = await getConnectorConfig('', 'GENERIC_WEBHOOK');
    const secret = config.settings?.inboundSecret || 'whsec_demo_9a8b7c6d5e';
    return NextResponse.json({
      success: true,
      provider: 'GENERIC_WEBHOOK',
      status: config.status,
      settings: {
        inboundSecret: secret,
        outboundUrl: config.settings?.outboundUrl || '',
        endpointUrl: '/api/integrations/webhooks/incoming',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { inboundSecret, outboundUrl, status = 'ACTIVE' } = await req.json();

    const saved = await setConnectorConfig('', 'GENERIC_WEBHOOK', {
      inboundSecret: inboundSecret || 'whsec_live_' + Math.random().toString(36).substring(2, 10),
      outboundUrl: outboundUrl || '',
    }, status);

    return NextResponse.json({
      success: true,
      status: saved.status,
      inboundSecret: saved.settings.inboundSecret,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

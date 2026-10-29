import { NextResponse } from 'next/server';
import { getConnectorConfig, setConnectorConfig } from '@/lib/integrations/connector-service';
import { sendSlackAlert } from '@/lib/integrations/slack';

export async function GET() {
  try {
    const config = await getConnectorConfig('', 'SLACK');
    return NextResponse.json({
      success: true,
      provider: 'SLACK',
      status: config.status,
      settings: {
        channel: config.settings?.channel || '#hiring-alerts',
        hasWebhook: !!config.settings?.webhookUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { webhookUrl, channel, botName, status = 'ACTIVE' } = await req.json();

    const saved = await setConnectorConfig('', 'SLACK', {
      webhookUrl: webhookUrl || 'https://hooks.slack.com/services/DEMO',
      channel: channel || '#hiring-alerts',
      botName: botName || 'JobNinjas Bot',
      isDemo: !webhookUrl || webhookUrl.includes('DEMO'),
    }, status);

    return NextResponse.json({
      success: true,
      status: saved.status,
      channel: saved.settings.channel,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

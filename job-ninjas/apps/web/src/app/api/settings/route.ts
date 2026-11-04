import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getConnectorConfig, setConnectorConfig } from '@/lib/integrations/connector-service';

export async function GET() {
  try {
    // 1. Get Slack connector config
    const slackConfig = await getConnectorConfig('', 'SLACK');

    // 2. Try to get Organization from Prisma
    let orgName = 'Acme AI Hiring';
    let orgDomain = 'Technology';
    try {
      if (prisma && prisma.organization) {
        const org = await prisma.organization.findFirst();
        if (org) {
          orgName = org.name;
          orgDomain = org.domain || 'Technology';
        }
      }
    } catch {}

    return NextResponse.json({
      success: true,
      profile: {
        firstName: 'Sairam',
        lastName: 'Veereddy',
        email: 'veereddy@jobninjas.org',
        roleTitle: 'Head of Talent & Engineering',
        avatarUrl: '',
      },
      workspace: {
        companyName: orgName,
        industry: orgDomain,
        companySize: '51-200 employees',
      },
      integrations: {
        slackWebhookUrl: slackConfig.settings?.webhookUrl || '',
        slackChannel: slackConfig.settings?.channel || '#hiring-alerts',
        isSlackConnected: !!(slackConfig.settings?.webhookUrl && !slackConfig.settings?.isDemo),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile, workspace, integrations } = body;

    // 1. Update Organization if provided
    if (workspace?.companyName) {
      try {
        if (prisma && prisma.organization) {
          const org = await prisma.organization.findFirst();
          if (org) {
            await prisma.organization.update({
              where: { id: org.id },
              data: {
                name: workspace.companyName,
                domain: workspace.industry || org.domain,
              },
            });
          } else {
            await prisma.organization.create({
              data: {
                name: workspace.companyName,
                domain: workspace.industry || 'Technology',
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn('Settings org update notice:', dbErr);
      }
    }

    // 2. Update Slack Connector if provided
    if (integrations?.slackWebhookUrl !== undefined) {
      const url = String(integrations.slackWebhookUrl || '').trim();
      const isDemo = !url || url.includes('DEMO');
      await setConnectorConfig('', 'SLACK', {
        webhookUrl: url,
        channel: integrations.slackChannel || '#hiring-alerts',
        botName: 'JobNinjas Bot',
        isDemo,
      }, isDemo ? 'READY' : 'ACTIVE');
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      profile,
      workspace,
      integrations,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

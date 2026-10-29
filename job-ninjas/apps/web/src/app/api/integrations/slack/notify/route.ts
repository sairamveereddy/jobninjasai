import { NextResponse } from 'next/server';
import { getConnectorConfig } from '@/lib/integrations/connector-service';
import { sendSlackAlert } from '@/lib/integrations/slack';

export async function POST(req: Request) {
  try {
    const { title, text, candidateName, roleTitle, score, actionUrl } = await req.json();

    const connector = await getConnectorConfig('', 'SLACK');
    const result = await sendSlackAlert(connector.settings || {}, {
      title: title || 'Hiring Pipeline Update',
      text: text || 'A candidate stage has progressed.',
      candidateName,
      roleTitle,
      score,
      actionUrl,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

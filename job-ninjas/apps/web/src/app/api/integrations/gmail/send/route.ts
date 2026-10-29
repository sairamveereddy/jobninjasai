import { NextResponse } from 'next/server';
import { getConnectorConfig } from '@/lib/integrations/connector-service';
import { sendEmail } from '@/lib/integrations/gmail';

export async function POST(req: Request) {
  try {
    const { to, subject, body, candidateName, roleTitle } = await req.json();

    const connector = await getConnectorConfig('', 'GMAIL');
    const result = await sendEmail(connector.settings || {}, {
      to,
      subject,
      body,
      candidateName,
      roleTitle,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        simulated: result.simulated,
      });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

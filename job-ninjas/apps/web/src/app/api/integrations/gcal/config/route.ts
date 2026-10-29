import { NextResponse } from 'next/server';
import { getConnectorConfig, setConnectorConfig } from '@/lib/integrations/connector-service';
import { getCalendarSlots, bookCalendarEvent } from '@/lib/integrations/google-calendar';

export async function GET() {
  try {
    const config = await getConnectorConfig('', 'GOOGLE_CALENDAR');
    const slots = await getCalendarSlots(config.settings || {});
    return NextResponse.json({
      success: true,
      provider: 'GOOGLE_CALENDAR',
      status: config.status,
      slots,
      settings: {
        calendarId: config.settings?.calendarId || 'primary',
        interviewerEmail: config.settings?.interviewerEmail || 'interviews@jobninjas.ai',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'book') {
      const config = await getConnectorConfig('', 'GOOGLE_CALENDAR');
      const booking = await bookCalendarEvent(config.settings || {}, {
        candidateEmail: body.candidateEmail,
        candidateName: body.candidateName,
        slotLabel: body.slotLabel,
        roleTitle: body.roleTitle || 'Open Role',
      });
      return NextResponse.json(booking);
    }

    const { calendarId, interviewerEmail, status = 'ACTIVE' } = body;
    const saved = await setConnectorConfig('', 'GOOGLE_CALENDAR', {
      calendarId: calendarId || 'primary',
      interviewerEmail: interviewerEmail || 'interviews@jobninjas.ai',
      isDemo: !calendarId || calendarId === 'demo',
    }, status);

    return NextResponse.json({
      success: true,
      status: saved.status,
      calendarId: saved.settings.calendarId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export interface GCalConfig {
  calendarId?: string;
  interviewerEmail?: string;
  isDemo?: boolean;
}

export interface InterviewSlot {
  slotId: string;
  label: string;
  startTime: string;
  endTime: string;
  interviewerRole: string;
}

export async function getCalendarSlots(
  _config: GCalConfig,
  durationMinutes = 45
): Promise<InterviewSlot[]> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const slot1 = new Date(tomorrow);
  slot1.setHours(10, 0, 0, 0);
  const slot1End = new Date(slot1.getTime() + durationMinutes * 60000);

  const slot2 = new Date(tomorrow);
  slot2.setHours(14, 30, 0, 0);
  const slot2End = new Date(slot2.getTime() + durationMinutes * 60000);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  dayAfter.setHours(11, 0, 0, 0);
  const slot3End = new Date(dayAfter.getTime() + durationMinutes * 60000);

  return [
    {
      slotId: 'slot_1',
      label: `${slot1.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at 10:00 AM EDT`,
      startTime: slot1.toISOString(),
      endTime: slot1End.toISOString(),
      interviewerRole: 'Hiring Manager (Technical Screen)',
    },
    {
      slotId: 'slot_2',
      label: `${slot2.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at 2:30 PM EDT`,
      startTime: slot2.toISOString(),
      endTime: slot2End.toISOString(),
      interviewerRole: 'Lead Engineer (System Design)',
    },
    {
      slotId: 'slot_3',
      label: `${dayAfter.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at 11:00 AM EDT`,
      startTime: dayAfter.toISOString(),
      endTime: slot3End.toISOString(),
      interviewerRole: 'Product & Culture Peer Panel',
    },
  ];
}

export async function bookCalendarEvent(
  _config: GCalConfig,
  payload: {
    candidateEmail: string;
    candidateName: string;
    slotLabel: string;
    roleTitle: string;
  }
): Promise<{ success: boolean; eventId: string; meetUrl: string; summary: string }> {
  const eventId = `gcal_${Date.now()}`;
  const meetCode = `meet-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
  const meetUrl = `https://meet.google.com/${meetCode}`;

  return {
    success: true,
    eventId,
    meetUrl,
    summary: `Interview: ${payload.candidateName} for ${payload.roleTitle}`,
  };
}

export interface WebhookConfig {
  inboundSecret?: string;
  outboundUrl?: string;
  subscribedEvents?: string[];
  status?: string;
}

export interface WebhookEventPayload {
  event: 'candidate.applied' | 'candidate.scored' | 'candidate.shortlisted' | 'interview.completed' | 'decision.ready';
  timestamp: string;
  data: Record<string, any>;
}

export async function dispatchOutboundWebhook(
  outboundUrl: string,
  event: WebhookEventPayload['event'],
  data: Record<string, any>
): Promise<{ success: boolean; status?: number; error?: string }> {
  if (!outboundUrl || outboundUrl.includes('demo') || !outboundUrl.startsWith('http')) {
    console.log(`[Webhook Dispatcher Simulator] Dispatched ${event} to ${outboundUrl || 'no-destination'}`);
    return { success: true, status: 200 };
  }

  try {
    const res = await fetch(outboundUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-JobNinjas-Event': event,
      },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data,
      }),
    });

    return { success: res.ok, status: res.status };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

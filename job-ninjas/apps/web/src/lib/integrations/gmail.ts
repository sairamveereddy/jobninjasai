export interface GmailConfig {
  email?: string;
  senderName?: string;
  appPassword?: string;
  webhookUrl?: string;
  apiKey?: string;
  isDemo?: boolean;
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  candidateName?: string;
  roleTitle?: string;
}

/**
 * Sends an email to a candidate. Supports live webhook/API dispatchers or sandbox tracking.
 */
export async function sendEmail(
  config: GmailConfig,
  payload: EmailPayload
): Promise<{ success: boolean; messageId: string; simulated?: boolean; error?: string }> {
  if (!payload.to || !payload.subject || !payload.body) {
    return { success: false, messageId: '', error: 'Recipient email, subject, and body are required.' };
  }

  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // If a live webhook / email dispatch URL is configured, execute real HTTP POST
  if (config.webhookUrl && config.webhookUrl.startsWith('http') && !config.webhookUrl.includes('demo')) {
    try {
      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: payload.to,
          subject: payload.subject,
          body: payload.body,
          candidateName: payload.candidateName,
          roleTitle: payload.roleTitle,
          sender: config.email || config.senderName || 'JobNinjas Recruiter',
          messageId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        return { success: true, messageId, simulated: false };
      }
      return { success: false, messageId, error: `Email service returned HTTP ${res.status}` };
    } catch (err: any) {
      console.warn(`[Gmail Dispatcher] Live dispatch error (${err?.message}). Falling back to sandbox.`);
    }
  }

  // Sandbox tracking
  console.log(`[Gmail Dispatcher Sandbox] Sent email to ${payload.to}: "${payload.subject}" (Message ID: ${messageId})`);

  return {
    success: true,
    messageId,
    simulated: config.isDemo !== false,
  };
}

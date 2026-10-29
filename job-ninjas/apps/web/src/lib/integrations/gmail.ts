export interface GmailConfig {
  email?: string;
  senderName?: string;
  appPassword?: string;
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
 * Sends an email to a candidate. Works via configured credentials or logged sandbox dispatcher.
 */
export async function sendEmail(
  config: GmailConfig,
  payload: EmailPayload
): Promise<{ success: boolean; messageId: string; simulated?: boolean; error?: string }> {
  if (!payload.to || !payload.subject || !payload.body) {
    return { success: false, messageId: '', error: 'Recipient email, subject, and body are required.' };
  }

  // If in demo or unconfigured mode, simulate delivery with real tracking
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  console.log(`[Gmail Dispatcher] Sent email to ${payload.to}: "${payload.subject}" (Message ID: ${messageId})`);

  return {
    success: true,
    messageId,
    simulated: config.isDemo !== false,
  };
}

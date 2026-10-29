export interface SlackConfig {
  webhookUrl?: string;
  channel?: string;
  botName?: string;
  isDemo?: boolean;
}

export interface SlackNotificationPayload {
  title: string;
  text: string;
  candidateName?: string;
  roleTitle?: string;
  score?: number | string;
  actionUrl?: string;
}

/**
 * Sends a notification to Slack channel using Incoming Webhooks or Block Kit.
 */
export async function sendSlackAlert(
  config: SlackConfig,
  payload: SlackNotificationPayload
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  if (!config.webhookUrl || config.webhookUrl.includes('demo') || config.isDemo) {
    console.log(`[Slack Alert Simulator] Channel: ${config.channel || '#hiring'}: ${payload.title} - ${payload.text}`);
    return { success: true, simulated: true };
  }

  try {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `⚡ JobNinjas: ${payload.title}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Candidate:*\n${payload.candidateName || 'N/A'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Role:*\n${payload.roleTitle || 'Open Role'}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: payload.text,
        },
      },
    ];

    if (payload.score) {
      blocks.push({
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Overall Match:*\n${payload.score}/100`,
          },
        ],
      } as any);
    }

    const res = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: config.channel || '#talent-alerts',
        username: config.botName || 'JobNinjas AI',
        blocks,
      }),
    });

    if (res.ok) {
      return { success: true, simulated: false };
    }
    return { success: false, error: `Slack returned HTTP ${res.status}` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

import { z } from 'zod';

export const RejectionDraftSchema = z.object({
  subject: z.string(),
  body: z.string().describe('Respectful, warm rejection or update email acknowledging candidate time and skills.'),
  constructiveFeedback: z.string().describe('Constructive feedback or encouragement for the candidate.'),
  tone: z.string().default('warm and respectful'),
  reapplyTimeframe: z.string().describe('e.g. "6-12 months for future engineering openings"'),
});

export type RejectionDraft = z.infer<typeof RejectionDraftSchema>;

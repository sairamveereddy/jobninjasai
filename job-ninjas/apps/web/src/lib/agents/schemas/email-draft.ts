import { z } from 'zod';

export const EmailDraftSchema = z.object({
  subject: z.string(),
  body: z.string().describe('Email body the recruiter can copy. No placeholder tokens like {{name}}.'),
  tone: z.string(),
  callToAction: z.string(),
});

export type EmailDraft = z.infer<typeof EmailDraftSchema>;

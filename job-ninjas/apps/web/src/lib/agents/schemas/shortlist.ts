import { z } from 'zod';

export const ShortlistSchema = z.object({
  advance: z.boolean(),
  rankLabel: z.string().describe('Advance, Hold, or Pass'),
  rationale: z.string(),
  nextStep: z.string(),
});

export type ShortlistDecision = z.infer<typeof ShortlistSchema>;

import { z } from 'zod';

export const OfferDraftSchema = z.object({
  roleTitle: z.string(),
  candidateName: z.string(),
  baseSalary: z.string().describe('e.g. "$185,000 / year"'),
  bonus: z.string().describe('e.g. "15% annual performance target"'),
  equity: z.string().describe('e.g. "0.25% equity options with 4-year vesting, 1-year cliff"'),
  benefitsSummary: z.string().describe('Summary of health, 401k, remote stipend, PTO'),
  offerLetterText: z.string().describe('Complete, ready-to-send formal offer letter with compensation terms.'),
  expirationDays: z.number().default(7),
});

export type OfferDraft = z.infer<typeof OfferDraftSchema>;

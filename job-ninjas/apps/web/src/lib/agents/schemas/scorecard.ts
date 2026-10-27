import { z } from 'zod';

export const ScorecardSchema = z.object({
  candidateSummary: z.string(),
  overallMatch: z.number().min(0).max(100),
  recommendation: z.enum(['ADVANCE', 'HOLD', 'REJECT']),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  interviewFocusAreas: z.array(z.string()),
});

export type Scorecard = z.infer<typeof ScorecardSchema>;

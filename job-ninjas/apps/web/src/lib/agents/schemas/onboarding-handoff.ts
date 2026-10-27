import { z } from 'zod';

export const OnboardingHandoffSchema = z.object({
  candidateName: z.string(),
  roleTitle: z.string(),
  targetStartDate: z.string(),
  checklist: z.array(z.object({
    task: z.string(),
    owner: z.string(),
    timeline: z.string(),
  })),
  referenceCheckNotes: z.string().describe('Key areas to verify during reference checks.'),
  firstWeekPlan: z.string().describe('Orientation and initial team onboarding plan.'),
});

export type OnboardingHandoff = z.infer<typeof OnboardingHandoffSchema>;

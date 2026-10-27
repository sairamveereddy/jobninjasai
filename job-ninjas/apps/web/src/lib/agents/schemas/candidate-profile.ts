import { z } from 'zod';

export const CandidateProfileSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  headline: z.string(),
  skills: z.array(z.string()),
  yearsExperience: z.number(),
  locations: z.array(z.string()),
  summary: z.string(),
});

export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;

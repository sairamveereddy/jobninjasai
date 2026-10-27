import { z } from 'zod';

export const InterviewSlotsSchema = z.object({
  timezone: z.string(),
  durationMinutes: z.number(),
  format: z.string().describe('Video, phone, or onsite'),
  slots: z.array(
    z.object({
      label: z.string(),
      interviewerRole: z.string(),
    })
  ),
  candidateMessage: z.string(),
});

export type InterviewSlots = z.infer<typeof InterviewSlotsSchema>;

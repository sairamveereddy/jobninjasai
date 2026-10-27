import { z } from 'zod';

export const ParsedJdSchema = z.object({
  title: z.string(),
  seniority: z.string(),
  mustHaveSkills: z.array(z.string()),
  niceToHaveSkills: z.array(z.string()),
  locations: z.array(z.string()),
  summary: z.string().describe('Plain-language summary an HR can read in under 30 seconds'),
});

export type ParsedJd = z.infer<typeof ParsedJdSchema>;

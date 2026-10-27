import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { ParsedJdSchema } from '../schemas/parsed-jd';

export const JdParserAgent: AgentDefinition = {
  id: 'agent-jd-parser',
  name: 'JD Parser',
  description: 'Turns a job description into structured must-haves, seniority, and locations.',
  requiredInputs: [],
  needsCandidate: false,
  execute: async (context) => {
    const { role } = context;
    const description = role?.jobDescription?.trim();
    if (!description) {
      throw new Error('Job description required. Add one in role setup or on the Job description step.');
    }

    const parsed = await generateStructuredOutput({
      systemPrompt: `You are an HR operations assistant. Read the job description and extract only what is written or strongly implied.
Do not invent requirements. Write the summary so a recruiter can scan it.`,
      input: `TITLE: ${role.title || 'Open role'}
DEPARTMENT: ${role.department || ''}
LOCATION: ${role.location || ''}

JOB DESCRIPTION:
${description}`,
      schema: ParsedJdSchema,
    });

    return {
      outputPayload: parsed,
      artifacts: [{ type: 'ParsedJD', data: parsed }],
      events: [{ type: 'job.parsed', payload: { title: parsed.title } }],
    };
  },
};

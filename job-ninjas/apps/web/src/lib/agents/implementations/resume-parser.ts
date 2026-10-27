import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { CandidateProfileSchema } from '../schemas/candidate-profile';

export const ResumeParserAgent: AgentDefinition = {
  id: 'agent-resume-parser',
  name: 'Resume Parser',
  description: 'Turns a resume into a candidate profile other hiring agents can read.',
  requiredInputs: [],
  execute: async (context) => {
    const { candidate } = context;
    if (!candidate?.resumeText?.trim()) {
      throw new Error('Resume required. Upload a resume, pick a candidate who has one, or connect a Resume step.');
    }

    const profile = await generateStructuredOutput({
      systemPrompt: `You extract a structured candidate profile from a resume.
Use only facts present in the resume. If email is missing, return an empty string.`,
      input: `CANDIDATE ON FILE: ${candidate.firstName || ''} ${candidate.lastName || ''}
EMAIL ON FILE: ${candidate.email || ''}

RESUME:
${candidate.resumeText}`,
      schema: CandidateProfileSchema,
    });

    return {
      outputPayload: profile,
      artifacts: [{ type: 'CandidateProfile', data: profile }],
      events: [{ type: 'resume.parsed', payload: { fullName: profile.fullName } }],
    };
  },
};

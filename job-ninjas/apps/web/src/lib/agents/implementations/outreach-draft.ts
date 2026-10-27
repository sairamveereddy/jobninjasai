import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { EmailDraftSchema } from '../schemas/email-draft';

export const OutreachDraftAgent: AgentDefinition = {
  id: 'agent-outreach',
  name: 'Outreach',
  description: 'Writes a recruiter email for one candidate on this role.',
  requiredInputs: [],
  execute: async (context) => {
    const { role, candidate, upstreamOutputs } = context;
    if (!candidate) {
      throw new Error('Pick a candidate on this role before drafting outreach.');
    }
    const scorecard = upstreamOutputs?.Scorecard || upstreamOutputs?.ResumeAnalysis;
    const profile = upstreamOutputs?.CandidateProfile;

    const draft = await generateStructuredOutput({
      systemPrompt: `You write short recruiting emails for a human recruiter to send.
Sound like a person, not a template. Mention the role and one specific reason this person is relevant.
Do not claim an interview is booked. Do not invent compensation.`,
      input: `ROLE: ${role?.title || 'Open role'}
LOCATION: ${role?.location || ''}
JOB DESCRIPTION:
${role?.jobDescription || ''}

CANDIDATE: ${candidate.firstName || ''} ${candidate.lastName || ''}
EMAIL: ${candidate.email || ''}

PROFILE:
${profile ? JSON.stringify(profile) : 'None'}

SCORECARD:
${scorecard ? JSON.stringify(scorecard) : 'None'}`,
      schema: EmailDraftSchema,
    });

    return {
      outputPayload: scorecard ? { ...draft, Scorecard: scorecard } : draft,
      artifacts: [
        { type: 'EmailDraft', data: draft },
        ...(scorecard ? [{ type: 'Scorecard', data: scorecard }] : []),
      ],
      events: [{ type: 'outreach.drafted', payload: { subject: draft.subject } }],
    };
  },
};

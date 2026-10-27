import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { OfferDraftSchema } from '../schemas/offer-draft';

export const OfferDraftAgent: AgentDefinition = {
  id: 'agent-offer-draft',
  name: 'Offer & Compensation Draft',
  description: 'Drafts a formal offer letter and compensation package based on hiring recommendation and role requirements.',
  requiredInputs: ['CandidateDecision'],
  execute: async (context) => {
    const { role, candidate, upstreamOutputs } = context;
    if (!candidate) {
      throw new Error('Pick a candidate on this role before drafting an offer.');
    }
    const decision = upstreamOutputs?.CandidateDecision;

    const offer = await generateStructuredOutput({
      systemPrompt: `You are an expert talent acquisition partner drafting an executive-ready formal job offer letter and compensation summary.
Base the package on the candidate's verified skills, hiring recommendation, and role parameters.
Provide clear, honest terms without generic placeholders.`,
      input: `ROLE: ${role?.title || 'Open role'}
DEPARTMENT: ${role?.department || 'Engineering'}
LOCATION: ${role?.location || 'Remote'}
JOB DESCRIPTION:
${role?.jobDescription || ''}

CANDIDATE: ${candidate.firstName || ''} ${candidate.lastName || ''}
EMAIL: ${candidate.email || ''}

HIRING COMMITTEE RECOMMENDATION & ANALYSIS:
${decision ? JSON.stringify(decision) : 'Advisory: Strong Hire recommended.'}`,
      schema: OfferDraftSchema,
    });

    return {
      outputPayload: offer,
      artifacts: [
        { type: 'OfferDraft', data: offer },
      ],
      events: [{ type: 'offer.drafted', payload: { roleTitle: offer.roleTitle, baseSalary: offer.baseSalary } }],
    };
  },
};

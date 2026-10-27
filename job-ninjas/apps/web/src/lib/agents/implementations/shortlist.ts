import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { ShortlistSchema } from '../schemas/shortlist';

export const ShortlistAgent: AgentDefinition = {
  id: 'agent-shortlist',
  name: 'Shortlist',
  description: 'Reads a scorecard and recommends whether the candidate moves forward.',
  requiredInputs: ['Scorecard'],
  execute: async (context) => {
    const scorecard = context.upstreamOutputs?.Scorecard || context.upstreamOutputs?.ResumeAnalysis;
    if (!scorecard) {
      throw new Error('Scorecard required. Connect Screen & Score, or Resume Intelligence, and run it first.');
    }

    const decision = await generateStructuredOutput({
      systemPrompt: `You help a recruiter shortlist. Advance only when the scorecard supports a conversation.
Explain the reason in plain language. nextStep should be a concrete recruiter action.`,
      input: `ROLE: ${context.role?.title || 'Open role'}
CANDIDATE: ${context.candidate ? `${context.candidate.firstName} ${context.candidate.lastName}` : 'Candidate'}

SCORECARD:
${JSON.stringify(scorecard)}`,
      schema: ShortlistSchema,
    });

    return {
      outputPayload: { ...decision, Scorecard: scorecard },
      artifacts: [
        { type: 'Shortlist', data: decision },
        { type: 'Scorecard', data: scorecard },
      ],
      events: [{ type: 'candidate.shortlist_recommended', payload: { advance: decision.advance } }],
    };
  },
};

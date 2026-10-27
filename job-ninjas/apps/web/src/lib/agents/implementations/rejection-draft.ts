import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { RejectionDraftSchema } from '../schemas/rejection-draft';

export const RejectionDraftAgent: AgentDefinition = {
  id: 'agent-rejection-draft',
  name: 'Candidate Update / Pass Draft',
  description: 'Drafts a respectful, thoughtful candidate pass or update note with constructive feedback.',
  requiredInputs: [],
  execute: async (context) => {
    const { role, candidate, upstreamOutputs } = context;
    if (!candidate) {
      throw new Error('Pick a candidate on this role before drafting candidate feedback.');
    }
    const scorecard = upstreamOutputs?.Scorecard || upstreamOutputs?.ResumeAnalysis;
    const interviewAnalysis = upstreamOutputs?.InterviewAnalysis;
    const decision = upstreamOutputs?.CandidateDecision;

    const passNote = await generateStructuredOutput({
      systemPrompt: `You write candidate pass notes for human recruiters.
Be respectful, warm, and professional. Acknowledge their time, thank them for their effort, and offer thoughtful, constructive observations without violating HR compliance.
Sound human, empathetic, and encouraging.`,
      input: `ROLE: ${role?.title || 'Open role'}
DEPARTMENT: ${role?.department || 'Engineering'}

CANDIDATE: ${candidate.firstName || ''} ${candidate.lastName || ''}

EVALUATION CONTEXT:
${scorecard ? `Scorecard: ${JSON.stringify(scorecard)}` : ''}
${interviewAnalysis ? `Interview Analysis: ${JSON.stringify(interviewAnalysis)}` : ''}
${decision ? `Decision: ${JSON.stringify(decision)}` : ''}`,
      schema: RejectionDraftSchema,
    });

    return {
      outputPayload: passNote,
      artifacts: [
        { type: 'RejectionDraft', data: passNote },
      ],
      events: [{ type: 'rejection.drafted', payload: { subject: passNote.subject } }],
    };
  },
};

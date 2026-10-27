import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { OnboardingHandoffSchema } from '../schemas/onboarding-handoff';

export const OnboardingHandoffAgent: AgentDefinition = {
  id: 'agent-onboarding-handoff',
  name: 'Reference Prep & Onboarding Handoff',
  description: 'Prepares reference check guidelines and initial team onboarding checklist.',
  requiredInputs: [],
  execute: async (context) => {
    const { role, candidate, upstreamOutputs } = context;
    if (!candidate) {
      throw new Error('Pick a candidate on this role before generating onboarding handoff.');
    }
    const decision = upstreamOutputs?.CandidateDecision;
    const interviewAnalysis = upstreamOutputs?.InterviewAnalysis;

    const handoff = await generateStructuredOutput({
      systemPrompt: `You are an HR operations specialist preparing an onboarding checklist and reference check verification plan.
Create concrete, actionable onboarding steps, equipment requirements, and reference inquiry questions.`,
      input: `ROLE: ${role?.title || 'Open role'}
DEPARTMENT: ${role?.department || 'Engineering'}

CANDIDATE: ${candidate.firstName || ''} ${candidate.lastName || ''}
LOCATION: ${candidate.location || 'Remote'}

INTERVIEW FINDINGS & DECISION:
${decision ? `Decision: ${JSON.stringify(decision)}` : ''}
${interviewAnalysis ? `Interview Analysis: ${JSON.stringify(interviewAnalysis)}` : ''}`,
      schema: OnboardingHandoffSchema,
    });

    return {
      outputPayload: handoff,
      artifacts: [
        { type: 'OnboardingHandoff', data: handoff },
      ],
      events: [{ type: 'onboarding.handoff_ready', payload: { candidateName: handoff.candidateName } }],
    };
  },
};

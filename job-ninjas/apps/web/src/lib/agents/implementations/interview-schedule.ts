import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { InterviewSlotsSchema } from '../schemas/interview-slots';
import { InterviewPlan } from '../schemas/interview-plan';

export const InterviewScheduleAgent: AgentDefinition = {
  id: 'agent-schedule',
  name: 'Interview Schedule',
  description: 'Proposes interview slots and a message the recruiter can send.',
  requiredInputs: ['InterviewPlan'],
  execute: async (context) => {
    const { role, candidate, upstreamOutputs } = context;
    const plan = upstreamOutputs?.InterviewPlan as InterviewPlan;
    if (!plan) {
      throw new Error('Interview plan required. Connect the Interview Planning step and run it first.');
    }

    const slots = await generateStructuredOutput({
      systemPrompt: `You propose interview times for a recruiter. You cannot see a real calendar.
Offer three generic upcoming options labeled as options, not confirmed bookings.
Match the duration to the interview plan. Write the candidate message so the recruiter can paste it.`,
      input: `ROLE: ${role?.title || 'Open role'}
CANDIDATE: ${candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Candidate'}
LOCATION: ${candidate?.location || role?.location || 'Remote'}

INTERVIEW PLAN:
${JSON.stringify(plan)}`,
      schema: InterviewSlotsSchema,
    });

    return {
      outputPayload: slots,
      artifacts: [{ type: 'InterviewSlots', data: slots }],
      events: [{ type: 'interview.slots_drafted', payload: { count: slots.slots.length } }],
    };
  },
};

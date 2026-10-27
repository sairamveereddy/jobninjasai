import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { InterviewAnalysisSchema } from '../schemas/interview-analysis';
import { InterviewPlan } from '../schemas/interview-plan';
import prisma from '../../prisma';

export const InterviewAnalysisAgent: AgentDefinition = {
  id: 'agent-interview-analysis',
  name: 'Interview Analysis Agent',
  description: 'Analyzes interview transcripts to score the candidate based on the interview plan.',
  requiredInputs: ['InterviewPlan'],
  execute: async (context) => {
    const { candidate } = context;
    const interviewPlan = context.upstreamOutputs['InterviewPlan'] as InterviewPlan;
    if (!interviewPlan) {
      throw new Error('Interview plan required. Connect Interview Planning, run it, then connect it to this step.');
    }
    if (!candidate?.id) {
      throw new Error('Pick a candidate on this role before scoring an interview.');
    }

    const upstreamTranscript = context.upstreamOutputs['Transcript'];
    const pasted = typeof upstreamTranscript === 'string'
      ? upstreamTranscript
      : upstreamTranscript?.text || upstreamTranscript?.transcriptText;

    const interview = pasted
      ? null
      : await prisma.interview.findFirst({
          where: { candidateId: candidate.id },
          orderBy: { createdAt: 'desc' },
        });

    const transcriptText = (pasted || interview?.transcriptText || '').trim();
    if (!transcriptText) {
      throw new Error('Transcript required. Open the Transcript step, paste what was said in the interview, and connect that step here. Agents do not read sticky notes.');
    }

    const systemPrompt = `You are an expert interviewer evaluating a candidate for a recruiter.
Grade the transcript against the interview plan. Cite what was said. Do not invent quotes.

INTERVIEW PLAN:
${JSON.stringify(interviewPlan, null, 2)}
`;

    const input = `CANDIDATE TRANSCRIPT:
${transcriptText}

Evaluate this transcript and provide a structured analysis.`;

    const analysis = await generateStructuredOutput({
      systemPrompt,
      input,
      schema: InterviewAnalysisSchema,
      modelName: 'openai/gpt-oss-120b',
    });

    const scorecard = context.upstreamOutputs['Scorecard'] || context.upstreamOutputs['ResumeAnalysis'];

    return {
      outputPayload: scorecard ? { ...analysis, Scorecard: scorecard } : analysis,
      artifacts: [
        {
          type: 'InterviewAnalysis',
          data: analysis,
        },
        ...(scorecard ? [{ type: 'Scorecard', data: scorecard }] : []),
      ],
      events: [
        {
          type: 'interview.analysis_completed',
          payload: { recommendation: analysis.overallRecommendation },
        },
      ],
      nextActions: ['Candidate Decision'],
    };
  },
};

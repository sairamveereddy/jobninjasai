import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { InterviewAnalysisSchema } from '../schemas/interview-analysis';
import { InterviewPlan } from '../schemas/interview-plan';
import prisma from '@/lib/prisma';

export const InterviewAnalysisAgent: AgentDefinition = {
  id: 'agent-interview-analysis',
  name: 'Interview Analysis Agent',
  description: 'Analyzes interview transcripts to score the candidate based on the interview plan and job requirements.',
  requiredInputs: ['InterviewPlan'],
  execute: async (context) => {
    const { candidate, role } = context;
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

    // Window transcript to fit within Groq token limits while preserving introduction and technical depth
    const windowedTranscript = transcriptText.length > 7000
      ? transcriptText.slice(0, 3500) + '\n\n[... Technical conversation continues ...]\n\n' + transcriptText.slice(-3500)
      : transcriptText;

    const systemPrompt = `You are an expert interviewer evaluating a candidate for a recruiter.
Grade the interview dialogue against the interview plan and the actual requirements of the role. Cite actual quotes and topics discussed. Do not invent quotes.

Role Title: ${role.title}
Job Description:
${(role.jobDescription || role.title).slice(0, 2000)}

Candidate:
Name: ${candidate.firstName} ${candidate.lastName}

INTERVIEW PLAN:
${JSON.stringify(interviewPlan, null, 2).slice(0, 2000)}
`;

    const input = `ROLE: ${role.title}
CANDIDATE: ${candidate.firstName} ${candidate.lastName}
CANDIDATE TRANSCRIPT:
${windowedTranscript}

Evaluate this transcript specifically for the ${role.title} position and provide a structured analysis.`;

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
          payload: { candidateId: candidate.id, recommendation: analysis.overallRecommendation },
        },
      ],
    };
  },
};

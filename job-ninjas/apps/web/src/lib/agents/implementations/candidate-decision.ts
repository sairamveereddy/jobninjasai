import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { CandidateDecisionSchema } from '../schemas/candidate-decision';
import { ResumeAnalysis } from '../schemas/resume-analysis';
import { InterviewAnalysis } from '../schemas/interview-analysis';

export const CandidateDecisionAgent: AgentDefinition = {
  id: 'agent-decision',
  name: 'Candidate Evidence Synthesis Agent',
  description: 'Synthesizes resume and interview analyses to generate a comprehensive hiring recommendation for the recruiter.',
  requiredInputs: ['ResumeAnalysis', 'InterviewAnalysis'],
  execute: async (context) => {
    const { candidate, role } = context;
    const resumeAnalysis = context.upstreamOutputs['ResumeAnalysis'] as ResumeAnalysis;
    const interviewAnalysis = context.upstreamOutputs['InterviewAnalysis'] as InterviewAnalysis;

    const systemPrompt = `You are an expert hiring committee advisor for JobNinjas.
Synthesize all available evidence for this candidate and provide an objective recommendation to the recruiter.
Provide an honest advisory verdict: STRONG_HIRE, HIRE, NEEDS_REVIEW, or NO_HIRE based on direct alignment between the candidate background and the actual job requirements.

Role Requirements:
Title: ${role.title}
Department: ${role.department || 'Engineering'}
Job Description:
${(role.jobDescription || role.title).slice(0, 2500)}

Candidate Context:
Name: ${candidate.firstName} ${candidate.lastName}
Resume on file:
${(candidate.resumeText || '').slice(0, 2500)}

Resume Screening Findings:
${JSON.stringify(resumeAnalysis || {}, null, 2).slice(0, 2000)}

Interview Analysis & Transcript Evaluation:
${JSON.stringify(interviewAnalysis || {}, null, 2).slice(0, 2500)}`;

    const input = `ROLE: ${role.title}
JOB DESCRIPTION: ${(role.jobDescription || role.title).slice(0, 1500)}
CANDIDATE: ${candidate.firstName} ${candidate.lastName}
RESUME: ${(candidate.resumeText || '').slice(0, 1500)}

Evaluate whether ${candidate.firstName} ${candidate.lastName} meets the requirements for ${role.title}. Return a structured hiring recommendation strictly citing their actual experience and any skill gaps for this specific position.`;

    const decision = await generateStructuredOutput({
      systemPrompt,
      input,
      schema: CandidateDecisionSchema,
      modelName: 'openai/gpt-oss-120b',
    });

    return {
      outputPayload: decision,
      artifacts: [
        {
          type: 'CandidateDecision',
          data: decision,
        },
      ],
      events: [
        {
          type: 'candidate.recommendation_ready',
          payload: { recommendation: decision.recommendation, confidence: decision.confidence },
        },
      ],
    };
  },
};

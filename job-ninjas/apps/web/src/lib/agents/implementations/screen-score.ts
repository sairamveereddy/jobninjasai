import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { ScorecardSchema } from '../schemas/scorecard';

export const ScreenScoreAgent: AgentDefinition = {
  id: 'agent-screen',
  name: 'Screen & Score',
  description: 'Scores one candidate against this role and returns a scorecard.',
  requiredInputs: [],
  execute: async (context) => {
    const { role, candidate, upstreamOutputs } = context;
    const resumeText = candidate?.resumeText?.trim();
    const profile = upstreamOutputs?.CandidateProfile;
    if (!resumeText && !profile) {
      throw new Error('Resume required. Upload a resume for this candidate or connect the Resume parser.');
    }

    const parsedJd = upstreamOutputs?.ParsedJD || upstreamOutputs?.JobDescription;
    const scorecard = await generateStructuredOutput({
      systemPrompt: `You are a recruiter writing a scorecard for one open role.
Score fit from 0 to 100. ADVANCE means worth a conversation, HOLD means unclear, REJECT means a clear miss on must-haves.
Cite skills that are actually in the resume. Do not invent employers or degrees.`,
      input: `ROLE: ${role?.title || 'Open role'}
JOB DESCRIPTION:
${role?.jobDescription || 'Not provided'}

PARSED JOB (if present):
${parsedJd ? JSON.stringify(parsedJd) : 'None'}

CANDIDATE PROFILE (if present):
${profile ? JSON.stringify(profile) : 'None'}

RESUME:
${resumeText || 'Not attached. Use the candidate profile only.'}`,
      schema: ScorecardSchema,
    });

    return {
      outputPayload: scorecard,
      artifacts: [
        { type: 'Scorecard', data: scorecard },
        { type: 'ResumeAnalysis', data: scorecard },
      ],
      events: [{ type: 'candidate.scored', payload: { overallMatch: scorecard.overallMatch, recommendation: scorecard.recommendation } }],
      nextActions: ['Shortlist', 'Interview Planning'],
    };
  },
};

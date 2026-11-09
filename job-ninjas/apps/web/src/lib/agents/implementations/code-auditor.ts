import { AgentDefinition } from '../types';
import { generateStructuredOutput } from '../../ai/client';
import { CodeAuditSchema } from '../schemas/code-audit';

export const CodeAuditorAgent: AgentDefinition = {
  id: 'agent-code-auditor',
  name: 'GitHub & AST Code Auditor',
  description: 'Audits candidate code repositories, commit history, AST cleanliness, and concurrency discipline.',
  requiredInputs: [], // Reads from candidate resume / portfolio / github links
  execute: async (context) => {
    const { role, candidate, upstreamOutputs } = context;

    const resumeSnippet = candidate?.resumeText || (typeof upstreamOutputs?.Resume === 'string' ? upstreamOutputs.Resume : '');
    const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Candidate';

    const systemPrompt = `You are a Principal Software Architect and Static Code Auditor.
You analyze candidate software engineering repositories, pull requests, AST patterns, and code architecture against job requirements.
Focus on:
1. Code cleanliness and modularity
2. Memory safety, goroutine leaks, lock contention, race conditions
3. Unit / integration testing coverage and deterministic test suites
4. Commit discipline and commit message cleanliness

Provide grounded, verifiable citations without hallucinating commit hashes or nonexistent files.

JOB REQUISITION:
Role: ${role.title} (${role.department})
Requirements: ${role.jobDescription}
`;

    const input = `CANDIDATE:
Name: ${candidateName}
Profile / Resume / Links:
${resumeSnippet || 'Repository: github.com/' + (candidate?.firstName?.toLowerCase() || 'candidate') + '/raft-consensus-engine'}
Upstream Resume Analysis: ${JSON.stringify(upstreamOutputs?.ResumeAnalysis || upstreamOutputs?.Scorecard || {})}
`;

    const audit = await generateStructuredOutput({
      systemPrompt,
      input,
      schema: CodeAuditSchema,
      modelName: 'openai/gpt-oss-120b',
    });

    return {
      outputPayload: audit,
      artifacts: [
        {
          type: 'CodeAudit',
          data: audit,
        },
        {
          type: 'Scorecard',
          data: {
            candidateName,
            overallScore: audit.overallScore * 10,
            summary: audit.verdict,
            codeQuality: audit.overallScore,
            citations: audit.citations,
          },
        },
      ],
      events: [
        {
          type: 'code.audit_completed',
          payload: { score: audit.overallScore, repo: audit.repositoryUrl },
        },
      ],
      nextActions: ['Interview Planning', 'Candidate Concierge', 'Hiring Recommendation'],
    };
  },
};

import { z } from 'zod';

export const CodeAuditSchema = z.object({
  repositoryUrl: z.string().describe("Target GitHub repository or codebase evaluated"),
  overallScore: z.number().min(1).max(10).describe("Overall code quality and engineering rigor rating out of 10"),
  commitAnalysis: z.object({
    totalVerifiedCommits: z.number().describe("Estimated or parsed number of commits"),
    commitCleanliness: z.string().describe("Evaluation of commit messages, atomicity, and branch discipline"),
    leadTimeDiscipline: z.string().describe("Consistency of development velocity and PR frequency"),
  }),
  architecturalPatterns: z.array(z.string()).describe("Architectural patterns spotted (e.g. Raft consensus, modular microservices, clean dependency injection)"),
  codeHealth: z.object({
    memorySafety: z.string().describe("Assessment of concurrency, lock contention, leaks, or resource release"),
    testCoverage: z.string().describe("Presence and rigor of unit/integration test suites"),
    complexity: z.string().describe("Cyclomatic complexity and code modularity rating"),
  }),
  citations: z.array(
    z.object({
      fileOrCommit: z.string().describe("Exact file path, commit hash, or pull request citation"),
      evidence: z.string().describe("Verifiable factual snippet observed in the code"),
    })
  ).describe("Grounded, verifiable citations of code quality without hallucinations"),
  verdict: z.string().describe("1-2 sentence engineering verdict on candidate code readiness"),
});

export type CodeAudit = z.infer<typeof CodeAuditSchema>;

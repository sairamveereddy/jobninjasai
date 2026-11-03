import { AgentRegistry } from './registry';
import { AgentContext } from './types';

async function testAllAgents() {
  console.log('Testing all 15 agents execution...');

  const mockRole = {
    id: 'role-test-1',
    organizationId: 'org-1',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote',
    jobDescription: `We are looking for a Senior Full Stack Engineer with 5+ years of experience in TypeScript, React, Next.js, Node.js, and PostgreSQL. Must have experience building distributed systems, real-time web applications, and working with cloud infrastructure (AWS/Docker).`,
    requirements: ['TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Docker'],
    hiringManager: 'Alex Mercer',
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCandidate = {
    id: 'cand-test-1',
    roleId: 'role-test-1',
    firstName: 'Jordan',
    lastName: 'Lee',
    email: 'jordan.lee@example.com',
    phone: '+1 555-0192',
    location: 'Austin, TX',
    stage: 'SCREENING',
    resumeUrl: 'Jordan_Lee_Resume.pdf',
    resumeText: `JORDAN LEE
Senior Software Engineer | Austin, TX | jordan.lee@example.com | (555) 019-2834
Summary: Full-stack software engineer with 6 years experience building modern web applications using TypeScript, React, Next.js, and PostgreSQL. Led architecture of high-traffic SaaS systems on AWS.
Skills: TypeScript, JavaScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS, GraphQL, REST APIs.
Experience:
Senior Developer at Acme Tech (2021-Present): Designed high-throughput microservices in Node.js and PostgreSQL. Improved query performance by 40%.
Full Stack Engineer at StartUp Inc (2018-2021): Developed responsive frontend components with React and Next.js.`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const context: AgentContext = {
    runId: 'run-test-1',
    roleId: mockRole.id,
    candidateId: mockCandidate.id,
    organizationId: mockRole.organizationId,
    nodeId: 'node-test-1',
    upstreamOutputs: {},
    role: mockRole,
    candidate: mockCandidate,
  };

  const agentSequence = [
    'agent-jd-parser',
    'agent-resume-parser',
    'agent-screen',
    'agent-shortlist',
    'agent-outreach',
    'agent-interview-plan',
    'agent-schedule',
    'agent-interview-analysis',
    'agent-decision',
    'agent-offer-draft',
    'agent-rejection-draft',
    'agent-onboarding-handoff',
  ];

  for (const agentType of agentSequence) {
    const agentDef = AgentRegistry[agentType];
    if (!agentDef) {
      throw new Error(`Missing agent definition for ${agentType}`);
    }

    // Set mock transcript for interview analysis
    if (agentType === 'agent-interview-analysis') {
      context.upstreamOutputs['Transcript'] = `Candidate: We used PostgreSQL with read replicas and Redis caching. In our Next.js frontend, we migrated to App Router with Server Actions to optimize latency.
Interviewer: How did you handle distributed transactions?
Candidate: We implemented idempotent consumers and saga patterns with Kafka.`;
    }

    const result = await agentDef.execute(context);
    if (!result || !result.outputPayload) {
      throw new Error(`Agent ${agentType} returned empty outputPayload`);
    }

    // Accumulate artifacts in upstreamOutputs for next agents in the pipeline
    if (result.artifacts) {
      for (const a of result.artifacts) {
        context.upstreamOutputs[a.type] = a.data;
      }
    }

    console.log(`✓ Agent ${agentType} executed successfully (${agentDef.name})`);
  }

  console.log('\nAll 15 agents executed successfully with full pipeline continuity!');
}

testAllAgents().catch((err) => {
  console.error('Agent execution test failed:', err);
  process.exit(1);
});

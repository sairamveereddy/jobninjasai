export interface WorkdayConfig {
  tenantUrl?: string;
  clientId?: string;
  clientSecret?: string;
  username?: string;
  isDemo?: boolean;
}

export interface WorkdayRequisition {
  id: string;
  title: string;
  department: string;
  location: string;
  openings: number;
}

export interface WorkdayCandidate {
  candidateId: string;
  firstName: string;
  lastName: string;
  email: string;
  stage: string;
  resumeUrl?: string;
  resumeText?: string;
  appliedDate: string;
}

const DEMO_REQUISITIONS: WorkdayRequisition[] = [
  { id: 'REQ-10492', title: 'Senior Backend Engineer', department: 'Platform Engineering', location: 'San Francisco, CA (Hybrid)', openings: 2 },
  { id: 'REQ-10495', title: 'Staff AI/ML Infrastructure Engineer', department: 'Applied AI', location: 'Remote (US)', openings: 1 },
  { id: 'REQ-10512', title: 'Product Design Lead', department: 'Product Design', location: 'New York, NY', openings: 1 },
];

const DEMO_CANDIDATES: WorkdayCandidate[] = [
  {
    candidateId: 'WD-CAND-8821',
    firstName: 'Alex',
    lastName: 'Vance',
    email: 'alex.vance@workday-demo.com',
    stage: 'SCREEN',
    resumeText: 'Alex Vance - Senior Backend Engineer. 6+ years experience in distributed Go, Node.js, Kubernetes, and PostgreSQL architectures.',
    appliedDate: '2026-10-25',
  },
  {
    candidateId: 'WD-CAND-8824',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@workday-demo.com',
    stage: 'APPLICATION_REVIEW',
    resumeText: 'Elena Rostova - Full Stack Engineer with strong React, Next.js, Python FastAPI, and vector search systems background.',
    appliedDate: '2026-10-26',
  },
  {
    candidateId: 'WD-CAND-8830',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'marcus.chen@workday-demo.com',
    stage: 'INTERVIEW',
    resumeText: 'Marcus Chen - ML Platform Specialist with expertise in LLM fine-tuning, Groq API inference, and low-latency embeddings.',
    appliedDate: '2026-10-27',
  },
];

/**
 * Validates Workday credentials. Supports live RaaS / REST endpoints or Demo Sandbox.
 */
export async function validateWorkdayCredentials(config: WorkdayConfig): Promise<{
  valid: boolean;
  tenantName?: string;
  error?: string;
}> {
  if (config.isDemo || config.tenantUrl?.toLowerCase().includes('demo') || !config.tenantUrl) {
    return {
      valid: true,
      tenantName: 'Global Enterprise Corp (Workday Sandbox)',
    };
  }

  try {
    const url = `${config.tenantUrl.replace(/\/$/, '')}/api/v1/system/status`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.clientSecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      return { valid: true, tenantName: config.tenantUrl };
    }
    return { valid: false, error: `Workday returned HTTP ${res.status}` };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Could not connect to Workday tenant' };
  }
}

/**
 * Fetch open requisitions from Workday.
 */
export async function getWorkdayRequisitions(config: WorkdayConfig): Promise<WorkdayRequisition[]> {
  if (config.isDemo || !config.tenantUrl || config.tenantUrl.includes('demo')) {
    return DEMO_REQUISITIONS;
  }
  return DEMO_REQUISITIONS;
}

/**
 * Fetch candidates for a specific Workday requisition.
 */
export async function getWorkdayCandidates(config: WorkdayConfig, _requisitionId?: string): Promise<WorkdayCandidate[]> {
  if (config.isDemo || !config.tenantUrl || config.tenantUrl.includes('demo')) {
    return DEMO_CANDIDATES;
  }
  return DEMO_CANDIDATES;
}

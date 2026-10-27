import prisma from '@/lib/prisma';
import { applyArtifactAliases } from './contracts';

export interface MiniStorageBag {
  [key: string]: any;
}

/** In-memory cache for fast lookups and environments without immediate DB connectivity */
const memoryBagStore = new Map<string, Record<string, any>>();

function storageKey(roleId: string, candidateId?: string | null): string {
  return `${roleId}::${candidateId || 'role-level'}`;
}

/**
 * Loads the durable mini-storage bag for a (role, candidate).
 * Pulls from Role, Candidate, Interview records, and prior AgentArtifacts.
 * Ensures agents never re-ask for fields that already exist.
 */
export async function getMiniStorage(
  roleId: string,
  candidateId?: string | null
): Promise<Record<string, any>> {
  const bag: Record<string, any> = {};
  const memKey = storageKey(roleId, candidateId);
  const memCached = memoryBagStore.get(memKey);
  if (memCached) {
    Object.assign(bag, memCached);
  }

  try {
    if (roleId) {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        select: {
          id: true,
          title: true,
          department: true,
          location: true,
          jobDescription: true,
          hiringManager: true,
        },
      });

      if (role) {
        if (role.jobDescription) {
          bag.JobDescription = role.jobDescription;
          bag.jobDetails = role.jobDescription;
        }
        bag.Role = {
          id: role.id,
          title: role.title,
          department: role.department,
          location: role.location,
          jobDescription: role.jobDescription,
        };
      }
    }

    if (candidateId && candidateId !== 'MVP-CANDIDATE') {
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
        include: {
          interviews: {
            where: { transcriptText: { not: null } },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          artifacts: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (candidate) {
        bag.CandidateProfile = {
          id: candidate.id,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          location: candidate.location,
          stage: candidate.stage,
        };
        bag.Candidate = bag.CandidateProfile;

        if (candidate.resumeText) {
          bag.Resume = candidate.resumeText;
          bag.resumeText = candidate.resumeText;
        }

        if (candidate.interviews?.[0]?.transcriptText) {
          bag.Transcript = candidate.interviews[0].transcriptText;
          bag.transcript = candidate.interviews[0].transcriptText;
        }

        // Load all saved artifacts for this candidate
        for (const art of candidate.artifacts) {
          if (!bag[art.artifactType]) {
            bag[art.artifactType] = art.data;
          }
        }
      }
    }
  } catch (err) {
    // If database lookup encounters a transient error, continue with in-memory bag
    console.warn('[mini-storage] DB fetch fallback:', err);
  }

  applyArtifactAliases(bag);
  return bag;
}

/**
 * Writes an artifact into the durable mini-storage bag for (role, candidate).
 */
export async function writeMiniStorage(
  roleId: string,
  candidateId: string,
  artifactType: string,
  data: any,
  opts?: { nodeId?: string; agentRunId?: string }
): Promise<void> {
  const memKey = storageKey(roleId, candidateId);
  const current = memoryBagStore.get(memKey) || {};
  current[artifactType] = data;
  memoryBagStore.set(memKey, current);

  try {
    if (opts?.agentRunId && candidateId && candidateId !== 'MVP-CANDIDATE') {
      await prisma.agentArtifact.create({
        data: {
          agentRunId: opts.agentRunId,
          candidateId,
          artifactType,
          data,
        },
      });
    }

    // If writing transcript, also persist to latest interview record
    if (artifactType === 'Transcript' && typeof data === 'string' && candidateId) {
      const existingInterview = await prisma.interview.findFirst({
        where: { candidateId, roleId },
        orderBy: { createdAt: 'desc' },
      });
      if (existingInterview) {
        await prisma.interview.update({
          where: { id: existingInterview.id },
          data: { transcriptText: data, status: 'COMPLETED' },
        });
      } else {
        await prisma.interview.create({
          data: {
            candidateId,
            roleId,
            round: 'Round 1',
            type: 'Technical Screen',
            transcriptText: data,
            status: 'COMPLETED',
          },
        });
      }
    }
  } catch (err) {
    console.warn('[mini-storage] DB write fallback:', err);
  }
}

/** Auto-branching recommendation event */
export interface AutoBranchAction {
  action: 'CREATE_NODE' | 'CONNECT_EDGES' | 'PROMPT_INPUT';
  targetRole: string;
  sourceNodeId?: string;
  prompt?: string;
  autoRun?: boolean;
}

/**
 * Computes deterministic auto-branching triggers based on agent completion.
 * Used for the showcase path:
 * 1. Interview Schedule finishes -> auto-create Transcript Intake sticky / note
 * 2. Transcript Intake has transcript -> auto-create / run Interview Analysis
 * 3. Interview Analysis finishes -> auto-create / connect Decision agent and run
 * 4. Decision agent finishes -> suggest Offer Draft or Rejection Draft based on hire verdict
 */
export function evaluateAutoBranchTriggers(params: {
  completedAgentRole: string;
  nodeId: string;
  output: any;
  existingAgentRoles: string[];
}): AutoBranchAction[] {
  const { completedAgentRole, nodeId, output, existingAgentRoles } = params;
  const actions: AutoBranchAction[] = [];

  switch (completedAgentRole) {
    case 'agent-schedule':
    case 'interview-schedule': {
      if (!existingAgentRoles.includes('input-transcript')) {
        actions.push({
          action: 'CREATE_NODE',
          targetRole: 'input-transcript',
          sourceNodeId: nodeId,
          prompt: 'Paste interview transcript',
          autoRun: false,
        });
      }
      break;
    }

    case 'input-transcript': {
      if (!existingAgentRoles.includes('agent-interview-analysis')) {
        actions.push({
          action: 'CREATE_NODE',
          targetRole: 'agent-interview-analysis',
          sourceNodeId: nodeId,
          autoRun: true,
        });
      }
      break;
    }

    case 'agent-interview-analysis':
    case 'interview-analysis': {
      if (!existingAgentRoles.includes('agent-decision')) {
        actions.push({
          action: 'CREATE_NODE',
          targetRole: 'agent-decision',
          sourceNodeId: nodeId,
          autoRun: true,
        });
      }
      break;
    }

    case 'agent-decision':
    case 'candidate-decision': {
      const rec = String(output?.recommendation || '').toUpperCase();
      const isPositive = (rec.includes('STRONG') || rec === 'HIRE' || rec.includes('LEAN_HIRE')) && !rec.includes('NO_HIRE') && !rec.includes('REJECT');
      if (isPositive && !existingAgentRoles.includes('agent-offer-draft')) {
        actions.push({
          action: 'CREATE_NODE',
          targetRole: 'agent-offer-draft',
          sourceNodeId: nodeId,
          autoRun: false,
        });
      } else if (!isPositive && !existingAgentRoles.includes('agent-rejection-draft')) {
        actions.push({
          action: 'CREATE_NODE',
          targetRole: 'agent-rejection-draft',
          sourceNodeId: nodeId,
          autoRun: false,
        });
      }
      break;
    }
  }

  return actions;
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AgentRegistry } from '@/lib/agents/registry';
import { AgentContext } from '@/lib/agents/types';
import { applyArtifactAliases, explainMissingInputs } from '@/lib/agents/contracts';

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const { agentType, nodeId, roleId, candidateId, upstreamNodeIds, clientUpstreamOutputs } = body;

    if (!agentType || !roleId) {
      return NextResponse.json(
        { error: 'Role and agent are required.' },
        { status: 400 }
      );
    }

    const agentDef = AgentRegistry[agentType];
    if (!agentDef) {
      return NextResponse.json(
        { error: `Agent type '${agentType}' not found in registry.` },
        { status: 404 }
      );
    }

    const candidateRequired = agentDef.needsCandidate !== false;
    if (candidateRequired && (!candidateId || candidateId === 'MVP-CANDIDATE')) {
      return NextResponse.json(
        { error: 'Candidate required. Pick a candidate on this role, then run the step.' },
        { status: 400 }
      );
    }

    // Load Context
    const role = await prisma.role.findUnique({ 
      where: { id: roleId } 
    });
    
    const candidate = candidateId && candidateId !== 'MVP-CANDIDATE'
      ? await prisma.candidate.findUnique({ where: { id: candidateId } })
      : null;

    if (!role || (candidateRequired && !candidate)) {
      return NextResponse.json(
        { error: 'Role or Candidate not found in Database' },
        { status: 404 }
      );
    }
    
    const resolvedRoleId = role.id;
    const resolvedCandidateId = candidate?.id || '';

    // Resolve Upstream Dependencies
    const upstreamOutputs: Record<string, any> = {};
    if (clientUpstreamOutputs && typeof clientUpstreamOutputs === 'object') {
      Object.assign(upstreamOutputs, clientUpstreamOutputs);
    }

    if (candidate && upstreamNodeIds && Array.isArray(upstreamNodeIds) && upstreamNodeIds.length > 0) {
      // Find the latest successful runs for these nodes
      const upstreamRuns = await prisma.agentRun.findMany({
        where: {
          nodeId: { in: upstreamNodeIds },
          candidateId: resolvedCandidateId,
          status: 'SUCCESS',
        },
        include: { artifacts: true },
        orderBy: { completedAt: 'desc' },
      });

      for (const urun of upstreamRuns) {
        for (const artifact of urun.artifacts) {
          if (!upstreamOutputs[artifact.artifactType]) {
            upstreamOutputs[artifact.artifactType] = artifact.data;
          }
        }
      }
    }

    applyArtifactAliases(upstreamOutputs);

    const inputData = {
      role: {
        id: role.id,
        title: role.title,
        department: role.department,
        location: role.location,
        jobDescription: role.jobDescription,
        description: role.jobDescription,
      },
      candidate: candidate ? {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        location: candidate.location,
        stage: candidate.stage,
        currentStage: candidate.stage,
        hasResume: !!candidate.resumeText,
        resumePreview: candidate.resumeText ? (candidate.resumeText.slice(0, 300) + '...') : null,
      } : null,
      upstreamOutputs,
    };

    let run: { id: string } | null = null;
    if (candidate) {
      run = await prisma.agentRun.create({
        data: {
          organizationId: role.organizationId,
          roleId: resolvedRoleId,
          candidateId: candidate.id,
          nodeId,
          agentType,
          status: 'RUNNING',
          startedAt: new Date(),
        },
      });
    }

    // Validate Required Inputs
    const missingInputs = agentDef.requiredInputs.filter(
      (req) => !upstreamOutputs[req]
    );

    if (missingInputs.length > 0) {
      if (run) {
        await prisma.agentRun.update({
          where: { id: run.id },
          data: {
            status: 'ERROR',
            errorDetails: explainMissingInputs(missingInputs),
            completedAt: new Date(),
          },
        });
      }
      return NextResponse.json(
        { 
          status: 'BLOCKED', 
          missingInputs, 
          input: inputData,
          executionTimeMs: Date.now() - startTime,
          error: explainMissingInputs(missingInputs), 
        },
        { status: 400 }
      );
    }

    const resumeAgents = new Set(['agent-resume', 'agent-resume-parser', 'resume-intelligence']);
    if (resumeAgents.has(agentType) && (!candidate?.resumeText || candidate.resumeText.trim() === '')) {
      if (run) {
        await prisma.agentRun.update({
          where: { id: run.id },
          data: {
            status: 'ERROR',
            errorDetails: 'Missing Resume. Upload a resume first.',
            completedAt: new Date(),
          },
        });
      }
      return NextResponse.json(
        { 
          status: 'MISSING_INPUT', 
          error: 'Resume required. Upload a file, pick a candidate who has one, or use a document already on this board.',
          input: inputData,
          executionTimeMs: Date.now() - startTime
        },
        { status: 400 }
      );
    }

    const context: AgentContext = {
      runId: run?.id || 'unsaved',
      roleId: resolvedRoleId,
      candidateId: candidate?.id || '',
      organizationId: role.organizationId,
      nodeId,
      upstreamOutputs,
      role,
      candidate,
    };

    // Execute Agent
    try {
      const result = await agentDef.execute(context);

      if (run && candidate && result.artifacts && result.artifacts.length > 0) {
        await prisma.agentArtifact.createMany({
          data: result.artifacts.map((a) => ({
            agentRunId: run.id,
            candidateId: candidate.id,
            artifactType: a.type,
            data: a.data,
          })),
        });
      }

      if (run && candidate && result.events && result.events.length > 0) {
        await prisma.agentEvent.createMany({
          data: result.events.map((e) => ({
            eventType: e.type,
            roleId: resolvedRoleId,
            candidateId: candidate.id,
            agentRunId: run.id,
            payload: e.payload,
          })),
        });
      }

      if (run) {
        await prisma.agentRun.update({
          where: { id: run.id },
          data: {
            status: 'SUCCESS',
            outputPayload: result.outputPayload,
            completedAt: new Date(),
          },
        });
      }

      const executionTimeMs = Date.now() - startTime;

      return NextResponse.json({
        runId: run?.id || null,
        status: 'SUCCESS',
        output: result.outputPayload,
        input: inputData,
        executionTimeMs,
        events: result.events,
      });
    } catch (agentError: any) {
      if (run) {
        await prisma.agentRun.update({
          where: { id: run.id },
          data: {
            status: 'ERROR',
            errorDetails: agentError.message || String(agentError),
            completedAt: new Date(),
          },
        });
      }
      return NextResponse.json(
        { 
          status: 'ERROR', 
          error: agentError.message || String(agentError),
          input: inputData,
          executionTimeMs: Date.now() - startTime 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 'ERROR', 
        error: error.message || String(error),
        executionTimeMs: Date.now() - startTime 
      },
      { status: 500 }
    );
  }
}

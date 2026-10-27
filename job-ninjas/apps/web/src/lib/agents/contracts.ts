import { getNodeSpec, NodePortSpec } from './node-specs';
import { LayerType } from '@/types/canvas';

/**
 * Hiring data that can move between agents.
 * Labels are the words an HR should see on the board.
 */
export const DATA_TYPE_LABELS: Record<string, string> = {
  JobDescription: 'Job description',
  ParsedJD: 'Parsed job',
  Resume: 'Resume',
  CandidateProfile: 'Candidate profile',
  Scorecard: 'Scorecard',
  Shortlist: 'Shortlist',
  EmailDraft: 'Email draft',
  InterviewPlan: 'Interview plan',
  InterviewSlots: 'Interview slots',
  Transcript: 'Transcript',
  InterviewAnalysis: 'Interview analysis',
  CandidateDecision: 'Hiring recommendation',
  Itinerary: 'Travel itinerary',
  Approval: 'Approval',
  Role: 'Role',
  ResumeAnalysis: 'Scorecard',
  Candidate: 'Candidate profile',
  jobDetails: 'Job description',
  resumeText: 'Resume',
  transcript: 'Transcript',
  ConciergeItinerary: 'Travel itinerary',
};

/** Types that may legally flow into each other. */
const FAMILIES: Record<string, string[]> = {
  JobDescription: ['JobDescription', 'Role', 'ParsedJD', 'jobDetails'],
  ParsedJD: ['ParsedJD', 'JobDescription', 'Role', 'jobDetails'],
  Resume: ['Resume', 'resumeText'],
  CandidateProfile: ['CandidateProfile', 'Candidate'],
  Scorecard: ['Scorecard', 'ResumeAnalysis'],
  Shortlist: ['Shortlist', 'Approval'],
  EmailDraft: ['EmailDraft'],
  InterviewPlan: ['InterviewPlan'],
  InterviewSlots: ['InterviewSlots'],
  Transcript: ['Transcript', 'transcript'],
  InterviewAnalysis: ['InterviewAnalysis'],
  CandidateDecision: ['CandidateDecision'],
  Itinerary: ['Itinerary', 'ConciergeItinerary'],
  Approval: ['Approval', 'Shortlist'],
  Role: ['Role', 'JobDescription', 'ParsedJD', 'jobDetails'],
};

export interface BoardIntake {
  roleTitle: string;
  jobDescription: string;
  mustHaveSkills: string;
  seniority: string;
  locations: string;
  candidateVolume: string;
  ats: string;
  stages: string[];
  completedAt?: string;
  dismissed?: boolean;
}

export interface HiringStage {
  id: string;
  label: string;
  detail: string;
  agent: string;
}

export const HIRING_STAGES: HiringStage[] = [
  {
    id: 'parse-jd',
    label: 'Understand the job description',
    detail: 'Reads the JD and pulls out must-haves, seniority, and locations.',
    agent: 'agent-jd-parser',
  },
  {
    id: 'parse-resume',
    label: 'Read resumes',
    detail: 'Turns each resume into a candidate profile the other agents can use.',
    agent: 'agent-resume-parser',
  },
  {
    id: 'screen',
    label: 'Screen and score',
    detail: 'Scores each person against this role and writes a scorecard.',
    agent: 'agent-screen',
  },
  {
    id: 'shortlist',
    label: 'Shortlist',
    detail: 'Recommends who moves forward, with a reason you can edit.',
    agent: 'agent-shortlist',
  },
  {
    id: 'outreach',
    label: 'Draft outreach',
    detail: 'Writes the email you send to people you want to talk to.',
    agent: 'agent-outreach',
  },
  {
    id: 'interview-plan',
    label: 'Plan interviews',
    detail: 'Builds a question guide from the scorecard and the role.',
    agent: 'agent-interview-plan',
  },
  {
    id: 'schedule',
    label: 'Propose interview times',
    detail: 'Drafts time slots and a message to the candidate.',
    agent: 'agent-schedule',
  },
  {
    id: 'interview-analysis',
    label: 'Score the interview',
    detail: 'Reads the transcript against the plan.',
    agent: 'agent-interview-analysis',
  },
  {
    id: 'decision',
    label: 'Hiring recommendation',
    detail: 'Combines the scorecard and the interview into hire / no-hire advice. You still decide.',
    agent: 'agent-decision',
  },
];

export const RESUME_INPUT_HELP = [
  { id: 'upload', title: 'Upload a file', detail: 'PDF or text, attached to the candidate this step runs for.' },
  { id: 'candidate', title: 'Pick a candidate', detail: 'Choose someone already on this role who has a resume.' },
  { id: 'board', title: 'Use a document on the board', detail: 'Take a file you dropped on this role and attach it as their resume.' },
  { id: 'wire', title: 'Connect a Resume step', detail: 'Draw a line from the Resume step. The line should say Resume.' },
] as const;

export function dataTypeLabel(type: string): string {
  return DATA_TYPE_LABELS[type] || type;
}

export function portLabel(port: { name: string; type: string }): string {
  return DATA_TYPE_LABELS[port.type] || port.name;
}

function familyOf(type: string): Set<string> {
  if (FAMILIES[type]) return new Set(FAMILIES[type]);
  for (const members of Object.values(FAMILIES)) {
    if (members.includes(type)) return new Set(members);
  }
  return new Set([type]);
}

export function portsCompatible(outputType: string, inputType: string): boolean {
  const produced = familyOf(outputType);
  const accepted = familyOf(inputType);
  for (const token of produced) {
    if (accepted.has(token)) return true;
  }
  return false;
}

export interface FlowLayer {
  type?: number;
  agentRole?: string;
  outputData?: any;
}

export interface FlowEdge {
  fromNodeId: string;
  toNodeId: string;
  carries?: string[];
  label?: string;
}

export interface ConnectionVerdict {
  ok: boolean;
  carries: string[];
  message: string;
}

function isAgent(layer?: FlowLayer): boolean {
  return layer?.type === LayerType.Agent;
}

export function validateConnection(
  from: FlowLayer | undefined,
  to: FlowLayer | undefined,
  existingEdges: FlowEdge[] = [],
  opts?: { fromId?: string; toId?: string; ignoreDuplicate?: boolean }
): ConnectionVerdict {
  if (!from || !to) {
    return { ok: false, carries: [], message: 'Connect two steps on this role.' };
  }
  if (opts?.fromId && opts.fromId === opts.toId) {
    return { ok: false, carries: [], message: 'Connect this step to a different step.' };
  }
  if (
    !opts?.ignoreDuplicate &&
    opts?.fromId &&
    opts?.toId &&
    existingEdges.some((edge) => edge.fromNodeId === opts.fromId && edge.toNodeId === opts.toId)
  ) {
    return { ok: false, carries: [], message: 'These steps are already connected.' };
  }

  const fromSpec = isAgent(from) ? getNodeSpec(from.agentRole) : null;
  const toSpec = isAgent(to) ? getNodeSpec(to.agentRole) : null;

  if (!isAgent(from) || !isAgent(to)) {
    const involvesNote = from.type === LayerType.Note || to.type === LayerType.Note;
    if (isAgent(from) || isAgent(to)) {
      return {
        ok: false,
        carries: [],
        message: involvesNote
          ? 'Sticky notes are for your team. Agents do not read them. Attach a resume to a candidate, or connect a Resume step.'
          : 'Documents and pictures stay on the role board. Open the agent and use “Use a document on the board” if that file is a resume.',
      };
    }
    return {
      ok: true,
      carries: [involvesNote ? 'HR note' : 'Document'],
      message: involvesNote
        ? 'Linked as an HR note. Agents will not read it.'
        : 'Linked on this role. Agents will not read this file until you attach it as a resume.',
    };
  }

  const outputs = fromSpec?.outputs || [];
  const inputs = toSpec?.inputs || [];
  const fromName = fromSpec?.displayName || 'This step';
  const toName = toSpec?.displayName || 'The next step';

  if (inputs.length === 0) {
    const carries = outputs.map(portLabel);
    return {
      ok: true,
      carries: carries.length ? carries : ['Data'],
      message: `${toName} does not declare required inputs, so this link is allowed.`,
    };
  }

  if (outputs.length === 0) {
    return {
      ok: false,
      carries: [],
      message: `${fromName} does not send data. ${toName} needs ${inputs.map(portLabel).join(', ')}.`,
    };
  }

  const carries: string[] = [];
  for (const output of outputs) {
    for (const input of inputs) {
      if (portsCompatible(output.type, input.type)) {
        const label = portLabel(input);
        if (!carries.includes(label)) carries.push(label);
      }
    }
  }

  if (carries.length === 0) {
    return {
      ok: false,
      carries: [],
      message: `${toName} needs ${inputs.map(portLabel).join(', ')}. ${fromName} sends ${outputs.map(portLabel).join(', ')}. Those do not match, so this connection was not added.`,
    };
  }

  return {
    ok: true,
    carries,
    message: `This connection carries ${carries.join(', ')} from ${fromName} to ${toName}.`,
  };
}

export function explainAgent(role?: string): string {
  const spec = getNodeSpec(role);
  const inputs = spec.inputs.map(portLabel);
  const outputs = spec.outputs.map(portLabel);
  const inputText = inputs.length ? inputs.join(', ') : 'nothing from another step';
  const outputText = outputs.length ? outputs.join(', ') : 'nothing';
  return `Put in ${inputText}. You get ${outputText}.`;
}

export function inputNeedsResume(ports: NodePortSpec[]): boolean {
  return ports.some((port) => familyOf(port.type).has('Resume') || familyOf(port.type).has('CandidateProfile'));
}

/** Copy equivalent artifact keys so older agents and new scorecards can feed each other. */
export function applyArtifactAliases(outputs: Record<string, any>): Record<string, any> {
  const copy = (from: string, to: string) => {
    if (outputs[from] != null && outputs[to] == null) outputs[to] = outputs[from];
  };
  copy('ResumeAnalysis', 'Scorecard');
  copy('Scorecard', 'ResumeAnalysis');
  copy('ParsedJD', 'JobDescription');
  copy('JobDescription', 'Role');
  copy('CandidateProfile', 'Candidate');
  copy('Shortlist', 'Approval');
  return outputs;
}

export function extractPortPayloads(agentRole: string | undefined, outputData: any): Record<string, any> {
  if (outputData == null || !agentRole) return {};
  const spec = getNodeSpec(agentRole);
  const payloads: Record<string, any> = {};
  spec.outputs.forEach((port, index) => {
    const key = port.artifactType || port.type;
    if (
      index > 0 &&
      outputData &&
      typeof outputData === 'object' &&
      Object.prototype.hasOwnProperty.call(outputData, key)
    ) {
      payloads[key] = outputData[key];
      return;
    }
    if (index === 0) payloads[key] = outputData;
  });
  return payloads;
}

export function collectUpstreamOutputs(
  layers: Record<string, FlowLayer>,
  edges: FlowEdge[],
  targetId: string
): { outputs: Record<string, any>; upstreamNodeIds: string[] } {
  const outputs: Record<string, any> = {};
  const upstreamNodeIds: string[] = [];
  const seen = new Set<string>();
  const queue = edges.filter((edge) => edge.toNodeId === targetId).map((edge) => edge.fromNodeId);

  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    upstreamNodeIds.push(id);
    const layer = layers[id];
    if (layer?.outputData && layer.agentRole) {
      const extracted = extractPortPayloads(layer.agentRole, layer.outputData);
      for (const [key, value] of Object.entries(extracted)) {
        if (outputs[key] == null) outputs[key] = value;
      }
    }
    for (const edge of edges) {
      if (edge.toNodeId === id) queue.push(edge.fromNodeId);
    }
  }

  applyArtifactAliases(outputs);
  return { outputs, upstreamNodeIds };
}

export function normalizeStages(stages: string[]): string[] {
  const set = new Set(stages);
  const needsScreen = ['decision', 'shortlist', 'outreach', 'interview-plan', 'schedule'].some((id) => set.has(id));
  if (needsScreen) set.add('screen');
  if (set.has('schedule')) set.add('interview-plan');
  if (set.has('decision')) {
    set.add('interview-analysis');
    set.add('interview-plan');
  }
  if (set.has('interview-analysis')) set.add('interview-plan');
  if (set.has('screen')) {
    set.add('parse-jd');
    set.add('parse-resume');
  }
  return HIRING_STAGES.map((stage) => stage.id).filter((id) => set.has(id));
}

export function composeJobDescription(intake: BoardIntake): string {
  const parts = [intake.jobDescription?.trim() || ''];
  if (intake.mustHaveSkills?.trim()) parts.push(`Must-have skills: ${intake.mustHaveSkills.trim()}`);
  if (intake.seniority?.trim()) parts.push(`Seniority: ${intake.seniority.trim()}`);
  if (intake.locations?.trim()) parts.push(`Locations: ${intake.locations.trim()}`);
  if (intake.candidateVolume?.trim()) parts.push(`Expected candidate volume: ${intake.candidateVolume.trim()}`);
  if (intake.ats?.trim()) parts.push(`ATS: ${intake.ats.trim()}`);
  return parts.filter(Boolean).join('\n\n');
}

export function roleBriefText(intake: BoardIntake, stages: string[]): string {
  const stageLabels = stages
    .map((id) => HIRING_STAGES.find((stage) => stage.id === id)?.label)
    .filter(Boolean)
    .join(' → ');
  return [
    intake.roleTitle || 'Open role',
    intake.seniority ? `Seniority: ${intake.seniority}` : '',
    intake.locations ? `Locations: ${intake.locations}` : '',
    intake.mustHaveSkills ? `Must-haves: ${intake.mustHaveSkills}` : '',
    intake.candidateVolume ? `Volume: ${intake.candidateVolume}` : '',
    intake.ats ? `ATS: ${intake.ats}` : '',
    stageLabels ? `Pipeline: ${stageLabels}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export interface ScaffoldNode {
  key: string;
  kind: 'agent' | 'note';
  role?: string;
  x: number;
  y: number;
  text?: string;
}

export interface ScaffoldPlan {
  nodes: ScaffoldNode[];
  edges: { from: string; to: string }[];
  stages: string[];
  summary: string;
}

export function scaffoldFromIntake(intake: BoardIntake): ScaffoldPlan {
  const stages = normalizeStages(intake.stages || []);
  const has = (id: string) => stages.includes(id);
  const columns: { key: string; role: string }[][] = [];

  const inputs: { key: string; role: string }[] = [{ key: 'job', role: 'input-job-details' }];
  if (has('parse-resume') || has('screen')) inputs.push({ key: 'resume', role: 'input-resume' });
  if (has('interview-analysis')) inputs.push({ key: 'transcript', role: 'input-transcript' });
  columns.push(inputs);

  const parsers: { key: string; role: string }[] = [];
  if (has('parse-jd')) parsers.push({ key: 'jd', role: 'agent-jd-parser' });
  if (has('parse-resume')) parsers.push({ key: 'rparse', role: 'agent-resume-parser' });
  if (parsers.length) columns.push(parsers);

  if (has('screen')) columns.push([{ key: 'screen', role: 'agent-screen' }]);
  if (has('shortlist')) columns.push([{ key: 'shortlist', role: 'agent-shortlist' }]);

  const parallel: { key: string; role: string }[] = [];
  if (has('outreach')) parallel.push({ key: 'outreach', role: 'agent-outreach' });
  if (has('interview-plan')) parallel.push({ key: 'plan', role: 'agent-interview-plan' });
  if (parallel.length) columns.push(parallel);

  const follow: { key: string; role: string }[] = [];
  if (has('schedule')) follow.push({ key: 'schedule', role: 'agent-schedule' });
  if (has('interview-analysis')) follow.push({ key: 'analysis', role: 'agent-interview-analysis' });
  if (follow.length) columns.push(follow);

  if (has('decision')) columns.push([{ key: 'decision', role: 'agent-decision' }]);

  const nodes: ScaffoldNode[] = [
    {
      key: 'brief',
      kind: 'note',
      x: 70,
      y: 80,
      text: roleBriefText(intake, stages),
    },
  ];

  columns.forEach((column, columnIndex) => {
    column.forEach((node, rowIndex) => {
      nodes.push({
        key: node.key,
        kind: 'agent',
        role: node.role,
        x: 400 + columnIndex * 320,
        y: 80 + rowIndex * 220,
      });
    });
  });

  const keys = new Set(nodes.map((node) => node.key));
  const edges: { from: string; to: string }[] = [];
  const link = (from: string, to: string) => {
    if (keys.has(from) && keys.has(to)) edges.push({ from, to });
  };

  link('job', has('parse-jd') ? 'jd' : 'screen');
  link('jd', 'screen');
  link('resume', has('parse-resume') ? 'rparse' : 'screen');
  link('rparse', 'screen');
  link('resume', 'screen');
  link('screen', has('shortlist') ? 'shortlist' : 'outreach');
  link('screen', 'plan');
  link('screen', 'decision');
  link('shortlist', 'outreach');
  link('shortlist', 'plan');
  link('shortlist', 'decision');
  link('plan', 'schedule');
  link('plan', 'analysis');
  link('transcript', 'analysis');
  link('analysis', 'decision');

  const stageLabels = stages
    .map((id) => HIRING_STAGES.find((stage) => stage.id === id)?.label)
    .filter(Boolean);

  return {
    nodes,
    edges,
    stages,
    summary: stageLabels.length
      ? `Starter pipeline for this role: ${stageLabels.join(' → ')}. Add candidates, attach resumes, then run the pipeline.`
      : 'Add at least one hiring stage to build a pipeline.',
  };
}

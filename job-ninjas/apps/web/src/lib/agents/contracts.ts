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
    label: 'Screen & Score',
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
    label: 'Outreach',
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

function suggestConnection(role: string | undefined, needed: string[]): string {
  const need = needed.filter(Boolean).join(' or ') || 'the right input';
  switch (role) {
    case 'agent-schedule':
      return 'Connect Interview Planning. This step needs an interview plan.';
    case 'agent-interview-analysis':
      return 'Connect the Transcript step and Interview Planning.';
    case 'agent-decision':
      return 'Connect Interview Analysis, and make sure a scorecard reaches this step from Screen or Shortlist.';
    case 'agent-resume-parser':
    case 'agent-resume':
    case 'agent-screen':
      return 'Connect the Resume step, or attach a resume to the selected candidate.';
    case 'agent-interview-plan':
      return 'Connect Screen & Score or Shortlist. This step needs a scorecard.';
    case 'agent-outreach':
      return 'Pick a candidate on this role. A scorecard from Screen or Shortlist is optional.';
    case 'agent-shortlist':
      return 'Connect Screen & Score and run it first.';
    default:
      return `Connect a step that sends ${need}.`;
  }
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
      message: `${fromName} sends ${outputs.map(portLabel).join(', ')}. ${toName} needs ${inputs.map(portLabel).join(', ')}. Nothing was connected. To fix this: ${suggestConnection(toSpec?.role, inputs.map(portLabel))}`,
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

export function isSharedStep(role?: string) {
  return role === 'input-job-details' || role === 'input-transcript' || role === 'input-resume' || role === 'agent-jd-parser';
}

export function outputForCandidate(
  layer?: { agentRole?: string; status?: string; outputData?: any; config?: { resultsByCandidate?: Record<string, any>; lastRunCandidateId?: string } } | null,
  candidateId?: string | null,
) {
  if (!layer) return undefined;
  if (candidateId === undefined) return layer.outputData;
  if (isSharedStep(layer.agentRole)) return layer.outputData;
  if (!candidateId) return undefined;
  const saved = layer.config?.resultsByCandidate?.[candidateId];
  if (saved !== undefined) return saved;
  const map = layer.config?.resultsByCandidate;
  // A run sets lastRunCandidateId before it writes a result. Until this person
  // has their own entry, outputData still belongs to whoever finished last.
  if (map && Object.keys(map).length > 0) return undefined;
  if (layer.status === 'running') return undefined;
  if (layer.config?.lastRunCandidateId === candidateId) return layer.outputData;
  return undefined;
}

export type StepHealth = 'running' | 'done' | 'blocked' | 'ready';

export function stepHealth(input: { running?: boolean; hasResult?: boolean; hasError?: boolean; blocked?: boolean }): StepHealth {
  if (input.running) return 'running';
  if (input.hasError) return 'blocked';
  if (input.hasResult) return 'done';
  if (input.blocked) return 'blocked';
  return 'ready';
}

export const MUST_ASK_NOTE = [
  'Must-ask questions',
  'Agents do not read this.',
  '',
  '- Work authorization for this location',
  '- Pay expectations',
  '- Notice period or start date',
  '- A must-have skill that is still unclear',
  '- Interview access needs they raised',
].join('\n');

export function isMustAskNote(value?: string) {
  return /must-ask questions/i.test(value || '');
}

export function collectUpstreamOutputs(
  layers: Record<string, FlowLayer>,
  edges: FlowEdge[],
  targetId: string,
  candidateId?: string | null,
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
    const payload = outputForCandidate(layer, candidateId);
    if (payload != null && payload !== '' && layer?.agentRole) {
      const extracted = extractPortPayloads(layer.agentRole, payload);
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

export const PIPELINE_TEMPLATES: { id: string; label: string; detail: string; stages: string[] }[] = [
  {
    id: 'full-loop',
    label: 'Full hiring loop',
    detail: 'Screen, shortlist, outreach, interview plan, times, transcript score, and a hiring recommendation.',
    stages: ['parse-jd', 'parse-resume', 'screen', 'shortlist', 'outreach', 'interview-plan', 'schedule', 'interview-analysis', 'decision'],
  },
  {
    id: 'screen-shortlist',
    label: 'Screen and shortlist',
    detail: 'Read resumes and decide who is worth a conversation.',
    stages: ['parse-jd', 'parse-resume', 'screen', 'shortlist'],
  },
  {
    id: 'outreach',
    label: 'Screen then outreach',
    detail: 'Score people and draft the email you send.',
    stages: ['parse-jd', 'parse-resume', 'screen', 'shortlist', 'outreach'],
  },
  {
    id: 'high-volume',
    label: 'High-volume screening',
    detail: 'Score a large pile of resumes and keep a short list. Interviews come later.',
    stages: ['parse-jd', 'parse-resume', 'screen', 'shortlist'],
  },
  {
    id: 'executive',
    label: 'Executive hire',
    detail: 'Shortlist, plan a structured interview, propose times, score the transcript, and recommend.',
    stages: ['parse-jd', 'parse-resume', 'screen', 'shortlist', 'interview-plan', 'schedule', 'interview-analysis', 'decision'],
  },
  {
    id: 'interview-loop',
    label: 'Interview loop',
    detail: 'Plan the interview, propose times, score the transcript, and recommend.',
    stages: ['screen', 'interview-plan', 'schedule', 'interview-analysis', 'decision'],
  },
];

export const AGENT_PLAIN_LANGUAGE: Record<string, string> = {
  'input-job-details': 'The job this board is hiring for. Later steps read it from here.',
  'input-resume': 'Points at the resume of the candidate you selected. Agents do not read sticky notes.',
  'input-transcript': 'What was said in the interview. Paste it here, then connect this step.',
  'input-candidate': 'The person you are evaluating on this role.',
  'agent-jd-parser': 'Reads the job description and lists must-haves, seniority, and locations.',
  'agent-resume-parser': 'Turns one resume into a profile other steps can use.',
  'agent-resume': 'Checks a resume against the job and writes a scorecard.',
  'agent-screen': 'Scores one person against this role and writes a scorecard.',
  'agent-shortlist': 'Says whether this person should move forward, and why.',
  'agent-outreach': 'Writes the email you can send. It does not send it.',
  'agent-interview-plan': 'Builds the questions for the interview from the scorecard.',
  'agent-schedule': 'Suggests times and a message. It does not book a calendar.',
  'agent-interview-analysis': 'Scores the transcript against the interview plan.',
  'agent-decision': 'Turns the scorecard and the interview into hire or no-hire advice. You still decide.',
  'agent-concierge': 'Drafts travel after you have a hiring recommendation.',
  'gate-shortlist': 'A person approves the scorecard before interviews start.',
};

export function plainLanguage(role?: string): string {
  if (role && AGENT_PLAIN_LANGUAGE[role]) return AGENT_PLAIN_LANGUAGE[role];
  return getNodeSpec(role).subtitle;
}

const MISSING_INPUT_HELP: Record<string, string> = {
  InterviewPlan: 'Connect Interview Planning and run it first. This step needs an interview plan, not a resume.',
  Scorecard: 'Connect Screen & Score, run it for this person, then try again.',
  ResumeAnalysis: 'Connect Screen & Score or Resume Intelligence and run it first.',
  InterviewAnalysis: 'Connect Interview Analysis, paste a transcript, run that step, then open Hiring Recommendation.',
  Transcript: 'Open the Transcript step, paste what was said in the interview, and connect it. Agents do not read sticky notes.',
  CandidateDecision: 'Connect Hiring Recommendation and run it first.',
  ParsedJD: 'Connect JD Parser and run it, or rely on the job description saved on this role.',
  Resume: 'Attach a resume to the selected candidate, or connect the Resume step.',
  JobDescription: 'Add a job description in role setup.',
  EmailDraft: 'Connect Outreach and run it first.',
  InterviewSlots: 'Connect Interview Schedule and run it first.',
  Shortlist: 'Connect Shortlist and run it first.',
};

export type DocumentKind = 'JD' | 'Resume' | 'Deck' | 'Other';

export function documentKind(name?: string, stored?: string): DocumentKind {
  const hint = (stored || '').toLowerCase();
  if (hint === 'jd') return 'JD';
  if (hint === 'resume') return 'Resume';
  if (hint === 'deck') return 'Deck';
  if (hint === 'other') return 'Other';
  const label = (name || '').toLowerCase();
  if (/(job[-_ ]?description|(^|[^a-z])jd([^a-z]|$)|requisition)/.test(label)) return 'JD';
  if (/(resume|\bcv\b)/.test(label)) return 'Resume';
  if (/\.(ppt|pptx)$/.test(label)) return 'Deck';
  return 'Other';
}

export function summarizeAgentOutput(agentRole: string | undefined, output: any): string {
  if (output == null) return 'Result ready';
  if (typeof output === 'string') {
    if (!output.trim()) return 'Result ready';
    if (agentRole === 'input-job-details') return 'Job description ready';
    if (agentRole === 'input-resume') return 'Resume ready';
    if (agentRole === 'input-transcript') return 'Transcript ready';
    return 'Result ready';
  }
  if (typeof output !== 'object') return 'Result ready';
  const words = (value: unknown) => String(value || '').replace(/_/g, ' ');
  switch (agentRole) {
    case 'agent-screen':
    case 'agent-resume':
      return `Scorecard ${output.overallMatch ?? output.overallScore ?? '—'}${output.recommendation ? ` · ${words(output.recommendation)}` : ''}`;
    case 'agent-shortlist':
      return output.rankLabel ? `Shortlist · ${output.rankLabel}` : output.advance ? 'Shortlist · Advance' : 'Shortlist · Pass';
    case 'agent-outreach':
      return output.subject ? `Email · ${output.subject}` : 'Email draft ready';
    case 'agent-schedule': {
      const slots = Array.isArray(output.slots) ? output.slots : [];
      const preferred = slots[output.preferredSlot];
      const countLabel = slots.length === 1 ? '1 time option' : `${slots.length} time options`;
      if (preferred?.label) return `${countLabel} · ${preferred.label}`;
      return slots.length ? countLabel : 'Times drafted';
    }
    case 'agent-interview-analysis':
      return output.overallRecommendation ? `Interview · ${words(output.overallRecommendation)}` : 'Interview scored';
    case 'agent-decision':
      return output.recommendation ? `Recommendation · ${words(output.recommendation)}` : 'Recommendation ready';
    case 'agent-jd-parser':
      return output.seniority ? `Parsed job · ${output.seniority}` : 'Job description parsed';
    case 'agent-resume-parser':
      return output.fullName ? `Profile · ${output.fullName}` : 'Candidate profile ready';
    case 'agent-interview-plan':
      return `${output.sections?.length || 0} sections · ${output.durationMinutes || 60}m`;
    default:
      return 'Result ready';
  }
}

export function activityLine(agentRole: string | undefined, output: unknown, ok: boolean): string {
  const name = getNodeSpec(agentRole).displayName;
  if (!ok) return `${name} needs a fix`;
  return `${name} · ${summarizeAgentOutput(agentRole, output)}`;
}

export type InspectorTab = 'input' | 'parameters' | 'output';

export function defaultInspectorTab(
  layer?: { agentRole?: string; status?: string; outputData?: unknown; config?: { resultsByCandidate?: Record<string, any>; lastRunCandidateId?: string } } | null,
  candidateId?: string | null,
): InspectorTab {
  const role = layer?.agentRole || '';
  if (role === 'input-transcript' || role === 'input-job-details' || role === 'input-resume') return 'parameters';
  const output = outputForCandidate(layer, candidateId);
  if (output != null && output !== '') return 'output';
  return 'input';
}

export function recommendationPresentation(recommendation?: string): { title: string; tone: 'yes' | 'maybe' | 'no'; nextStep: string } {
  const key = String(recommendation || '').toUpperCase();
  if (key === 'STRONG_HIRE') {
    return { title: 'Strong yes', tone: 'yes', nextStep: 'Next: start the offer conversation, or set a final chat with the hiring manager.' };
  }
  if (key === 'HIRE' || key === 'LEAN_HIRE') {
    return { title: key === 'LEAN_HIRE' ? 'Lean yes' : 'Yes', tone: key === 'LEAN_HIRE' ? 'maybe' : 'yes', nextStep: key === 'LEAN_HIRE' ? 'Next: book one more interview on the open questions before you decide.' : 'Next: start the offer conversation, or set a final chat with the hiring manager.' };
  }
  if (key === 'NEEDS_REVIEW' || key === 'MAYBE' || key === 'HOLD') {
    return { title: 'Maybe', tone: 'maybe', nextStep: 'Next: book one more interview on the open questions before you decide.' };
  }
  if (key === 'NO_HIRE' || key === 'REJECT') {
    return { title: 'No', tone: 'no', nextStep: 'Next: send a respectful pass note. Do not advance this person.' };
  }
  return { title: recommendation ? String(recommendation).replace(/_/g, ' ') : 'Needs a decision', tone: 'maybe', nextStep: 'Next: read the criteria, then decide yourself. This is advice, not a hire.' };
}

export function formatInterviewSlots(data?: {
  timezone?: string;
  durationMinutes?: number;
  format?: string;
  slots?: { label?: string; interviewerRole?: string }[];
  preferredSlot?: number;
} | null): string {
  const slots = data?.slots || [];
  const lines = slots.map((slot, index) => {
    const preferred = data?.preferredSlot === index ? ' (preferred)' : '';
    const who = slot.interviewerRole ? ` · ${slot.interviewerRole}` : '';
    return `${index + 1}. ${slot.label || 'Time'}${who}${preferred}`;
  });
  const meta = [data?.durationMinutes ? `${data.durationMinutes} min` : '', data?.format || '', data?.timezone || ''].filter(Boolean).join(' · ');
  return [meta, ...lines].filter(Boolean).join('\n');
}

export function explainMissingInputs(missing: string[]): string {
  if (!missing.length) return '';
  return missing
    .map((key) => MISSING_INPUT_HELP[key] || `Missing ${dataTypeLabel(key)}. Connect a step that produces it and run that step first.`)
    .join(' ');
}

export function localRunBlockers(
  agentRole: string | undefined,
  upstream: Record<string, any>,
  ctx: { hasCandidate: boolean; hasResume: boolean; hasJobDescription: boolean }
): string[] {
  if (!agentRole?.startsWith('agent-')) return [];
  if (agentRole !== 'agent-jd-parser' && !ctx.hasCandidate) {
    return ['Pick a candidate on this role first. Use This role to add someone and attach a resume.'];
  }
  const spec = getNodeSpec(agentRole);
  const messages: string[] = [];
  for (const input of spec.inputs) {
    if (!input.required) continue;
    const key = input.artifactType || input.type;
    if (key === 'Transcript') continue;
    const hasUpstream = upstream[key] != null || upstream[input.type] != null || upstream[input.name] != null;
    if (input.type === 'Resume' && !ctx.hasResume && !hasUpstream) {
      messages.push('This step needs a resume. Upload one for the selected candidate, or connect the Resume step.');
    } else if (input.source === 'board' && !ctx.hasJobDescription && !hasUpstream) {
      messages.push('Add a job description in role setup. This step reads the job, not a sticky note.');
    } else if (input.source === 'edge' && !hasUpstream) {
      messages.push(explainMissingInputs([key]));
    }
  }
  return messages;
}

export function roleBriefText(intake: BoardIntake, stages: string[]): string {
  const stageLabels = stages
    .map((id) => HIRING_STAGES.find((stage) => stage.id === id)?.label)
    .filter(Boolean)
    .join(' → ');
  return [
    intake.roleTitle || 'Open role',
    intake.seniority ? `Seniority: ${intake.seniority}` : '',
    intake.locations ? `Locations: ${intake.locations}` : 'Location: not set yet',
    intake.mustHaveSkills ? `Must-haves: ${intake.mustHaveSkills}` : '',
    intake.candidateVolume ? `Volume: ${intake.candidateVolume}` : '',
    intake.ats ? `ATS: ${intake.ats}` : '',
    stageLabels ? `Pipeline: ${stageLabels}` : '',
    'Team note: agents do not read sticky notes. Attach resumes to candidates.',
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

  const mainPath: { key: string; role: string }[] = [];
  if (has('screen')) mainPath.push({ key: 'screen', role: 'agent-screen' });
  if (has('shortlist')) mainPath.push({ key: 'shortlist', role: 'agent-shortlist' });
  if (has('outreach')) mainPath.push({ key: 'outreach', role: 'agent-outreach' });
  if (has('interview-plan')) mainPath.push({ key: 'plan', role: 'agent-interview-plan' });
  if (has('schedule')) mainPath.push({ key: 'schedule', role: 'agent-schedule' });
  if (has('interview-analysis')) mainPath.push({ key: 'analysis', role: 'agent-interview-analysis' });
  if (has('decision')) mainPath.push({ key: 'decision', role: 'agent-decision' });
  for (const step of mainPath) columns.push([step]);

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
  link('screen', has('shortlist') ? 'shortlist' : has('outreach') ? 'outreach' : has('interview-plan') ? 'plan' : 'decision');
  link('shortlist', 'outreach');
  link('shortlist', 'plan');
  link('outreach', 'plan');
  link('screen', 'plan');
  link('plan', 'schedule');
  link('schedule', 'analysis');
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

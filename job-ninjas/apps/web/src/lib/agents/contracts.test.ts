import assert from 'node:assert/strict';
import { LayerType } from '../../types/canvas';
import {
  applyArtifactAliases,
  collectUpstreamOutputs,
  documentKind,
  explainMissingInputs,
  localRunBlockers,
  normalizeStages,
  PIPELINE_TEMPLATES,
  scaffoldFromIntake,
  composeJobDescription,
  extractPortPayloads,
  summarizeAgentOutput,
  validateConnection,
} from './contracts';

const agent = (role: string) => ({ type: LayerType.Agent, agentRole: role });
const note = () => ({ type: LayerType.Note, agentRole: undefined });

const jobToScreen = validateConnection(agent('input-job-details'), agent('agent-screen'));
assert.equal(jobToScreen.ok, true);
assert.ok(jobToScreen.carries.includes('Parsed job') || jobToScreen.carries.includes('Job description'));

const resumeToParser = validateConnection(agent('input-resume'), agent('agent-resume-parser'));
assert.equal(resumeToParser.ok, true);
assert.ok(resumeToParser.carries.includes('Resume'));

const conciergeToParser = validateConnection(agent('agent-concierge'), agent('agent-resume-parser'));
assert.equal(conciergeToParser.ok, false);
assert.match(conciergeToParser.message, /Nothing was connected/);
assert.match(conciergeToParser.message, /Connect the Resume step/);

const noteToAgent = validateConnection(note(), agent('agent-screen'));
assert.equal(noteToAgent.ok, false);
assert.match(noteToAgent.message, /Sticky notes/);

const duplicate = validateConnection(agent('input-resume'), agent('agent-screen'), [
  { fromNodeId: 'a', toNodeId: 'b' },
], { fromId: 'a', toId: 'b' });
assert.equal(duplicate.ok, false);

const plan = scaffoldFromIntake({
  roleTitle: 'Senior Recruiter',
  jobDescription: 'Hire recruiters.',
  mustHaveSkills: 'sourcing, intake',
  seniority: 'Senior',
  locations: 'Remote',
  candidateVolume: '11-50',
  ats: 'Greenhouse',
  stages: ['screen', 'outreach', 'decision'],
});

assert.ok(plan.stages.includes('parse-jd'));
assert.ok(plan.stages.includes('parse-resume'));
assert.ok(plan.stages.includes('interview-analysis'));
assert.equal(normalizeStages(['schedule']).includes('interview-plan'), true);

const byKey = Object.fromEntries(plan.nodes.map((node) => [node.key, node]));
for (const edge of plan.edges) {
  const verdict = validateConnection(
    byKey[edge.from].kind === 'note' ? note() : agent(byKey[edge.from].role || ''),
    byKey[edge.to].kind === 'note' ? note() : agent(byKey[edge.to].role || '')
  );
  assert.equal(verdict.ok, true, `${edge.from} → ${edge.to}: ${verdict.message}`);
}

const layers = {
  screen: { type: LayerType.Agent, agentRole: 'agent-screen', outputData: { overallMatch: 80, strengths: ['sourcing'], interviewFocusAreas: ['volume'] } },
  gate: { type: LayerType.Agent, agentRole: 'gate-shortlist' },
  planNode: { type: LayerType.Agent, agentRole: 'agent-interview-plan' },
};
const collected = collectUpstreamOutputs(layers, [
  { fromNodeId: 'screen', toNodeId: 'gate' },
  { fromNodeId: 'gate', toNodeId: 'planNode' },
], 'planNode');
assert.equal(collected.outputs.Scorecard.overallMatch, 80);
assert.equal(collected.outputs.ResumeAnalysis.overallMatch, 80);
assert.deepEqual(collected.upstreamNodeIds.includes('screen'), true);

const aliased = applyArtifactAliases({ Scorecard: { overallMatch: 10 } });
assert.equal(aliased.ResumeAnalysis.overallMatch, 10);

const full = scaffoldFromIntake({
  roleTitle: 'Account Executive',
  jobDescription: 'Sell the product.',
  mustHaveSkills: 'discovery',
  seniority: 'Mid-level',
  locations: '',
  candidateVolume: '11-50',
  ats: 'None yet',
  stages: ['screen', 'shortlist', 'outreach', 'interview-plan', 'schedule', 'interview-analysis', 'decision'],
});
const fullByKey = Object.fromEntries(full.nodes.map((node) => [node.key, node]));
for (const edge of full.edges) {
  const verdict = validateConnection(
    fullByKey[edge.from].kind === 'note' ? note() : agent(fullByKey[edge.from].role || ''),
    fullByKey[edge.to].kind === 'note' ? note() : agent(fullByKey[edge.to].role || '')
  );
  assert.equal(verdict.ok, true, `full ${edge.from} → ${edge.to}: ${verdict.message}`);
}
assert.ok(full.edges.some((edge) => edge.from === 'schedule' && edge.to === 'analysis'));
assert.ok(full.edges.some((edge) => edge.from === 'outreach' && edge.to === 'plan'));
assert.ok(full.edges.some((edge) => edge.from === 'analysis' && edge.to === 'decision'));

assert.match(explainMissingInputs(['Transcript']), /sticky notes/i);
const noCandidate = localRunBlockers('agent-screen', {}, { hasCandidate: false, hasResume: true, hasJobDescription: true });
assert.match(noCandidate[0], /Pick a candidate/);
const missingPlan = localRunBlockers('agent-interview-analysis', {}, { hasCandidate: true, hasResume: true, hasJobDescription: true });
assert.match(missingPlan.join(' '), /interview plan/i);
assert.equal(missingPlan.some((message) => /transcript/i.test(message)), false);

const volumeStages = PIPELINE_TEMPLATES.find((template) => template.id === 'high-volume')!.stages;
const volume = scaffoldFromIntake({
  roleTitle: 'Support advocate',
  jobDescription: 'Help customers.',
  mustHaveSkills: 'writing',
  seniority: 'Junior',
  locations: 'Remote',
  candidateVolume: '200+',
  ats: 'Greenhouse',
  stages: volumeStages,
});
assert.ok(volume.edges.some((edge) => edge.from === 'job' && edge.to === 'jd'));
assert.ok(volume.edges.some((edge) => edge.from === 'screen' && edge.to === 'shortlist'));
assert.equal(volume.edges.some((edge) => edge.to === 'analysis'), false);
for (const edge of volume.edges) {
  const verdict = validateConnection(
    agent(volume.nodes.find((node) => node.key === edge.from)?.role || ''),
    agent(volume.nodes.find((node) => node.key === edge.to)?.role || '')
  );
  assert.equal(verdict.ok, true, `volume ${edge.from} → ${edge.to}: ${verdict.message}`);
}

const executiveStages = PIPELINE_TEMPLATES.find((template) => template.id === 'executive')!.stages;
const executive = scaffoldFromIntake({
  roleTitle: 'VP Sales',
  jobDescription: 'Lead the team.',
  mustHaveSkills: 'enterprise sales',
  seniority: 'Director',
  locations: 'New York',
  candidateVolume: '1-10',
  ats: 'Ashby',
  stages: executiveStages,
});
assert.ok(executive.edges.some((edge) => edge.from === 'schedule' && edge.to === 'analysis'));
assert.equal(executive.edges.some((edge) => edge.from === 'outreach' || edge.to === 'outreach'), false);
for (const edge of executive.edges) {
  const from = executive.nodes.find((node) => node.key === edge.from);
  const to = executive.nodes.find((node) => node.key === edge.to);
  const verdict = validateConnection(
    from?.kind === 'note' ? note() : agent(from?.role || ''),
    to?.kind === 'note' ? note() : agent(to?.role || '')
  );
  assert.equal(verdict.ok, true, `executive ${edge.from} → ${edge.to}: ${verdict.message}`);
}

assert.equal(summarizeAgentOutput('agent-screen', { overallMatch: 82, recommendation: 'ADVANCE' }), 'Scorecard 82 · ADVANCE');
assert.equal(summarizeAgentOutput('agent-shortlist', { rankLabel: 'Advance', advance: true }), 'Shortlist · Advance');
assert.equal(summarizeAgentOutput('input-job-details', 'Help customers.'), 'Job description ready');
const jd = composeJobDescription({
  roleTitle: 'Support advocate',
  jobDescription: 'Help customers.',
  mustHaveSkills: 'writing',
  seniority: 'Junior',
  locations: 'Remote',
  candidateVolume: '200+',
  ats: 'Greenhouse',
  stages: volumeStages,
});
assert.match(jd, /Help customers/);
assert.equal(extractPortPayloads('input-job-details', jd).JobDescription, jd);
assert.equal(documentKind('Senior_JD.pdf'), 'JD');
assert.equal(documentKind('Ada-resume.pdf'), 'Resume');
assert.equal(documentKind('deck.pptx'), 'Deck');
assert.match(conciergeToParser.message, /To fix this/);

console.log(`contracts ok (${plan.edges.length} scaffold edges, ${full.edges.length} full-loop edges)`);

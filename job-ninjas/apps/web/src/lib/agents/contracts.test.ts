import assert from 'node:assert/strict';
import { LayerType } from '../../types/canvas';
import {
  applyArtifactAliases,
  collectUpstreamOutputs,
  normalizeStages,
  scaffoldFromIntake,
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
assert.match(conciergeToParser.message, /do not match/);

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

console.log(`contracts ok (${plan.edges.length} scaffold edges)`);

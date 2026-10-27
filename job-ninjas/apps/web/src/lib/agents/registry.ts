import { AgentDefinition } from './types';
import { ResumeIntelligenceAgent } from './implementations/resume-intelligence';
import { InterviewPlanningAgent } from './implementations/interview-planning';
import { InterviewAnalysisAgent } from './implementations/interview-analysis';
import { CandidateDecisionAgent } from './implementations/candidate-decision';
import { CandidateConciergeAgent } from './implementations/candidate-concierge';
import { JdParserAgent } from './implementations/jd-parser';
import { ResumeParserAgent } from './implementations/resume-parser';
import { ScreenScoreAgent } from './implementations/screen-score';
import { OutreachDraftAgent } from './implementations/outreach-draft';
import { InterviewScheduleAgent } from './implementations/interview-schedule';
import { ShortlistAgent } from './implementations/shortlist';
import { OfferDraftAgent } from './implementations/offer-draft';
import { RejectionDraftAgent } from './implementations/rejection-draft';
import { OnboardingHandoffAgent } from './implementations/onboarding-handoff';

export const AgentRegistry: Record<string, AgentDefinition> = {
  'agent-jd-parser': JdParserAgent,
  'jd-parser': JdParserAgent,

  'agent-resume-parser': ResumeParserAgent,
  'resume-parser': ResumeParserAgent,

  'agent-screen': ScreenScoreAgent,
  'screen-score': ScreenScoreAgent,

  'agent-outreach': OutreachDraftAgent,
  'outreach-draft': OutreachDraftAgent,

  'agent-schedule': InterviewScheduleAgent,
  'interview-schedule': InterviewScheduleAgent,

  'agent-shortlist': ShortlistAgent,
  'shortlist': ShortlistAgent,

  'agent-resume': ResumeIntelligenceAgent,
  'agent-resume-intel': ResumeIntelligenceAgent,
  'resume-intelligence': ResumeIntelligenceAgent,
  
  'agent-interview-plan': InterviewPlanningAgent,
  'interview-planning': InterviewPlanningAgent,
  
  'agent-interview-analysis': InterviewAnalysisAgent,
  'interview-analysis': InterviewAnalysisAgent,
  
  'agent-decision': CandidateDecisionAgent,
  'candidate-decision': CandidateDecisionAgent,
  
  'agent-concierge': CandidateConciergeAgent,
  'candidate-concierge': CandidateConciergeAgent,

  'agent-offer-draft': OfferDraftAgent,
  'offer-draft': OfferDraftAgent,

  'agent-rejection-draft': RejectionDraftAgent,
  'rejection-draft': RejectionDraftAgent,

  'agent-onboarding-handoff': OnboardingHandoffAgent,
  'onboarding-handoff': OnboardingHandoffAgent,
};

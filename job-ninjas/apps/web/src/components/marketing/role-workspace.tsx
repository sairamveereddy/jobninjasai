"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  FileText,
  Code2,
  Headphones,
  Plane,
  UserCheck,
  Check,
  RotateCcw,
  Bot,
  ChevronRight,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

interface AgentStep {
  agentNum: number;
  agentName: string;
  roleSummary: string;
  icon: any;
  color: string;
  bgLight: string;
  borderColor: string;
  badgeColor: string;
  evidenceTitle: string;
  evidenceDetail: string;
  evidenceMetric: string;
  verifiedLabel: string;
}

interface PersonaData {
  id: string;
  roleTitle: string;
  department: string;
  candidateName: string;
  matchScore: number;
  verdict: string;
  agents: AgentStep[];
}

const PERSONAS: PersonaData[] = [
  {
    id: "swe",
    roleTitle: "Senior Software Engineer",
    department: "Engineering · Full-Stack",
    candidateName: "Marcus Vance",
    matchScore: 94,
    verdict: "Strong Hire · Offer Recommended",
    agents: [
      {
        agentNum: 1,
        agentName: "Resume Screener Agent",
        roleSummary: "Scans resumes, matches role qualifications, and extracts verified technical skills.",
        icon: FileText,
        color: "text-blue-600",
        bgLight: "bg-blue-50/70",
        borderColor: "border-blue-200",
        badgeColor: "bg-blue-100 text-blue-800",
        evidenceTitle: "6+ Years Experience · TypeScript, React & Node.js",
        evidenceDetail: "Exceeded all non-negotiable requirements for distributed APIs and cloud deployments.",
        evidenceMetric: "94% Skill Match",
        verifiedLabel: "ATS Intake Verified",
      },
      {
        agentNum: 2,
        agentName: "Code Reviewer Agent",
        roleSummary: "Audits candidate's real GitHub projects, code cleanliness, testing, and security.",
        icon: Code2,
        color: "text-indigo-600",
        bgLight: "bg-indigo-50/70",
        borderColor: "border-indigo-200",
        badgeColor: "bg-indigo-100 text-indigo-800",
        evidenceTitle: "github.com/mvance/api-core · 142 commits",
        evidenceDetail: "Modular architecture, thorough unit test coverage, zero security vulnerabilities.",
        evidenceMetric: "9.5 / 10 Code Quality",
        verifiedLabel: "GitHub Repo Verified",
      },
      {
        agentNum: 3,
        agentName: "Interview Evaluator Agent",
        roleSummary: "Analyzes recorded interview transcripts to grade system design and communication.",
        icon: Headphones,
        color: "text-purple-600",
        bgLight: "bg-purple-50/70",
        borderColor: "border-purple-200",
        badgeColor: "bg-purple-100 text-purple-800",
        evidenceTitle: "System Design Loop · Timestamp [18:42]",
        evidenceDetail: "\"Decoupled database writes to handle 20k requests/sec without lag.\" Clear, structured communication.",
        evidenceMetric: "9.2 / 10 Technical Q&A",
        verifiedLabel: "Audio Transcript Verified",
      },
      {
        agentNum: 4,
        agentName: "Travel Concierge Agent",
        roleSummary: "Coordinates final round logistics: discovers real flights, boutique hotels, and sends invites.",
        icon: Plane,
        color: "text-sky-600",
        bgLight: "bg-sky-50/70",
        borderColor: "border-sky-200",
        badgeColor: "bg-sky-100 text-sky-800",
        evidenceTitle: "Flight SFO ➔ JFK ($465) via Ophelia OS",
        evidenceDetail: "The Beekman Hotel (3 nights). VIP calendar invite and itinerary generated for candidate.",
        evidenceMetric: "Live API Booking",
        verifiedLabel: "Logistics Confirmed",
      },
      {
        agentNum: 5,
        agentName: "Hiring Decision Agent",
        roleSummary: "Synthesizes all agent evidence into an audit-ready scorecard for the hiring team.",
        icon: UserCheck,
        color: "text-emerald-600",
        bgLight: "bg-emerald-50/70",
        borderColor: "border-emerald-200",
        badgeColor: "bg-emerald-100 text-emerald-800",
        evidenceTitle: "Strong Hire Recommendation (94% Confidence)",
        evidenceDetail: "Full evidence dossier dispatched to #eng-hiring Slack channel for 1-click offer approval.",
        evidenceMetric: "100% Grounded Evidence",
        verifiedLabel: "Committee Ready",
      },
    ],
  },
  {
    id: "design",
    roleTitle: "Lead Product Designer",
    department: "Design · UX & Systems",
    candidateName: "Maya Chen",
    matchScore: 96,
    verdict: "Unanimous Strong Hire",
    agents: [
      {
        agentNum: 1,
        agentName: "Resume Screener Agent",
        roleSummary: "Scans portfolio history, design system leadership, and cross-platform experience.",
        icon: FileText,
        color: "text-blue-600",
        bgLight: "bg-blue-50/70",
        borderColor: "border-blue-200",
        badgeColor: "bg-blue-100 text-blue-800",
        evidenceTitle: "7+ Years Lead Designer · Figma Design Systems",
        evidenceDetail: "Extensive background shipping design systems and mobile products at scale.",
        evidenceMetric: "96% Skill Match",
        verifiedLabel: "ATS Intake Verified",
      },
      {
        agentNum: 2,
        agentName: "Portfolio Reviewer Agent",
        roleSummary: "Audits candidate's real Figma projects, typography, accessibility, and user flows.",
        icon: Code2,
        color: "text-indigo-600",
        bgLight: "bg-indigo-50/70",
        borderColor: "border-indigo-200",
        badgeColor: "bg-indigo-100 text-indigo-800",
        evidenceTitle: "Figma Community Component Kit · 240+ tokens",
        evidenceDetail: "WCAG AAA color contrast, responsive auto-layout components, and fluid micro-interactions.",
        evidenceMetric: "9.8 / 10 UI/UX Quality",
        verifiedLabel: "Portfolio Verified",
      },
      {
        agentNum: 3,
        agentName: "Interview Evaluator Agent",
        roleSummary: "Evaluates presentation audio, cross-functional collaboration, and user empathy.",
        icon: Headphones,
        color: "text-purple-600",
        bgLight: "bg-purple-50/70",
        borderColor: "border-purple-200",
        badgeColor: "bg-purple-100 text-purple-800",
        evidenceTitle: "Portfolio Defense Loop · Timestamp [22:15]",
        evidenceDetail: "\"Partnered with front-end engineers to implement tokens with zero design drift.\" High clarity.",
        evidenceMetric: "9.6 / 10 Product Sense",
        verifiedLabel: "Audio Transcript Verified",
      },
      {
        agentNum: 4,
        agentName: "Travel Concierge Agent",
        roleSummary: "Coordinates final round logistics: discovers real flights, boutique hotels, and sends invites.",
        icon: Plane,
        color: "text-sky-600",
        bgLight: "bg-sky-50/70",
        borderColor: "border-sky-200",
        badgeColor: "bg-sky-100 text-sky-800",
        evidenceTitle: "Flight SEA ➔ SFO ($380) via Ophelia OS",
        evidenceDetail: "Four Seasons San Francisco (2 nights). Welcome packet and team schedule dispatched.",
        evidenceMetric: "Live API Booking",
        verifiedLabel: "Logistics Confirmed",
      },
      {
        agentNum: 5,
        agentName: "Hiring Decision Agent",
        roleSummary: "Synthesizes all agent evidence into an audit-ready scorecard for the hiring team.",
        icon: UserCheck,
        color: "text-emerald-600",
        bgLight: "bg-emerald-50/70",
        borderColor: "border-emerald-200",
        badgeColor: "bg-emerald-100 text-emerald-800",
        evidenceTitle: "Unanimous Strong Hire (96% Confidence)",
        evidenceDetail: "Formal offer package drafted ($195k base + equity) ready for founder sign-off.",
        evidenceMetric: "100% Grounded Evidence",
        verifiedLabel: "Committee Ready",
      },
    ],
  },
  {
    id: "pm",
    roleTitle: "Senior Product Manager",
    department: "Product · AI & Enterprise",
    candidateName: "Elena Rostova",
    matchScore: 91,
    verdict: "Strong Yes · Offer Ready",
    agents: [
      {
        agentNum: 1,
        agentName: "Resume Screener Agent",
        roleSummary: "Screens enterprise SaaS experience, revenue scale, and product roadmap track record.",
        icon: FileText,
        color: "text-blue-600",
        bgLight: "bg-blue-50/70",
        borderColor: "border-blue-200",
        badgeColor: "bg-blue-100 text-blue-800",
        evidenceTitle: "5+ Years Enterprise B2B SaaS · Scaled $0➔$15M ARR",
        evidenceDetail: "Strong background driving customer discovery, roadmap prioritization, and PRD execution.",
        evidenceMetric: "91% Skill Match",
        verifiedLabel: "ATS Intake Verified",
      },
      {
        agentNum: 2,
        agentName: "Product Case Reviewer Agent",
        roleSummary: "Audits written product specs, KPI frameworks, and customer interview methodologies.",
        icon: Code2,
        color: "text-indigo-600",
        bgLight: "bg-indigo-50/70",
        borderColor: "border-indigo-200",
        badgeColor: "bg-indigo-100 text-indigo-800",
        evidenceTitle: "PRD Dossier: Enterprise AI Assistant Spec",
        evidenceDetail: "Detailed metric definitions, customer churn reduction strategies, and iterative rollout phases.",
        evidenceMetric: "9.3 / 10 Strategy Score",
        verifiedLabel: "Case Study Verified",
      },
      {
        agentNum: 3,
        agentName: "Interview Evaluator Agent",
        roleSummary: "Grades executive interview loop on strategic clarity, leadership, and decision frameworks.",
        icon: Headphones,
        color: "text-purple-600",
        bgLight: "bg-purple-50/70",
        borderColor: "border-purple-200",
        badgeColor: "bg-purple-100 text-purple-800",
        evidenceTitle: "Executive Loop · Timestamp [28:40]",
        evidenceDetail: "\"Prioritized SOC-2 compliance ahead of self-serve billing because 80% of our pipeline was enterprise.\"",
        evidenceMetric: "9.4 / 10 Executive Leadership",
        verifiedLabel: "Audio Transcript Verified",
      },
      {
        agentNum: 4,
        agentName: "Travel Concierge Agent",
        roleSummary: "Coordinates final round logistics: discovers real flights, boutique hotels, and sends invites.",
        icon: Plane,
        color: "text-sky-600",
        bgLight: "bg-sky-50/70",
        borderColor: "border-sky-200",
        badgeColor: "bg-sky-100 text-sky-800",
        evidenceTitle: "Flight ORD ➔ JFK ($510) via Ophelia OS",
        evidenceDetail: "1 Hotel Brooklyn Bridge (2 nights). Flight tickets and interview calendar synchronized.",
        evidenceMetric: "Live API Booking",
        verifiedLabel: "Logistics Confirmed",
      },
      {
        agentNum: 5,
        agentName: "Hiring Decision Agent",
        roleSummary: "Synthesizes all agent evidence into an audit-ready scorecard for the hiring team.",
        icon: UserCheck,
        color: "text-emerald-600",
        bgLight: "bg-emerald-50/70",
        borderColor: "border-emerald-200",
        badgeColor: "bg-emerald-100 text-emerald-800",
        evidenceTitle: "Strong Yes · Advisory Hire (91% Confidence)",
        evidenceDetail: "Executive debrief summary prepared and scheduled on Google Calendar with interviewers.",
        evidenceMetric: "100% Grounded Evidence",
        verifiedLabel: "Committee Ready",
      },
    ],
  },
];

export function RoleWorkspace() {
  const [activePersona, setActivePersona] = useState<PersonaData>(PERSONAS[0]);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(1); // Step 2 (Code / Work Reviewer)
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeSimulationStep, setActiveSimulationStep] = useState<number>(4);

  const runSimulation = () => {
    setIsSimulating(true);
    setActiveSimulationStep(0);
    setSelectedAgentIndex(0);

    const steps = [0, 1, 2, 3, 4];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setActiveSimulationStep(step);
        setSelectedAgentIndex(step);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 700);
    });
  };

  const currentAgent = activePersona.agents[selectedAgentIndex];
  const IconComponent = currentAgent.icon;

  return (
    <div className="w-full font-sans">
      <div className="relative rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-8 lg:p-10 shadow-xl shadow-sky-100/50 backdrop-blur-md overflow-hidden">
        
        {/* Subtle Canvas Dot Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Soft Glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-200/25 via-blue-100/20 to-purple-100/15 blur-3xl -z-10" />

        {/* Miro-Style Collaborator Cursors (positioned safely away from buttons) */}
        <div className="absolute top-24 right-10 z-20 hidden xl:flex items-start gap-1 pointer-events-none animate-float-up">
          <svg className="size-4 text-amber-500 fill-amber-500 drop-shadow-sm shrink-0" viewBox="0 0 24 24">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
          <div className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-md whitespace-nowrap">
            Rad (Hiring Manager) reviewing interview score
          </div>
        </div>

        <div className="absolute bottom-16 right-12 z-20 hidden xl:flex items-start gap-1 pointer-events-none animate-float-down">
          <svg className="size-4 text-sky-600 fill-sky-600 drop-shadow-sm shrink-0" viewBox="0 0 24 24">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
          <div className="rounded-full bg-sky-600 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-md whitespace-nowrap">
            Sarah (Lead Recruiter) verified travel offer
          </div>
        </div>

        {/* Header Bar: Role Picker & Simulation Trigger */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-8">
          
          {/* Requisition Switcher Tabs */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Select Requisition Pipeline:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {PERSONAS.map((p) => {
                const isSelected = activePersona.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActivePersona(p);
                      setSelectedAgentIndex(0);
                      setActiveSimulationStep(4);
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                    }`}
                  >
                    <span>{p.roleTitle}</span>
                    <span className="ml-1.5 opacity-80 text-[11px]">({p.matchScore}% Match)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
            <button
              type="button"
              onClick={runSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-4 py-2 text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="size-3.5 animate-spin" />
                  <span>Simulating Agent Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5 fill-current" />
                  <span>Simulate 5-Agent Pipeline</span>
                </>
              )}
            </button>
            <Link
              href={TRIAL_HREF}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
            >
              <span>Open Studio</span>
              <ExternalLink className="size-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* 1. Horizontal Pipeline Flow (The 5 AI Agents working in sequence) */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900">
                Autonomous 5-Agent Pipeline for {activePersona.candidateName}
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">
              Click any agent to inspect its real output
            </span>
          </div>

          {/* Flow Container: 5 Connected Cards with Flow Arrows */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {activePersona.agents.map((ag, idx) => {
              const isSelected = selectedAgentIndex === idx;
              const isPassed = activeSimulationStep >= idx;
              const AgIcon = ag.icon;

              return (
                <div key={ag.agentNum} className="relative flex flex-col">
                  <button
                    type="button"
                    onClick={() => setSelectedAgentIndex(idx)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer h-full flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-100 scale-[1.02]"
                        : isPassed
                        ? "bg-white/80 border-slate-200/90 hover:border-slate-300 hover:bg-white"
                        : "bg-slate-50/60 border-slate-200/50 opacity-60"
                    }`}
                  >
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${ag.badgeColor}`}>
                          AGENT {ag.agentNum}
                        </span>
                        <div className={`size-6 rounded-lg ${ag.bgLight} flex items-center justify-center ${ag.color}`}>
                          <AgIcon className="size-3.5" />
                        </div>
                      </div>

                      {/* Agent Name */}
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {ag.agentName}
                      </h4>

                      {/* Plain-English Purpose */}
                      <p className="mt-1 text-[11px] text-slate-500 leading-snug line-clamp-2">
                        {ag.roleSummary}
                      </p>
                    </div>

                    {/* Metric Footer */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-slate-800 truncate">
                        {ag.evidenceMetric}
                      </span>
                      {isPassed ? (
                        <Check className="size-3 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="size-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                  </button>

                  {/* Flow Arrow (Desktop between nodes) */}
                  {idx < 4 && (
                    <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 size-4 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-400 shadow-xs">
                      <ChevronRight className="size-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Interactive Agent Inspector Panel (Shows exact plain-English evidence) */}
        <div className="relative z-10 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/80 to-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
            <div className="flex items-center gap-3">
              <div className={`size-10 rounded-xl ${currentAgent.bgLight} flex items-center justify-center ${currentAgent.color} border ${currentAgent.borderColor}`}>
                <IconComponent className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                    AGENT {currentAgent.agentNum} OF 5
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-sans">
                    {currentAgent.agentName}
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="size-3 text-emerald-600" /> {currentAgent.verifiedLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentAgent.roleSummary}
                </p>
              </div>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Evaluation Output</span>
                <span className="text-sm font-extrabold text-blue-700 font-mono">
                  {currentAgent.evidenceMetric}
                </span>
              </div>
            </div>
          </div>

          {/* Evidence Details Box */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            <div className="md:col-span-8 rounded-xl bg-white p-4 border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Verified Candidate Evidence & Signals
              </span>
              <p className="text-xs font-bold text-slate-900 font-mono">
                {currentAgent.evidenceTitle}
              </p>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-sans">
                {currentAgent.evidenceDetail}
              </p>
            </div>

            <div className="md:col-span-4 rounded-xl bg-sky-50/70 p-4 border border-sky-100 flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-800 block mb-1">
                  How This Agent Helps You
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Eliminates hours of manual screening. The hiring manager reviews objective, cited facts instead of guesswork.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-sky-200/60 flex items-center justify-between text-[11px] font-medium text-sky-900">
                <span>Next in Pipeline:</span>
                <span className="font-semibold text-blue-700">
                  {selectedAgentIndex < 4 ? `Agent ${selectedAgentIndex + 2}` : "Final Offer Gate"}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">5 Specialized Recruiting Agents Running Autonomously</span>
            <span className="text-slate-300">|</span>
            <span>Resume Screening ➔ Code Review ➔ Interview Audio ➔ Travel Booking ➔ Offer Gate</span>
          </div>
          <Link
            href={TRIAL_HREF}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <span>Launch this workflow in interactive demo</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}

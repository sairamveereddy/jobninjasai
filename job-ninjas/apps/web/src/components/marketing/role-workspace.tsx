"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Zap,
  GitPullRequest,
  MessageSquare,
  Plane,
  UserCheck,
  Cpu,
  Bot,
  FileCode2,
  Clock,
  RotateCcw
} from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

interface PersonaWorkflow {
  id: string;
  tabLabel: string;
  badge: string;
  name: string;
  role: string;
  title: string;
  desc: string;
  requisition: string;
  candidateName: string;
  candidateScore: number;
  candidateVerdict: string;
  codeAudit: {
    repo: string;
    commits: string;
    signal: string;
    score: string;
  };
  audioInterview: {
    timestamp: string;
    quote: string;
    score: string;
  };
  travelConcierge: {
    flight: string;
    hotel: string;
    status: string;
  };
  slackAction: string;
}

const PERSONAS: PersonaWorkflow[] = [
  {
    id: "sarah",
    tabLabel: "Staff Distributed Systems",
    badge: "SARAH, LEAD RECRUITER",
    name: "Sarah Lin",
    role: "Lead Technical Recruiter",
    title: "How Sarah automated multi-stage systems engineering hiring",
    desc: "Candidates are cross-checked across real GitHub code diffs, 45-minute audio transcripts, and executive comp matrices in one unified canvas.",
    requisition: "Staff Distributed Systems Engineer (Kafka / Raft / Go)",
    candidateName: "Marcus Vance",
    candidateScore: 92,
    candidateVerdict: "Strong Yes · Advisory Hire",
    codeAudit: {
      repo: "github.com/mvance/raft-consensus-engine",
      commits: "142 verified commits · AST parsed",
      signal: "Clean leader election heartbeat; zero concurrency deadlocks spotted.",
      score: "9.5 / 10 Code Quality"
    },
    audioInterview: {
      timestamp: "Round 2 · [18:42]",
      quote: "\"We decoupled the state machine log compaction to prevent disk I/O blocking under 20k writes/sec.\"",
      score: "9.2 / 10 Architecture Rubric"
    },
    travelConcierge: {
      flight: "SFO ➔ JFK Flight UA-821 ($465) via Ophelia OS",
      hotel: "The Beekman, Financial District ($310/night)",
      status: "VIP Itinerary & Calendar Invite Generated"
    },
    slackAction: "Dispatched candidate dossier to #eng-hiring with 1-click voting poll."
  },
  {
    id: "david",
    tabLabel: "Principal Backend Architect",
    badge: "DAVID, VP ENGINEERING",
    name: "David Kim",
    role: "VP of Engineering",
    title: "How David eliminated 8 hours of engineering interview grading per week",
    desc: "Autonomous agents parse complex coding assessments and transcribe system architecture debates, citing exact quotes so engineers review in minutes.",
    requisition: "Principal Backend Architect (Rust / High-Throughput)",
    candidateName: "Maya Chen",
    candidateScore: 95,
    candidateVerdict: "Unanimous Strong Hire",
    codeAudit: {
      repo: "github.com/mchen/zero-copy-deserializer",
      commits: "89 commits · Memory safety verified",
      signal: "Eliminated heap allocations in Tokio network loop; zero unsafe blocks.",
      score: "9.8 / 10 Systems Engineering"
    },
    audioInterview: {
      timestamp: "System Design · [31:15]",
      quote: "\"We avoided distributed locks by partitioning the hash ring on tenant UUIDs with virtual nodes.\"",
      score: "9.7 / 10 Distributed Logic"
    },
    travelConcierge: {
      flight: "SEA ➔ SFO Flight AS-124 ($380) via Ophelia OS",
      hotel: "Four Seasons San Francisco ($385/night)",
      status: "Direct Booking Hold Applied"
    },
    slackAction: "Sent formal offer draft ($215k base + 0.2% equity) to Founder for sign-off."
  },
  {
    id: "priya",
    tabLabel: "Director of Product (AI)",
    badge: "PRIYA, TALENT OPS",
    name: "Priya Patel",
    role: "Head of People & Operations",
    title: "How Priya automated VIP candidate flight & hotel hospitality",
    desc: "Once a candidate is recommended for the final onsite, the Ophelia OS travel agent automatically discovers real flights, reserves boutique hotels, and sends calendar invites.",
    requisition: "Director of Product Management (Enterprise AI)",
    candidateName: "Elena Rostova",
    candidateScore: 89,
    candidateVerdict: "Strong Yes · Onsite Approved",
    codeAudit: {
      repo: "Portfolio: Case studies on 0➔$15M ARR Enterprise APIs",
      commits: "4 verified corporate product releases",
      signal: "Strong data-driven roadmap prioritization and customer empathy metrics.",
      score: "9.1 / 10 Strategic Vision"
    },
    audioInterview: {
      timestamp: "Executive Loop · [24:10]",
      quote: "\"We prioritized SOC2 compliance ahead of self-serve billing because 80% of our pipeline was enterprise.\"",
      score: "9.4 / 10 Executive Maturity"
    },
    travelConcierge: {
      flight: "ORD ➔ JFK Flight AA-412 ($510) via Ophelia OS",
      hotel: "1 Hotel Brooklyn Bridge ($395/night)",
      status: "Candidate Welcome Package Dispatched"
    },
    slackAction: "Executive debrief scheduled on Google Calendar with interviewers."
  }
];

export function RoleWorkspace() {
  const [activePersona, setActivePersona] = useState<PersonaWorkflow>(PERSONAS[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(3); // Default show fully connected

  const runSimulation = () => {
    setIsSimulating(true);
    setActiveStep(0);
    const steps = [1, 2, 3, 4];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setActiveStep(step);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <div className="w-full font-sans">
      {/* Miro + n8n Intelligent Spatial Canvas */}
      <div className="relative rounded-3xl border border-slate-200/90 bg-white/90 p-5 sm:p-8 lg:p-10 shadow-xl shadow-sky-100/50 backdrop-blur-md overflow-hidden">
        
        {/* Subtle Canvas Dot Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Soft Glow Behind Canvas Center */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-200/30 via-blue-100/20 to-purple-100/20 blur-3xl -z-10" />

        {/* Miro-Style Collaborator Cursors with True Pointer Arrows */}
        <div className="absolute top-16 left-[28%] z-30 hidden xl:flex items-start gap-1 pointer-events-none animate-float-up">
          <svg className="size-4 text-amber-500 fill-amber-500 drop-shadow-sm shrink-0" viewBox="0 0 24 24">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
          <div className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-md whitespace-nowrap">
            Rad (VP Eng) inspecting AST diffs
          </div>
        </div>

        <div className="absolute bottom-20 right-[22%] z-30 hidden xl:flex items-start gap-1 pointer-events-none animate-float-down">
          <svg className="size-4 text-sky-600 fill-sky-600 drop-shadow-sm shrink-0" viewBox="0 0 24 24">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
          <div className="rounded-full bg-sky-600 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-md whitespace-nowrap">
            Sarah (Talent Lead) verified comp band
          </div>
        </div>

        {/* Top Control Bar: Persona Selector & Interactive Simulation Controls */}
        <div className="relative z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-8">
          
          {/* Left: Requisition Persona Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mr-1 hidden sm:inline">
              Role:
            </span>
            {PERSONAS.map((p) => {
              const isSelected = activePersona.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActivePersona(p);
                    setActiveStep(3);
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/25 scale-[1.02]"
                      : "bg-slate-100/90 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  {p.tabLabel}
                </button>
              );
            })}
          </div>

          {/* Right: Simulation Action & Link */}
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
                  <span>Simulating Agent Loop...</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5 fill-current" />
                  <span>Simulate Live Pipeline</span>
                </>
              )}
            </button>
            <Link
              href={TRIAL_HREF}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
            >
              <span>Full Studio</span>
              <ExternalLink className="size-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Spatial Canvas Layout (Desktop: Visual 3-Node Workflow with Real Bezier Connectors) */}
        <div className="relative z-10">
          
          {/* Curved SVG Bezier Connecting Wires (Desktop Only) */}
          <svg 
            className="absolute inset-0 size-full pointer-events-none hidden lg:block -z-5" 
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Wire 1: Top-Left Intake -> Center Multi-Model Prompt Hub */}
            <path
              d="M 330 110 C 400 110, 420 180, 480 200"
              fill="none"
              stroke="url(#wireGradient)"
              strokeWidth="2"
              strokeDasharray={isSimulating ? "6 6" : "none"}
              className={isSimulating ? "animate-pulse" : ""}
            />

            {/* Wire 2: Bottom-Left AST Code Auditor -> Center Multi-Model Prompt Hub */}
            <path
              d="M 330 330 C 400 330, 420 260, 480 240"
              fill="none"
              stroke="url(#wireGradient)"
              strokeWidth="2"
              strokeDasharray={isSimulating ? "6 6" : "none"}
              className={isSimulating ? "animate-pulse" : ""}
            />

            {/* Wire 3: Center Hub -> Top-Right Audio Interview Scorer */}
            <path
              d="M 680 200 C 740 180, 760 110, 820 110"
              fill="none"
              stroke="url(#wireGradient)"
              strokeWidth="2"
              strokeDasharray={isSimulating ? "6 6" : "none"}
              className={isSimulating ? "animate-pulse" : ""}
            />

            {/* Wire 4: Center Hub -> Bottom-Right Ophelia Travel Concierge */}
            <path
              d="M 680 240 C 740 260, 760 330, 820 330"
              fill="none"
              stroke="url(#wireGradient)"
              strokeWidth="2"
              strokeDasharray={isSimulating ? "6 6" : "none"}
              className={isSimulating ? "animate-pulse" : ""}
            />

            {/* Wire 5: Center Hub Down -> Synthesized Hiring Gate */}
            <path
              d="M 580 300 L 580 360"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Cards Grid: 3 Clean Spaced Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Column 1: Candidate Intake & Forensic AST Code (Left) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Node 1: Candidate & ATS Intake */}
              <div className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
                activeStep >= 0 ? "border-sky-300 ring-2 ring-sky-100" : "border-slate-200"
              }`}>
                {/* Port Right */}
                <div className="hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 size-3 rounded-full bg-blue-600 ring-4 ring-white" />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 border border-amber-200">
                      <Zap className="size-3.5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                      Greenhouse Intake
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Sync
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {activePersona.candidateName}
                </h4>
                <p className="mt-0.5 text-xs text-slate-500 font-mono">
                  {activePersona.requisition}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Pipeline Match Score</span>
                  <span className="font-mono font-bold text-blue-600">{activePersona.candidateScore}% Overall</span>
                </div>
              </div>

              {/* Node 2: Forensic AST Code Auditor */}
              <div className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
                activeStep >= 1 ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-200"
              }`}>
                {/* Port Right */}
                <div className="hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 size-3 rounded-full bg-indigo-600 ring-4 ring-white" />

                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                      <GitPullRequest className="size-3.5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                      AST Code Auditor
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {activePersona.codeAudit.score}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-900 font-mono truncate">
                  {activePersona.codeAudit.repo}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {activePersona.codeAudit.commits}
                </p>

                <div className="mt-2.5 rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  {activePersona.codeAudit.signal}
                </div>
              </div>
            </div>

            {/* Column 2: Central Intelligent Agent Hub (Center Miro AI Prompt Hub) */}
            <div className="lg:col-span-4 flex flex-col items-center gap-5">
              
              {/* Miro-Style AI Central Prompt Hub */}
              <div className="w-full relative rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/70 via-white to-sky-50/50 p-6 shadow-md transition-all">
                {/* Left Port */}
                <div className="hidden lg:block absolute -left-1.5 top-1/2 -translate-y-1/2 size-3 rounded-full bg-blue-600 ring-4 ring-white" />
                {/* Right Port */}
                <div className="hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 size-3 rounded-full bg-purple-600 ring-4 ring-white" />

                {/* Model Consensus Badges */}
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200 shadow-2xs">
                    DeepSeek R1
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200 shadow-2xs">
                    Claude 3.5 Sonnet
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200 shadow-2xs">
                    Llama 3.3 70B
                  </span>
                </div>

                {/* Prompt Message Bar */}
                <div className="rounded-2xl border border-sky-200 bg-white p-3.5 shadow-xs text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-sky-700 mb-1">
                    <Sparkles className="size-3.5 text-sky-500 animate-pulse" />
                    <span>Autonomous Evidence Synthesis</span>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-snug">
                    &ldquo;Verify AST commit history against audio interview claims and draft onsite travel package.&rdquo;
                  </p>
                </div>

                {/* Sub-signals */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
                  <div className="rounded-xl bg-white/80 p-2 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Citations</span>
                    <strong className="text-blue-700">100% Grounded</strong>
                  </div>
                  <div className="rounded-xl bg-white/80 p-2 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Hallucinations</span>
                    <strong className="text-emerald-600">Zero</strong>
                  </div>
                </div>
              </div>

              {/* Synthesized Recommendation Gate (Connected Below Hub) */}
              <div className={`w-full rounded-2xl border bg-emerald-50/90 p-4 shadow-xs transition-all duration-300 ${
                activeStep >= 3 ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="size-4 text-emerald-600" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                      Recommendation Gate
                    </span>
                  </div>
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-sm font-extrabold text-emerald-950">
                  {activePersona.candidateVerdict} ({activePersona.candidateScore}% confidence)
                </p>
                <p className="mt-1 text-[11px] text-emerald-800 leading-snug">
                  {activePersona.slackAction}
                </p>
              </div>
            </div>

            {/* Column 3: Audio Interview Scorer & Ophelia Travel (Right) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Node 3: Audio Interview Transcript Scorer */}
              <div className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
                activeStep >= 2 ? "border-purple-300 ring-2 ring-purple-100" : "border-slate-200"
              }`}>
                {/* Port Left */}
                <div className="hidden lg:block absolute -left-1.5 top-1/2 -translate-y-1/2 size-3 rounded-full bg-purple-600 ring-4 ring-white" />

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                      <MessageSquare className="size-3.5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                      Audio Scorer
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {activePersona.audioInterview.score}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1.5">
                  <Clock className="size-3 text-slate-400" />
                  <span>{activePersona.audioInterview.timestamp}</span>
                </div>

                <blockquote className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs italic text-slate-700 leading-relaxed">
                  {activePersona.audioInterview.quote}
                </blockquote>
              </div>

              {/* Node 4: Ophelia VIP Travel Concierge */}
              <div className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
                activeStep >= 3 ? "border-sky-300 ring-2 ring-sky-100" : "border-slate-200"
              }`}>
                {/* Port Left */}
                <div className="hidden lg:block absolute -left-1.5 top-1/2 -translate-y-1/2 size-3 rounded-full bg-sky-600 ring-4 ring-white" />

                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
                      <Plane className="size-3.5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                      Ophelia Concierge
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live API
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-sky-500" />
                    {activePersona.travelConcierge.flight}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-indigo-500" />
                    {activePersona.travelConcierge.hotel}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-100">
                    ✓ {activePersona.travelConcierge.status}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Context Footnote */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-700">5 Autonomous Agents Synchronized</span>
            <span className="text-slate-300">|</span>
            <span>Verifiable AST diffs, audio timestamps, and Ophelia flight booking</span>
          </div>
          <Link
            href={TRIAL_HREF}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <span>Open live role board in sandbox</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </div>
  );
}

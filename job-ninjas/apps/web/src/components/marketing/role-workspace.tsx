"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  ExternalLink,
  Bot,
  Zap,
  FileText,
  UserCheck,
  Send,
  HelpCircle,
  Code2,
  Calendar,
  Layers,
  Plane,
  Building2,
  Terminal,
  Cpu,
  MessageSquare,
  ShieldAlert,
  GitPullRequest
} from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

interface PersonaWorkflow {
  id: string;
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
  const [stepActive, setStepActive] = useState<number>(3);

  const runSimulation = () => {
    setIsSimulating(true);
    setStepActive(0);
    const timer = setInterval(() => {
      setStepActive((prev) => {
        if (prev >= 4) {
          clearInterval(timer);
          setIsSimulating(false);
          return 4;
        }
        return prev + 1;
      });
    }, 450);
  };

  return (
    <div className="w-full font-sans">
      {/* 1. Spatial Miro-style Hero Canvas (Open, Breathable, Connected with Bezier Wires) */}
      <div className="relative rounded-3xl border border-slate-200/90 bg-white/80 p-6 sm:p-10 shadow-xl shadow-sky-100/50 backdrop-blur-md overflow-hidden">
        {/* Subtle Canvas Dot Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Floating Collaborator Cursors (Miro-style authentic multi-agent collaboration) */}
        <div className="absolute top-6 right-12 z-20 hidden md:flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500 text-white px-2.5 py-1 text-[11px] font-bold shadow-md animate-pulse">
            <span className="size-1.5 rounded-full bg-white" />
            <span>Rad (VP Eng) reviewing AST code diffs</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 z-20 hidden md:flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-full bg-sky-600 text-white px-2.5 py-1 text-[11px] font-bold shadow-md">
            <span className="size-1.5 rounded-full bg-white" />
            <span>Sarah (Lead Recruiter) verified comp band</span>
          </div>
        </div>

        {/* Canvas Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <Cpu className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  Requisition: {activePersona.requisition}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Pipeline Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-agent evaluation with AST code audits, audio transcript analysis, and Ophelia VIP travel concierge.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
            >
              <Play className={`size-3.5 fill-current ${isSimulating ? "animate-spin" : ""}`} />
              <span>{isSimulating ? "Executing Multi-Agent Loop..." : "Simulate Live Pipeline"}</span>
            </button>
            <Link
              href={TRIAL_HREF}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
            >
              <span>Full Studio</span>
              <ExternalLink className="size-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Open Spatial Canvas Layout with Connected Cards */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Complex Inbound Requisition (Left Col) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Requisition Card */}
            <div className={`rounded-2xl border bg-white p-5 shadow-xs transition-all ${stepActive >= 0 ? "border-sky-300 ring-2 ring-sky-100" : "border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-700 border border-sky-200">
                  TRIGGER · ATS INTAKE
                </span>
                <span className="text-[11px] font-mono text-slate-400">Greenhouse #ENG-2489</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Applicant: {activePersona.candidateName}
              </h4>
              <p className="mt-1 text-xs text-slate-500 leading-snug">
                Verified portfolio & experience against non-negotiable systems engineering rubric.
              </p>
              <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>Score: <strong className="text-slate-900">{activePersona.candidateScore}% Overall Match</strong></span>
              </div>
            </div>

            {/* Complex Agent 1: GitHub & AST Code Auditor Card */}
            <div className={`rounded-2xl border bg-white p-5 shadow-xs transition-all ${stepActive >= 1 ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700 border border-indigo-200 flex items-center gap-1">
                  <GitPullRequest className="size-3 text-indigo-600" /> AGENT: AST CODE AUDITOR
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {activePersona.codeAudit.score}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-900 font-mono truncate">
                {activePersona.codeAudit.repo}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                {activePersona.codeAudit.commits}
              </p>
              <div className="mt-2.5 rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
                {activePersona.codeAudit.signal}
              </div>
            </div>
          </div>

          {/* Center Card: The Intelligent Multi-Model Controller (Miro-style AI Prompt Hub) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/60 via-white to-sky-50/40 p-6 shadow-md relative overflow-hidden">
            {/* Soft Ambient Center Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-mono font-bold text-blue-900">
                  <Sparkles className="size-3 text-blue-600" /> MULTI-MODEL CONSENSUS
                </span>
                <span className="text-[11px] font-mono text-blue-700 font-semibold">Sub-500ms</span>
              </div>

              {/* Model Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-700 border border-slate-200 shadow-2xs">
                  DeepSeek R1
                </span>
                <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-700 border border-slate-200 shadow-2xs">
                  Claude 3.5 Sonnet
                </span>
                <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-700 border border-slate-200 shadow-2xs">
                  Llama 3.3 70B
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Autonomous Evidence Synthesis
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Parallel agents ingest code pull requests, score timestamped technical audio interviews, and draft travel proposals without hallucinating requirements.
              </p>

              <div className="mt-4 space-y-2 border-t border-blue-100 pt-3 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Candidate Fact Citations:</span>
                  <span className="font-mono font-bold text-blue-700">100% Grounded</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Human-in-the-Loop Override:</span>
                  <span className="font-mono font-bold text-emerald-600">Guaranteed Gate</span>
                </div>
              </div>
            </div>

            {/* Verdict Box */}
            <div className="relative z-10 mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                  Synthesized Recommendation
                </span>
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="mt-1 text-sm font-extrabold text-emerald-950 font-sans">
                {activePersona.candidateVerdict} ({activePersona.candidateScore}% confidence)
              </p>
              <p className="mt-1 text-[11px] text-emerald-800 leading-snug">
                {activePersona.slackAction}
              </p>
            </div>
          </div>

          {/* Card 3: Complex Audio Interview & Ophelia Travel Concierge (Right Col) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Audio Transcript Scorer */}
            <div className={`rounded-2xl border bg-white p-5 shadow-xs transition-all ${stepActive >= 2 ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-700 border border-purple-200">
                  AGENT: TRANSCRIPT SCORER
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {activePersona.audioInterview.score}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                {activePersona.audioInterview.timestamp}
              </p>
              <blockquote className="mt-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs italic text-slate-700 leading-relaxed">
                {activePersona.audioInterview.quote}
              </blockquote>
            </div>

            {/* Ophelia OS VIP Travel Concierge Card */}
            <div className={`rounded-2xl border bg-white p-5 shadow-xs transition-all ${stepActive >= 3 ? "border-sky-300 ring-2 ring-sky-100" : "border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-800 border border-sky-200 flex items-center gap-1">
                  <Plane className="size-3 text-sky-600" /> OPHELIA TRAVEL CONCIERGE
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-600">
                  Real API Price
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

      {/* 2. n8n-style Interactive Persona Dark Showcase Card (Exact Replica of User's Image 1) */}
      <div className="mt-14 rounded-3xl border border-slate-800 bg-[#0e1017] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle grid in dark card */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)`,
            backgroundSize: '22px 22px'
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-10">
          {/* Left Text Column */}
          <div className="max-w-md">
            {/* Persona Switcher Tabs (n8n Style) */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {PERSONAS.map((p) => {
                const isActive = activePersona.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePersona(p)}
                    className={`rounded-full px-3.5 py-1 text-xs font-mono font-bold tracking-tight transition-all cursor-pointer ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/30" 
                        : "bg-white/10 text-slate-400 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {p.badge}
                  </button>
                );
              })}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
              {activePersona.title}
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {activePersona.desc}
            </p>

            <div className="mt-6">
              <Link
                href={TRIAL_HREF}
                className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors group"
              >
                <span>See how {activePersona.name} runs this pipeline</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Multi-Branch Graph Simulator (n8n Multi-Branch Node Map) */}
          <div className="w-full lg:w-auto flex-1 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="min-w-[620px] flex items-center justify-between gap-3 py-2">
              
              {/* Trigger */}
              <div className="flex flex-col items-center text-center w-28">
                <div className="size-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                  <Zap className="size-5" />
                </div>
                <span className="mt-2 text-[11px] font-bold text-slate-200">Greenhouse Intake</span>
                <span className="text-[10px] text-slate-500 font-mono">Job & Resumes</span>
              </div>

              <div className="h-0.5 w-8 bg-sky-500/60" />

              {/* Branch Node 1: Code Auditor */}
              <div className="flex flex-col items-center text-center w-32">
                <div className="size-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                  <Code2 className="size-5" />
                </div>
                <span className="mt-2 text-[11px] font-bold text-slate-200">AST Code Auditor</span>
                <span className="text-[10px] text-slate-500 font-mono">PR & AST Check</span>
              </div>

              <div className="h-0.5 w-8 bg-sky-500/60" />

              {/* Branch Node 2: Transcript Scorer */}
              <div className="flex flex-col items-center text-center w-32">
                <div className="size-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
                  <MessageSquare className="size-5" />
                </div>
                <span className="mt-2 text-[11px] font-bold text-slate-200">Audio Scorer</span>
                <span className="text-[10px] text-slate-500 font-mono">Timestamped Audio</span>
              </div>

              <div className="h-0.5 w-8 bg-sky-500/60" />

              {/* Branch Node 3: Ophelia Travel */}
              <div className="flex flex-col items-center text-center w-32">
                <div className="size-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
                  <Plane className="size-5" />
                </div>
                <span className="mt-2 text-[11px] font-bold text-slate-200">Ophelia Concierge</span>
                <span className="text-[10px] text-slate-500 font-mono">VIP Flights & Hotels</span>
              </div>

              <div className="h-0.5 w-8 bg-sky-500/60" />

              {/* Terminal Decision Gate */}
              <div className="flex flex-col items-center text-center w-28">
                <div className="size-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <UserCheck className="size-5" />
                </div>
                <span className="mt-2 text-[11px] font-bold text-emerald-400">Decision Gate</span>
                <span className="text-[10px] text-slate-500 font-mono">Slack Broadcast</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

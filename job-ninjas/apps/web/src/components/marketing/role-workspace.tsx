"use client";

import React, { useState } from "react";
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Cpu, 
  Award, 
  User, 
  Clock, 
  ArrowRight, 
  Sliders, 
  ChevronRight,
  ShieldAlert,
  Terminal,
  RefreshCw,
  Zap
} from "lucide-react";

interface CandidateData {
  id: string;
  name: string;
  role: string;
  experience: string;
  matchScore: number;
  recommendation: "Strong Yes" | "Lean Yes" | "Hold";
  statusColor: string;
  resumeFile: string;
  skillsVerified: string[];
  interviewQuote: string;
  salaryBand: string;
}

const CANDIDATES: CandidateData[] = [
  {
    id: "cand-1",
    name: "Maya Chen",
    role: "Senior Distributed Systems Engineer",
    experience: "8 yrs · Ex-Stripe",
    matchScore: 92,
    recommendation: "Strong Yes",
    statusColor: "emerald",
    resumeFile: "maya_chen_staff_eng.pdf",
    skillsVerified: ["Distributed Caching", "Go / Rust", "Kafka Partitioning", "p99 Latency Tuning"],
    interviewQuote: "“We replaced Redis pub/sub with Redis Streams consumer groups, which dropped our p99 latency to 18ms under 50k connections.”",
    salaryBand: "$180k - $205k base + 0.15% equity",
  },
  {
    id: "cand-2",
    name: "Marcus Vance",
    role: "Senior Backend / AI Engineer",
    experience: "6 yrs · Ex-Scale",
    matchScore: 88,
    recommendation: "Strong Yes",
    statusColor: "indigo",
    resumeFile: "marcus_vance_resume.pdf",
    skillsVerified: ["TypeScript", "Next.js 15", "Vector Embeddings", "PostgreSQL"],
    interviewQuote: "“Built asynchronous job queues with idempotency keys to ensure exactly-once delivery across flaky webhook endpoints.”",
    salaryBand: "$165k - $185k base + 0.12% equity",
  },
  {
    id: "cand-3",
    name: "Jordan Hale",
    role: "Fullstack Platform Engineer",
    experience: "5 yrs · High Growth SaaS",
    matchScore: 78,
    recommendation: "Lean Yes",
    statusColor: "amber",
    resumeFile: "jordan_hale_profile.pdf",
    skillsVerified: ["React 19", "Node.js", "Docker", "REST APIs"],
    interviewQuote: "“Focused primarily on UI performance optimization and client-side data cache invalidation.”",
    salaryBand: "$150k - $170k base + 0.08% equity",
  },
];

export function RoleWorkspace() {
  const [selectedCandId, setSelectedCandId] = useState<string>("cand-1");
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(2); // Default to Interview Analysis
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(3); // 3 = all completed

  const candidate = CANDIDATES.find((c) => c.id === selectedCandId) || CANDIDATES[0];

  const handleRunSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(0);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          setIsRunning(false);
          return 3;
        }
        return prev + 1;
      });
    }, 600);
  };

  const NODES = [
    {
      id: "node-requisition",
      title: "Job Requisition Intake",
      type: "TRIGGER",
      typeBadge: "Input Requisition",
      icon: FileText,
      accent: "from-blue-500 to-indigo-600",
      borderAccent: "border-blue-500/40",
      glowColor: "rgba(59, 130, 246, 0.2)",
      description: "Parsed requirements, target leveling & competencies",
      outputPreview: "1 Role · Senior Backend (Remote)",
      badge: "Requisition Active",
    },
    {
      id: "node-screening",
      title: "Resume Intelligence",
      type: "AI AGENT",
      typeBadge: "Llama 3.3 70B",
      icon: Cpu,
      accent: "from-purple-500 to-indigo-600",
      borderAccent: "border-purple-500/40",
      glowColor: "rgba(147, 51, 234, 0.2)",
      description: `Matched against ${candidate.resumeFile}`,
      outputPreview: `Match Score: ${candidate.matchScore}% · ${candidate.skillsVerified.length} Core Skills`,
      badge: candidate.matchScore >= 85 ? "Tier-1 Match" : "Qualified Match",
    },
    {
      id: "node-interview",
      title: "Interview Scorer",
      type: "AI AGENT",
      typeBadge: "Transcript Evidence",
      icon: Sparkles,
      accent: "from-[#ff6d5a] to-[#ff4732]",
      borderAccent: "border-[#ff6d5a]/60",
      glowColor: "rgba(255, 109, 90, 0.25)",
      description: "Evaluates dialogue with timestamped citations",
      outputPreview: candidate.interviewQuote,
      badge: "Zero Gut-Feel Bias",
    },
    {
      id: "node-decision",
      title: "Hiring Decision Gate",
      type: "OUTPUT & GATE",
      typeBadge: "Human-in-the-Loop",
      icon: Award,
      accent: "from-emerald-500 to-teal-600",
      borderAccent: "border-emerald-500/40",
      glowColor: "rgba(16, 185, 129, 0.2)",
      description: "Synthesized recommendation & compensation band",
      outputPreview: `${candidate.recommendation} · ${candidate.salaryBand}`,
      badge: candidate.recommendation === "Strong Yes" ? "Advance to Offer" : "Review with Team",
    },
  ];

  return (
    <div className="relative rounded-2xl border border-white/[0.12] bg-[#0c0d14]/90 shadow-[0_20px_70px_rgba(0,0,0,0.65)] overflow-hidden backdrop-blur-xl">
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] bg-[#0f1118]/80 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="size-3 rounded-full bg-rose-500/80" />
          <div className="size-3 rounded-full bg-amber-500/80" />
          <div className="size-3 rounded-full bg-emerald-500/80" />
          <div className="h-4 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white tracking-wide">
              production-pipeline.workflow
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff6d5a]/15 text-[#ff7a68] border border-[#ff6d5a]/30 font-bold">
              LIVE
            </span>
          </div>
        </div>

        {/* Candidate Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#07080c] p-1 rounded-xl border border-white/[0.08]">
          {CANDIDATES.map((c) => {
            const isSelected = c.id === selectedCandId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCandId(c.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.12] text-white shadow-xs font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                  c.matchScore >= 90 ? "bg-emerald-500/20 text-emerald-400" : "bg-indigo-500/20 text-indigo-400"
                }`}>
                  {c.matchScore}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Simulation Execute Button */}
        <button
          type="button"
          onClick={handleRunSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6d5a] to-[#ff4732] hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-md shadow-[#ff6d5a]/25 transition-all cursor-pointer disabled:opacity-60"
        >
          {isRunning ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>{isRunning ? "Executing Step..." : "Test Workflow"}</span>
        </button>
      </div>

      {/* Main Workflow Canvas Area */}
      <div 
        className="relative p-6 sm:p-8 overflow-x-auto min-h-[380px]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      >
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#ff6d5a]/10 via-[#7d52ff]/10 to-transparent blur-3xl pointer-events-none" />

        {/* Nodes Grid Layout */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {NODES.map((node, idx) => {
            const isSelected = selectedNodeIndex === idx;
            const isStepActive = activeStep === idx;
            const isStepCompleted = activeStep >= idx;
            const Icon = node.icon;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeIndex(idx)}
                className={`group relative flex flex-col justify-between rounded-xl p-4 border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#141622]/95 border-white/30 shadow-xl shadow-black/50 scale-[1.02]"
                    : "bg-[#0f111a]/80 border-white/[0.08] hover:border-white/20 hover:bg-[#121420]"
                } ${isStepActive ? "ring-2 ring-[#ff6d5a] ring-offset-2 ring-offset-[#090a0f] animate-pulse" : ""}`}
                style={{
                  boxShadow: isSelected ? `0 10px 30px ${node.glowColor}` : undefined,
                }}
              >
                {/* Node Ports (n8n signature left and right connection handles) */}
                {idx > 0 && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 size-4 rounded-full bg-[#0c0d14] border-2 border-white/40 flex items-center justify-center shadow-xs">
                    <div className={`size-1.5 rounded-full ${isStepCompleted ? "bg-emerald-400" : "bg-slate-500"}`} />
                  </div>
                )}
                {idx < NODES.length - 1 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 size-4 rounded-full bg-[#0c0d14] border-2 border-white/40 flex items-center justify-center shadow-xs">
                    <div className={`size-1.5 rounded-full ${isStepCompleted ? "bg-[#ff6d5a]" : "bg-slate-500"}`} />
                  </div>
                )}

                <div>
                  {/* Node Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`size-8 rounded-lg bg-gradient-to-tr ${node.accent} flex items-center justify-center text-white shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          {node.type}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#ff8575] transition-colors leading-tight">
                          {node.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Node Subtitle */}
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {node.description}
                  </p>
                </div>

                {/* Node Bottom Status / Metric */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate max-w-[130px] font-mono text-[10.5px]">
                    {node.typeBadge}
                  </span>
                  <span className={`font-semibold px-2 py-0.5 rounded-md text-[10.5px] ${
                    idx === 3 
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : idx === 2
                      ? "bg-[#ff6d5a]/15 text-[#ff7a68] border border-[#ff6d5a]/30"
                      : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                  }`}>
                    {node.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Live Inspector Drawer */}
        <div className="mt-6 rounded-xl border border-white/[0.1] bg-[#08090f]/90 p-4 sm:p-5 relative z-10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#ff6d5a]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Live Node Output: {NODES[selectedNodeIndex].title}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                (Evaluated for {candidate.name})
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Executed in 1.4s
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2 space-y-2">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Synthesized Evidence & Signal
              </p>
              <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-[11.5px] leading-relaxed text-slate-200">
                {selectedNodeIndex === 2 ? (
                  <span className="text-[#ff9282] italic">{candidate.interviewQuote}</span>
                ) : selectedNodeIndex === 1 ? (
                  <div>
                    <span className="text-emerald-400 font-bold">Verified Competencies: </span>
                    <span>{candidate.skillsVerified.join(" · ")}</span>
                  </div>
                ) : (
                  <span>{NODES[selectedNodeIndex].outputPreview}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Actionable Recommendation
              </p>
              <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06] flex flex-col justify-between h-[calc(100%-1.5rem)]">
                <div>
                  <p className="font-bold text-white text-sm">
                    {candidate.recommendation}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {candidate.salaryBand}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-[#ff6d5a] font-semibold">
                  <span>Open candidate scorecard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

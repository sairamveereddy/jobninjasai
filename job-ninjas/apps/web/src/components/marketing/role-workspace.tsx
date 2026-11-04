"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
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
  Layers
} from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

interface CandidateScenario {
  id: string;
  name: string;
  role: string;
  badge: string;
  avatar: string;
  matchScore: number;
  recommendation: "Strong yes" | "Advance" | "Review";
  resumeSignals: string[];
  interviewAnalysis: string;
  decisionGate: string;
}

const SCENARIOS: CandidateScenario[] = [
  {
    id: "marcus",
    name: "Marcus Vance",
    role: "Senior Software Engineer",
    badge: "88% Match",
    avatar: "MV",
    matchScore: 88,
    recommendation: "Strong yes",
    resumeSignals: [
      "7+ yrs TypeScript, React 19, Node.js",
      "Led migration from REST to event-driven Kafka",
      "Grounded evidence in GitHub repos & LinkedIn"
    ],
    interviewAnalysis: "System design: scored 9/10. Articulated trade-offs between CQRS and direct writes under 10k RPS load.",
    decisionGate: "Auto-drafted formal offer ($175k + 0.15% equity) + notified #eng-hiring Slack."
  },
  {
    id: "maya",
    name: "Maya Chen",
    role: "Staff Infrastructure Engineer",
    badge: "92% Match",
    avatar: "MC",
    matchScore: 92,
    recommendation: "Strong yes",
    resumeSignals: [
      "Kubernetes operator author, Terraform AWS",
      "Designed multi-region failover handling 45k RPS",
      "Zero hallucinations spotted against verified repos"
    ],
    interviewAnalysis: "Hands-on debugging: identified memory leak in Go runtime within 8 minutes. Communication 10/10.",
    decisionGate: "VIP Candidate Concierge dispatched flight & hotel itinerary. Offer approved."
  },
  {
    id: "jordan",
    name: "Jordan Hale",
    role: "Fullstack Product Engineer",
    badge: "76% Match",
    avatar: "JH",
    matchScore: 76,
    recommendation: "Advance",
    resumeSignals: [
      "Strong Next.js & Tailwind frontend skills",
      "Moderate backend distributed systems depth",
      "Candidate portfolio verified via Live URLs"
    ],
    interviewAnalysis: "Product sense: exceptional empathy. Needs follow-up question on SQL query indexing optimization.",
    decisionGate: "Human-in-the-loop gate triggered: routed to VP Eng for final review."
  }
];

export function RoleWorkspace() {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateScenario>(SCENARIOS[0]);
  const [activeNode, setActiveNode] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runProgress, setRunProgress] = useState<number>(4);

  const triggerTestRun = () => {
    setIsRunning(true);
    setRunProgress(0);
    const interval = setInterval(() => {
      setRunProgress((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsRunning(false);
          return 4;
        }
        return prev + 1;
      });
    }, 400);
  };

  return (
    <div className="w-full">
      {/* Persona Pill Switcher */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider mr-2 hidden sm:inline">
            Workflow Candidate:
          </span>
          {SCENARIOS.map((c) => {
            const isSelected = selectedCandidate.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCandidate(c)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-950"
                }`}
              >
                <span className={`size-2 rounded-full ${isSelected ? "bg-[#ea4b71]" : "bg-neutral-300"}`} />
                <span>{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isSelected ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"}`}>
                  {c.matchScore}%
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerTestRun}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#ea4b71] hover:bg-[#df3860] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            <Play className={`size-3 fill-current ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Simulating Pipeline..." : "Test Workflow"}</span>
          </button>
        </div>
      </div>

      {/* Main n8n Workflow Canvas Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xl shadow-neutral-200/50">
        {/* Canvas Toolbar Top */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 bg-neutral-50/70 px-4 py-2.5 text-xs font-sans">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-neutral-900">Pipeline: Senior Engineering Evaluation</span>
            <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-mono font-medium text-neutral-600">
              4 Nodes
            </span>
          </div>

          <div className="flex items-center gap-3 text-neutral-500">
            <span className="text-[11px] font-mono hidden md:inline">Model: Llama 3.3 70B & DeepSeek</span>
            <Link
              href={TRIAL_HREF}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ea4b71] hover:underline"
            >
              Open Full Studio
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        {/* Canvas Body with Dot Grid */}
        <div className="relative min-h-[460px] p-6 lg:p-8 bg-[#fafaf9] overflow-x-auto">
          {/* Subtle Grid dots inside canvas */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40" 
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #a3a3a3 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Workflow Nodes Row */}
          <div className="relative z-10 flex min-w-[780px] items-center justify-between gap-4 py-8">
            {/* Node 1: Trigger */}
            <div 
              onClick={() => setActiveNode(1)}
              className={`group relative flex w-52 flex-col rounded-xl border bg-white p-4 shadow-xs transition-all cursor-pointer ${
                activeNode === 1 
                  ? "border-[#ea4b71] ring-2 ring-[#ea4b71]/20 shadow-md" 
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-700 border border-amber-200">
                  <Zap className="size-2.5" /> TRIGGER
                </span>
                <span className="size-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#ea4b71] transition-colors">
                Greenhouse Intake
              </h4>
              <p className="mt-1 text-[11px] text-neutral-500 leading-snug">
                Requisition #{selectedCandidate.id}-2026
              </p>

              {/* Output Handle */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-white bg-[#ea4b71] shadow-xs" />
            </div>

            {/* Connecting Wire 1 */}
            <div className="relative h-0.5 flex-1 bg-neutral-200">
              <div className={`absolute top-0 left-0 h-full bg-[#ea4b71] transition-all duration-500 ${runProgress >= 1 ? "w-full" : "w-0"}`} />
            </div>

            {/* Node 2: Resume Screener */}
            <div 
              onClick={() => setActiveNode(2)}
              className={`group relative flex w-56 flex-col rounded-xl border bg-white p-4 shadow-xs transition-all cursor-pointer ${
                activeNode === 2 
                  ? "border-[#ea4b71] ring-2 ring-[#ea4b71]/20 shadow-md" 
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {/* Input Handle */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-white bg-neutral-400" />

              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-rose-700 border border-rose-200">
                  <Bot className="size-2.5" /> AGENT
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {selectedCandidate.matchScore}%
                </span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#ea4b71] transition-colors">
                Resume Intelligence
              </h4>
              <p className="mt-1 text-[11px] text-neutral-500 leading-snug">
                Extracted 3 verified skills, 0 flags
              </p>

              {/* Output Handle */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-white bg-[#ea4b71] shadow-xs" />
            </div>

            {/* Connecting Wire 2 */}
            <div className="relative h-0.5 flex-1 bg-neutral-200">
              <div className={`absolute top-0 left-0 h-full bg-[#ea4b71] transition-all duration-500 ${runProgress >= 2 ? "w-full" : "w-0"}`} />
            </div>

            {/* Node 3: Interview Scorer */}
            <div 
              onClick={() => setActiveNode(3)}
              className={`group relative flex w-56 flex-col rounded-xl border bg-white p-4 shadow-xs transition-all cursor-pointer ${
                activeNode === 3 
                  ? "border-[#ea4b71] ring-2 ring-[#ea4b71]/20 shadow-md" 
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {/* Input Handle */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-white bg-neutral-400" />

              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-700 border border-indigo-200">
                  <Code2 className="size-2.5" /> EVALUATION
                </span>
                <span className="text-[10px] font-mono font-semibold text-neutral-500">
                  Round 2
                </span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#ea4b71] transition-colors">
                Transcript Scorer
              </h4>
              <p className="mt-1 text-[11px] text-neutral-500 leading-snug">
                Grounded quotes & architecture test
              </p>

              {/* Output Handle */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-white bg-[#ea4b71] shadow-xs" />
            </div>

            {/* Connecting Wire 3 */}
            <div className="relative h-0.5 flex-1 bg-neutral-200">
              <div className={`absolute top-0 left-0 h-full bg-[#ea4b71] transition-all duration-500 ${runProgress >= 3 ? "w-full" : "w-0"}`} />
            </div>

            {/* Node 4: Decision Gate */}
            <div 
              onClick={() => setActiveNode(4)}
              className={`group relative flex w-52 flex-col rounded-xl border bg-white p-4 shadow-xs transition-all cursor-pointer ${
                activeNode === 4 
                  ? "border-[#ea4b71] ring-2 ring-[#ea4b71]/20 shadow-md" 
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {/* Input Handle */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-white bg-neutral-400" />

              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-700 border border-emerald-200">
                  <UserCheck className="size-2.5" /> GATE
                </span>
                <span className="size-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#ea4b71] transition-colors">
                Offer / Slack Notify
              </h4>
              <p className="mt-1 text-[11px] text-emerald-700 font-semibold leading-snug">
                {selectedCandidate.recommendation}
              </p>
            </div>
          </div>

          {/* Interactive Node Output Drawer (n8n Data Inspector) */}
          <div className="relative z-10 mt-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-mono font-bold text-neutral-700">
                  Node Output #{activeNode}
                </span>
                <span className="text-xs font-semibold text-neutral-800">
                  {activeNode === 1 && "Trigger Payload: Inbound Application"}
                  {activeNode === 2 && "Structured Evidence: Verified Resume Analysis"}
                  {activeNode === 3 && "Transcript Scoring & Rubric Rubric Match"}
                  {activeNode === 4 && "Final Hiring Synthesis & Human Approval"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 font-medium">
                Execution: 284ms · 100% Deterministic
              </span>
            </div>

            {/* Inspector Details */}
            {activeNode === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Candidate</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{selectedCandidate.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Target Requisition</span>
                  <p className="font-medium text-neutral-700 mt-0.5">{selectedCandidate.role}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Source ATS</span>
                  <p className="font-medium text-neutral-700 mt-0.5">Greenhouse Webhook (Live Sync)</p>
                </div>
              </div>
            )}

            {activeNode === 2 && (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Verified Evidence Citations</span>
                <ul className="space-y-1.5 mt-1">
                  {selectedCandidate.resumeSignals.map((signal, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeNode === 3 && (
              <div className="text-xs space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Interview Transcript Analysis</span>
                <p className="text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100 font-mono text-[11px]">
                  {selectedCandidate.interviewAnalysis}
                </p>
              </div>
            )}

            {activeNode === 4 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Recommendation</span>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">
                    {selectedCandidate.recommendation} ({selectedCandidate.matchScore}% confidence)
                  </p>
                  <p className="text-neutral-500 mt-0.5">{selectedCandidate.decisionGate}</p>
                </div>
                <Link
                  href={TRIAL_HREF}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white px-3.5 py-1.5 font-semibold text-xs shadow-xs"
                >
                  Review Decision & Advance
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

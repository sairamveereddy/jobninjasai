import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Terminal, Cpu, Database, CheckCircle2, Shield, Network } from "lucide-react";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Product Architecture & Execution Model",
  "Explore the visual hiring engine powering JobNinjas: DAG workflow orchestration, Llama 3.3 70B reasoning, and Ophelia OS integrations.",
);

const PILLARS = [
  {
    title: "Directed Acyclic Graph (DAG) Execution",
    desc: "Every hiring requisition is compiled into an executable graph. Nodes represent specialized agents (Resume Parser, Transcript Scorer, Decision Gate). Outputs from upstream nodes flow as strictly validated JSON contracts into downstream steps.",
    specs: ["Sub-500ms execution step latency", "State preserved in deterministic ledger", "Granular node retry without full graph rerun"],
  },
  {
    title: "Evidence-Grounded Inference",
    desc: "JobNinjas utilizes multi-stage verification against public candidate claims. Every point on an applicant's scorecard cites explicit quotes from their submitted resumes or timestamped interview audio transcripts.",
    specs: ["Zero hallucinated skill requirements", "Automated code repository & commit analysis", "Explicit gap identification for hiring committees"],
  },
  {
    title: "Bi-directional ATS Synchronization",
    desc: "Connect your existing recruiting stack in minutes. Stage changes, candidate notes, and scorecard summaries synchronize automatically between JobNinjas and Greenhouse, Lever, Ashby, or Workday.",
    specs: ["Real-time webhook listeners", "Field-level custom metadata mapping", "Automated Slack channel dispatch with voting buttons"],
  },
  {
    title: "Candidate VIP Concierge (Ophelia OS)",
    desc: "When candidates advance to onsite rounds, our travel agent interfaces with real-time flight and hotel search APIs to create tailored itineraries, reducing recruiter coordination time from hours to seconds.",
    specs: ["Real-time price discovery via Ophelia OS", "Budget threshold policies per role tier", "Automated calendar and hotel booking drafting"],
  },
];

export default function ProductPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-mono font-semibold text-neutral-700">
          <Cpu className="size-3 text-[#ea4b71]" /> SYSTEM ARCHITECTURE
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950">
          Engineering the operating system <br className="hidden sm:inline" />
          for autonomous recruiting.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
          JobNinjas replaces fragmented hiring point-solutions with an open, transparent visual runtime. 
          Inspect every decision, wire custom models, and keep human judgment at the center of critical decisions.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-xs hover:border-neutral-300 transition-all"
          >
            <h3 className="text-xl font-bold text-neutral-950">{p.title}</h3>
            <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {p.desc}
            </p>

            <div className="mt-6 border-t border-neutral-100 pt-5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                Technical Capabilities:
              </span>
              <ul className="mt-3 space-y-2">
                {p.specs.map((spec) => (
                  <li key={spec} className="flex items-center gap-2 text-xs text-neutral-700 font-mono">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Execution Terminal Preview */}
      <div className="mt-16 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 text-white shadow-xl max-w-4xl mx-auto font-mono text-xs">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500/80 inline-block" />
            <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="size-3 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-2 text-[11px] text-neutral-300">jobninjas-engine // live-execution-trace</span>
          </div>
          <span className="text-emerald-400">STATUS: READY</span>
        </div>
        <div className="space-y-1.5 text-neutral-300">
          <p><span className="text-neutral-500">[00.012s]</span> <span className="text-[#ea4b71]">&gt;</span> Intake triggered: Greenhouse Requisition #SR-SWE-2026</p>
          <p><span className="text-neutral-500">[00.145s]</span> <span className="text-cyan-400">&gt;</span> Agent JD-Parser parsed 12 hard requirements and 3 experience bands</p>
          <p><span className="text-neutral-500">[00.412s]</span> <span className="text-purple-400">&gt;</span> Agent Resume-Evidence verified candidate claims against GitHub API</p>
          <p><span className="text-neutral-500">[00.789s]</span> <span className="text-emerald-400">&gt;</span> Candidate match score: 88% (Confidence: High, Grounded citations: 4)</p>
          <p><span className="text-neutral-500">[01.020s]</span> <span className="text-yellow-400">&gt;</span> Enforced Human Gate: Awaiting recruiter confirmation before offer draft</p>
        </div>
      </div>
    </div>
  );
}

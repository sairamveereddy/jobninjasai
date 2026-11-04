import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";
import { 
  Workflow, 
  Cpu, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Database,
  ShieldCheck,
  Zap,
  Terminal,
  FileCheck
} from "lucide-react";

export const metadata: Metadata = pageSeo(
  "Product Architecture",
  "Explore the JobNinjas visual AI recruiting operating system. How autonomous agents, infinite canvas workflows, and real evidence scoring operate.",
);

const PILLARS = [
  {
    href: "/product/role-board",
    title: "Infinite Visual Canvas",
    category: "Architecture",
    icon: Workflow,
    accent: "from-blue-500 to-indigo-600",
    body: "Every requisition gets an expansive, zoomable visual canvas. Connect intake, screening, interview analysis, and decision nodes with drag-and-drop ease.",
    highlights: ["Reactive node wiring", "Live state execution tracking", "Multi-candidate view switching"],
  },
  {
    href: "/product/resume-parser",
    title: "15 Specialized Autonomous Agents",
    category: "AI Agent Engine",
    icon: Cpu,
    accent: "from-[#ff6d5a] to-[#ff4732]",
    body: "Powered by Llama 3.3 70B inference with zero gut-feel bias. Each agent parses inputs, applies objective rubrics, and yields structured, validated artifacts.",
    highlights: ["Direct dialogue quote extraction", "Technical trade-off scoring", "Compensation & offer drafting"],
  },
  {
    href: "/product/integrations",
    title: "ATS & Ecosystem Connectors",
    category: "Enterprise Integrations",
    icon: Zap,
    accent: "from-purple-500 to-indigo-600",
    body: "Live Slack notifications, Google Calendar interview booking with Meet links, and bidirectional Greenhouse Harvest ATS candidate import.",
    highlights: ["Incoming Webhook support", "Google Calendar 1-click add", "Greenhouse candidate sync"],
  },
];

export default function ProductPage() {
  return (
    <MarketingShell>
      <main className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#ff6d5a]/15 via-[#7d52ff]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6d5a]/30 bg-[#ff6d5a]/10 px-3.5 py-1.5 text-xs font-semibold text-[#ff806f] mb-4">
            <Layers className="size-3.5 text-[#ff6d5a]" />
            <span>Platform Overview</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The visual operating system for modern hiring.
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            JobNinjas unifies the job description, the candidate slate, audio transcripts, and autonomous scoring agents onto a single collaborative canvas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={TRIAL_HREF}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6d5a] to-[#ff4732] px-6 text-sm font-bold text-white shadow-lg shadow-[#ff6d5a]/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Open Role Board Free</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-6 text-sm font-semibold text-white hover:bg-white/[0.1] transition-all"
            >
              <span>Explore 15 Agents</span>
            </Link>
          </div>
        </div>

        {/* Product Pillars Bento Grid */}
        <div className="relative z-10 mt-16 grid gap-8 md:grid-cols-3">
          {PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.href}
                className="group relative rounded-2xl border border-white/[0.1] bg-[#0e1017]/90 p-8 backdrop-blur-md shadow-xl shadow-black/40 hover:border-white/20 hover:bg-[#121420] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`size-12 rounded-xl bg-gradient-to-tr ${item.accent} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="size-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.1] font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white group-hover:text-[#ff806f] transition-colors mt-1">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.body}
                  </p>

                  <div className="my-6 border-t border-white/[0.06]" />

                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Core Features</p>
                  <ul className="space-y-2">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.08]">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff7a68] hover:text-[#ff9282] transition-colors"
                  >
                    <span>Read Technical Specification</span>
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Observability Terminal */}
        <div className="mt-16 rounded-2xl border border-white/[0.1] bg-[#090a10] p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
            <div className="flex items-center gap-3">
              <Terminal className="size-5 text-[#ff6d5a]" />
              <span className="text-sm font-bold text-white tracking-wide">
                Live Agent Execution Logs & Observability
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Stream Active
            </span>
          </div>
          <div className="space-y-2 font-mono text-xs text-slate-300 leading-relaxed bg-black/60 p-4 rounded-xl border border-white/[0.06]">
            <p className="text-slate-500">[12:15:02] Initializing pipeline execution for candidate: Maya Chen (Staff Systems Engineer)</p>
            <p className="text-indigo-400">✓ [agent-resume] Parsed 4 pages. Verified skills: Distributed Caching, Kafka, Go, Rust (Match: 92%)</p>
            <p className="text-purple-400">✓ [agent-interview-plan] Tailored 60-min rubric generated with 3 focus areas on p99 latency</p>
            <p className="text-[#ff7a68]">✓ [agent-interview-analysis] Evaluated transcript dialogue: extracted 3 timestamped quotes, 0 red flags</p>
            <p className="text-emerald-400 font-bold">✓ [agent-decision] Synthesized recommendation: Strong Yes (88% confidence) · Comp band: $185k-$205k</p>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { RoleWorkspace } from "@/components/marketing/role-workspace";
import { FaqList } from "@/components/marketing/faq-list";
import { 
  AGENTS, 
  OG_IMAGE, 
  PLANS, 
  SITE_DESCRIPTION, 
  SITE_TITLE, 
  SITE_URL, 
  TRIAL_HREF 
} from "@/lib/marketing/site";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Workflow, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  FileCheck, 
  Calendar, 
  Award, 
  PlaneTakeoff, 
  Terminal,
  ChevronRight,
  GitBranch,
  Sliders,
  Send,
  MessageSquare
} from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  alternates: { canonical: SITE_URL },
};

const STATS = [
  { value: "15", label: "Autonomous AI Agents", sub: "Screening to onboarding" },
  { value: "<45s", label: "Pipeline Turnaround", sub: "Instant evidence scoring" },
  { value: "100%", label: "Grounded In Evidence", sub: "Zero gut-feel hallucinations" },
  { value: "0", label: "Rigid Workflows", sub: "Infinite visual canvas" },
];

const BENTO_FEATURES = [
  {
    title: "Visual Agent Orchestration",
    category: "Workflow Engine",
    description: "Design hiring pipelines like n8n workflows. Wire resume screeners, interview synthesizers, and travel concierges on an infinite reactive canvas.",
    icon: Workflow,
    gradient: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
    badge: "Drag & Wire",
  },
  {
    title: "Objective Interview Evidence",
    category: "Signal Extraction",
    description: "Scores candidate dialogue against real job rubrics. Cites direct quotes, evaluates technical trade-offs, and highlights open questions.",
    icon: Sparkles,
    gradient: "from-[#ff6d5a]/20 to-orange-500/10",
    border: "border-[#ff6d5a]/30",
    badge: "Quoted Citations",
  },
  {
    title: "Human-in-the-Loop Gates",
    category: "Governance & Quality",
    description: "AI assists, but your team decides. Pause execution at Shortlist and Final Offer gates for human review and sign-off.",
    icon: ShieldCheck,
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    badge: "You Make The Call",
  },
  {
    title: "Candidate Concierge via Ophelia OS",
    category: "Candidate Experience",
    description: "Automate flights, boutique hotel search, welcome dinners, and on-site schedules for traveling candidates automatically.",
    icon: PlaneTakeoff,
    gradient: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/30",
    badge: "VIP Travel",
  },
  {
    title: "Real Production Connectors",
    category: "Ecosystem Integrations",
    description: "Live Slack alerts, one-click Google Calendar meeting invites, and bidirectional Greenhouse Harvest ATS candidate synchronization.",
    icon: Zap,
    gradient: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/30",
    badge: "Slack · GCal · ATS",
  },
];

const USES = [
  {
    href: "/use-cases/technical",
    title: "Technical & Systems Engineering",
    body: "Parse complex stacks, evaluate architecture trade-offs from interview transcripts, and audit GitHub repositories.",
    tag: "High Bar",
  },
  {
    href: "/use-cases/high-volume",
    title: "High-Volume Sourcing Slates",
    body: "Import batches of candidate resumes from Greenhouse. Score everyone against the exact same rubric with zero bias.",
    tag: "Fast Turnaround",
  },
  {
    href: "/use-cases/executive",
    title: "Executive & Senior Leadership",
    body: "Personalized outreach, white-glove candidate travel concierge, and rigorous strategic synthesis for hiring executives.",
    tag: "White Glove",
  },
  {
    href: "/use-cases/campus",
    title: "Campus & Early Career Cohorts",
    body: "Standardize campus evaluation with consistent interview rubrics and collaborative candidate scorecards.",
    tag: "Objective Calibration",
  },
];

export default function Home() {
  return (
    <MarketingShell>
      <main>
        {/* n8n-Style Grand Hero Section */}
        <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Top subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#ff6d5a]/15 via-[#7d52ff]/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {/* Announcement Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6d5a]/30 bg-[#ff6d5a]/10 px-3.5 py-1.5 text-xs font-semibold text-[#ff806f] shadow-xs backdrop-blur-md mb-6 hover:bg-[#ff6d5a]/15 transition-colors">
              <Sparkles className="size-3.5 text-[#ff6d5a]" />
              <span>JobNinjas 2.0: Autonomous AI Agents for Recruiting</span>
              <ChevronRight className="size-3 text-[#ff806f]" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
              Automate hiring workflows with{" "}
              <span className="bg-gradient-to-r from-[#ff6d5a] via-[#ff8878] to-[#9b72ff] bg-clip-text text-transparent">
                autonomous AI agents.
              </span>
            </h1>

            {/* Lede Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              The fair-code inspired operating system for open roles. Wire together 15 specialized agents for resume screening, interview scoring, travel concierge, and offer decisions on an interactive visual canvas.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={TRIAL_HREF}
                className="group relative inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6d5a] via-[#ff5844] to-[#f03d27] px-6 text-sm font-bold text-white shadow-xl shadow-[#ff6d5a]/25 transition-all hover:brightness-110 active:scale-95 sm:w-auto"
              >
                <span>Open Live Role Workspace</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#pipeline"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.04] px-6 text-sm font-semibold text-white shadow-xs backdrop-blur-md hover:bg-white/[0.08] hover:border-white/30 transition-all sm:w-auto"
              >
                <Workflow className="size-4 text-[#ff7a68]" />
                <span>Explore Agent Pipeline</span>
              </Link>
            </div>
          </div>

          {/* Interactive Live Workflow Canvas Simulator */}
          <div className="relative mx-auto mt-14 max-w-6xl">
            <RoleWorkspace />
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-y border-white/[0.08] bg-[#07080c]/60 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-200">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid: Core Platform Features */}
        <section className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff7a68] mb-2">
              <Workflow className="size-3.5" />
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Designed for high-conviction hiring teams.
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Replace disconnected spreadsheets, subjective interview notes, and rigid ATS lock-in with a flexible, autonomous agent pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENTO_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className={`group relative rounded-2xl border ${feat.border} bg-[#0e1017]/80 p-6 backdrop-blur-md shadow-lg shadow-black/40 hover:bg-[#12141f] transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`size-10 rounded-xl bg-gradient-to-tr ${feat.gradient} border ${feat.border} flex items-center justify-center text-white`}>
                        <Icon className="size-5 text-[#ff806f]" />
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.1] font-semibold">
                        {feat.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {feat.category}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#ff806f] transition-colors mt-0.5">
                      {feat.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* The 15 Agents Pipeline Showcase */}
        <section id="pipeline" className="border-t border-white/[0.08] bg-[#07080d]/80 py-20 sm:py-28 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff7a68] mb-2">
                  <Cpu className="size-3.5" />
                  <span>The Agent Ecosystem</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  15 specialized agents. One coordinated pipeline.
                </h2>
                <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
                  Every step has explicit inputs, contracts, and validated artifacts. The pipeline executes sequentially per candidate with full auditability.
                </p>
              </div>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#ff7a68] hover:text-[#ff9282] transition-colors"
              >
                <span>Browse all agent templates</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {AGENTS.map((agent, index) => (
                <div
                  key={agent.name}
                  className="rounded-2xl border border-white/[0.08] bg-[#0e1017]/90 p-5 hover:border-white/[0.18] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono font-bold text-[#ff7a68] bg-[#ff6d5a]/10 px-2 py-0.5 rounded-md border border-[#ff6d5a]/20">
                        Agent #{String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="size-2 rounded-full bg-emerald-400" />
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {agent.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      {agent.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Inputs</p>
                      <p className="text-slate-300 mt-1 font-mono text-[10.5px] truncate">
                        {agent.inputs[0]}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Outputs</p>
                      <p className="text-emerald-400 mt-1 font-mono text-[10.5px] truncate">
                        {agent.outputs[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="border-t border-white/[0.08] py-20 sm:py-28 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-[#ff7a68] mb-2">Use Cases</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Built for every hiring stage & scale.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {USES.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-white/[0.08] bg-[#0e1017]/70 p-5 hover:bg-[#121420] hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                      {item.tag}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#ff806f] transition-colors mt-3">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#ff7a68] font-semibold">
                    <span>Explore blueprint</span>
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Grand CTA Banner (n8n Style) */}
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="relative rounded-3xl border border-[#ff6d5a]/40 bg-gradient-to-tr from-[#121422] via-[#1a1c2e] to-[#251b29] p-8 sm:p-14 overflow-hidden shadow-2xl shadow-black/60">
            {/* Background radiant mesh */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 size-96 rounded-full bg-[#ff6d5a]/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-96 rounded-full bg-[#7d52ff]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-mono font-bold tracking-wider text-[#ff806f] uppercase bg-[#ff6d5a]/15 px-3 py-1 rounded-full border border-[#ff6d5a]/30">
                Start Building Today
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mt-4">
                Ready to build your first autonomous hiring workflow?
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Open a demo role board in seconds. Add candidates, wire your interview pipeline, and let AI agents do the heavy lifting while you make the call.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href={TRIAL_HREF}
                  className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6d5a] to-[#f03d27] px-6 text-sm font-bold text-white shadow-xl shadow-[#ff6d5a]/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>Open Free Role Board</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-6 text-sm font-semibold text-white hover:bg-white/[0.1] transition-all"
                >
                  <span>View Pricing & Limits</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-white/[0.08] py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <FaqList />
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

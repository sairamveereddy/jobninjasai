import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Bot, 
  Code2, 
  Layers, 
  Network, 
  FileText, 
  Calendar, 
  Building2, 
  Sliders, 
  Users, 
  Cpu, 
  Lock,
  Workflow,
  Compass,
  Plane,
  ChevronRight,
  ExternalLink,
  GitPullRequest,
  Terminal,
  MessageSquare,
  Search
} from "lucide-react";
import { RoleWorkspace } from "@/components/marketing/role-workspace";
import { MarketingShell } from "@/components/marketing-layout";
import { TRIAL_HREF } from "@/lib/marketing/site";

const COMPLEX_AGENTS = [
  { 
    step: "01", 
    name: "ATS Real-Time Webhook Intake", 
    type: "Trigger", 
    icon: Zap,
    desc: "Ingests live candidate applications and resumes directly from Greenhouse, Lever, and Ashby." 
  },
  { 
    step: "02", 
    name: "AST Job Description & Rubric Compiler", 
    type: "Agent", 
    icon: FileText,
    desc: "Translates ambiguous job specs into strict evaluation trees with non-negotiable hard skill gates." 
  },
  { 
    step: "03", 
    name: "GitHub AST & Code Auditor", 
    type: "Complex Agent", 
    icon: GitPullRequest,
    desc: "Audits candidate PR diffs, parses AST syntax, checks memory safety, and verifies zero hallucinated claims." 
  },
  { 
    step: "04", 
    name: "Evidence Extraction & Match Scorecard", 
    type: "Analysis", 
    icon: Cpu,
    desc: "Generates objective 0-100 rating with verifiable inline citations pointing to candidate portfolio artifacts." 
  },
  { 
    step: "05", 
    name: "Shortlist Human-in-the-Loop Gate", 
    type: "Human Gate", 
    icon: ShieldCheck,
    desc: "Enforces mandatory recruiter sign-off before candidate stage advancement or outbound correspondence." 
  },
  { 
    step: "06", 
    name: "Tailored Candidate Outreach Agent", 
    type: "Agent", 
    icon: MessageSquare,
    desc: "Drafts hyper-personalized interview invites referencing candidate's specific architectural wins." 
  },
  { 
    step: "07", 
    name: "Timezone-Aware Google Calendar Scheduler", 
    type: "Tool", 
    icon: Calendar,
    desc: "Discovers interviewer availability, balances loads, and dispatches Google Meet video invitations." 
  },
  { 
    step: "08", 
    name: "Probing Technical Question Generator", 
    type: "Agent", 
    icon: Code2,
    desc: "Formulates role-specific questions targeted at verifying resume skill gaps during technical rounds." 
  },
  { 
    step: "09", 
    name: "Timestamped Audio Transcript Scorer", 
    type: "Complex Agent", 
    icon: Bot,
    desc: "Scores live interview audio responses against rubrics, quoting exact seconds where answers occurred." 
  },
  { 
    step: "10", 
    name: "Multi-Model Consensus & Hiring Advisory", 
    type: "Complex Agent", 
    icon: Sparkles,
    desc: "Synthesizes code tests, resume verification, and audio scores into an advisory hire/no-hire decision." 
  },
  { 
    step: "11", 
    name: "Ophelia OS VIP Travel & Onsite Concierge", 
    type: "Complex Agent", 
    icon: Plane,
    desc: "Discovers real flight and hotel rates via Ophelia OS, assembling flight itineraries for final round onsites." 
  },
  { 
    step: "12", 
    name: "Compensation Band & Offer Letter Drafter", 
    type: "Agent", 
    icon: Building2,
    desc: "Structures competitive base salary, equity, and sign-on packages aligned with benchmark comp data." 
  },
  { 
    step: "13", 
    name: "Slack Channel Broadcast & Team Voting", 
    type: "Tool", 
    icon: Network,
    desc: "Posts candidate dossiers into role-specific Slack channels with one-click hiring committee voting forms." 
  },
  { 
    step: "14", 
    name: "Reference Check Inconsistency Detector", 
    type: "Agent", 
    icon: Users,
    desc: "Interviews past references and flags inconsistencies against candidate interview claims." 
  },
  { 
    step: "15", 
    name: "Immutable Audit Trail & Bias Ledger", 
    type: "Audit & Safety", 
    icon: Lock,
    desc: "Maintains tamper-proof logs of every prompt, score, and decision for EEOC safety and SOC2 audits." 
  },
];

const CONNECTORS = [
  { name: "Greenhouse", category: "ATS Live Sync", desc: "Two-way candidate and requisition stage sync" },
  { name: "Lever", category: "ATS Live Sync", desc: "Automated candidate archive tags and notes" },
  { name: "Ashby", category: "ATS Webhooks", desc: "Modern hiring platform integration via webhooks" },
  { name: "Workday", category: "Enterprise HRIS", desc: "Global requisition mapping and offer staging" },
  { name: "Slack", category: "Team Broadcast", desc: "Real-time channel voting and decision cards" },
  { name: "Google Calendar", category: "Scheduling", desc: "Automatic slot booking and Google Meet invites" },
  { name: "Gmail", category: "Outreach Dispatch", desc: "Direct candidate interview invites with threading" },
  { name: "GitHub", category: "Forensic Code Audit", desc: "PR diff analysis, AST parsing, and commit audits" },
  { name: "Ophelia OS", category: "VIP Travel Engine", desc: "Live flight and hotel discovery for onsite loops" },
  { name: "Linear", category: "Engineering Sync", desc: "Link engineering test tickets directly to board" },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <div className="flex flex-col gap-24 sm:gap-32 pb-24 overflow-hidden font-sans">
      {/* 1. Hero Section (Miro + n8n Fusion: Open Spatial Canvas, Editorial Typography, Light Blue Theme) */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        <div className="mx-auto max-w-5xl text-center">
          {/* Subtle Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-4 py-1.5 text-xs font-medium text-sky-800 shadow-2xs">
            <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-semibold text-blue-900">JobNinjas 2.0</span>
            <span className="text-sky-400">·</span>
            <span>The Spatial Intelligence Canvas for Autonomous Hiring</span>
            <ChevronRight className="size-3 text-sky-500" />
          </div>

          {/* Editorial Miro-style Headline */}
          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] text-slate-900 font-sans leading-[1.04]">
            Human collaboration <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
              at the speed of AI.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The intelligent canvas where recruiting teams and autonomous agents source, screen, evaluate code, and coordinate hires together.
          </p>

          {/* Miro-Style Interactive Work Email Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Enter your work email"
                defaultValue=""
                className="w-full h-12 rounded-full border border-slate-300 bg-white px-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <Link
              href={TRIAL_HREF}
              className="inline-flex h-12 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-7 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-[12px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-blue-600" /> Instant demo sandbox</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-indigo-600" /> Real Ophelia & ATS APIs</span>
          </div>
        </div>

        {/* Hero Spatial Canvas (Miro Spatial Canvas + n8n Executable Simulator) */}
        <div className="mt-14 mx-auto max-w-6xl">
          <RoleWorkspace />
        </div>
      </section>

      {/* 2. Trusted By Bar */}
      <section className="border-y border-slate-200/80 bg-white py-10 px-4">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
            Trusted by modern engineering leaders and recruiting teams to orchestrate high-conviction hiring
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="font-mono text-sm font-bold tracking-tighter text-slate-800">LINEAR</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-slate-800">RAMP</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-slate-800">VERCEL</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-slate-800">RETOOL</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-slate-800">GREENHOUSE</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-slate-800">ASHBY</span>
          </div>
        </div>
      </section>

      {/* 3. Social Proof Metrics */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-sky-100 bg-white p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="text-center pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">15</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Autonomous Specialized Agents</p>
            </div>
            <div className="text-center pt-4 md:pt-0 md:pl-8">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono tracking-tight">100%</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Grounded Evidence Citations</p>
            </div>
            <div className="text-center pt-4 md:pt-0 md:pl-8">
              <p className="text-3xl sm:text-4xl font-extrabold text-sky-600 font-mono tracking-tight">&lt;45s</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Per-Candidate Pipeline Turnaround</p>
            </div>
            <div className="text-center pt-4 md:pt-0 md:pl-8">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tracking-tight">0</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Hallucinated Requirements</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The USB-C for your hiring stack (Ecosystem Connectors) */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-mono font-semibold text-blue-700 border border-sky-200">
              <Network className="size-3 text-blue-600" /> ECOSYSTEM CONNECTIVITY
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
              The USB-C for your hiring stack
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Connect JobNinjas to any tool your team already relies on. 20+ native integrations. Any ATS via Webhooks. Real flight booking via Ophelia OS.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CONNECTORS.map((c) => (
              <div 
                key={c.name}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-sky-300 hover:shadow-md"
              >
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-600">
                  {c.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-1">
                  {c.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. See + understand + trust your agents (Miro-style Bento Cards) */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
              See + understand + trust your agents
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Multi-model execution with transparent prompt logs, verified code citations, and human approval before every offer.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs hover:border-sky-200 transition-all">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 mb-5 border border-sky-100">
                <Compass className="size-5 text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Full visibility across agents</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Watch agents evaluate code diffs live, or open any past candidate run to inspect the exact prompt, candidate claims, and token traces all inside the visual canvas.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs hover:border-blue-200 transition-all">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5 border border-blue-100">
                <ShieldCheck className="size-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Strict rules around AI actions</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Use structured scorecards and strict decision gates. No automated rejections or outbound emails without explicit human recruiter verification.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs hover:border-indigo-200 transition-all">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-5 border border-indigo-100">
                <Lock className="size-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Candidate data privacy first</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Candidate PII is never used for training foundation models. Full GDPR compliance, SOC2 Type II controls, and optional private VPC isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Complete 15-Agent Pipeline Blueprint Catalog */}
      <section id="pipeline" className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
                Complete Architecture Blueprint
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 font-sans">
                15 Specialized Autonomous Agents
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Every step produces structured JSON outputs that flow deterministically into subsequent nodes on the canvas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPLEX_AGENTS.map((agent) => (
              <div
                key={agent.step}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      STEP {agent.step}
                    </span>
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600">
                      {agent.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <agent.icon className="size-4 text-blue-600 shrink-0" />
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {agent.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    {agent.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Grand CTA Banner (Light Blue & Sky Gradient) */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-blue-200 bg-gradient-to-tr from-sky-50 via-white to-blue-50/70 p-10 sm:p-16 text-center shadow-lg shadow-sky-100/50">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-mono font-bold text-blue-800">
              <Sparkles className="size-3.5 text-blue-600" /> INTELLIGENT CANVAS READY
            </span>
            <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-sans leading-tight">
              Build hiring workflows the way your team actually thinks.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Step into the visual recruiting operating system designed for explainable, high-conviction decisions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={TRIAL_HREF}
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-8 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>Start Building Free</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 px-6 text-sm font-semibold text-slate-800 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Browse Agent Blueprints</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MarketingShell>
);
}

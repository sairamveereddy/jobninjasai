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
  ExternalLink
} from "lucide-react";
import { RoleWorkspace } from "@/components/marketing/role-workspace";
import { TRIAL_HREF } from "@/lib/marketing/site";

const AGENT_PIPELINE = [
  { step: "01", name: "Greenhouse / ATS Intake", type: "Trigger", desc: "Watches for inbound applications, resumes, and job requisitions in real time." },
  { step: "02", name: "JD Structurer & Rubric", type: "Agent", desc: "Parses requirements into non-negotiable hard skills and soft-factor evaluation gates." },
  { step: "03", name: "Resume Evidence Parser", type: "Agent", desc: "Verifies claims against GitHub commits, LinkedIn tenure, and live project artifacts." },
  { step: "04", name: "Screening Scorecard", type: "Analysis", desc: "Generates objective 0-100 match rating with verifiable inline source citations." },
  { step: "05", name: "Shortlist Decision", type: "Gate", desc: "Enforces strict human-in-the-loop review threshold before outreach or rejection." },
  { step: "06", name: "Candidate Outreach", type: "Agent", desc: "Drafts tailored, non-generic interview invites citing specific portfolio accomplishments." },
  { step: "07", name: "Google Calendar Sync", type: "Tool", desc: "Proposes timezone-aware interview slots and synchronizes calendar invites with video links." },
  { step: "08", name: "Technical Interview Plan", type: "Agent", desc: "Generates custom probing questions tailored to verify specific resume gaps." },
  { step: "09", name: "Transcript Scorer", type: "Agent", desc: "Scores candidate responses against the rubric with exact timestamped transcript citations." },
  { step: "10", name: "Hiring Recommendation", type: "Agent", desc: "Synthesizes resume, code tests, and transcripts into advisory hire/no-hire guidance." },
  { step: "11", name: "VIP Travel Concierge", type: "Agent", desc: "Dispatches flight and hotel proposals via Ophelia OS for final round onsite interviews." },
  { step: "12", name: "Formal Offer Generator", type: "Agent", desc: "Drafts competitive base, bonus, and equity packages aligned with compensation bands." },
  { step: "13", name: "Slack & Team Broadcast", type: "Tool", desc: "Posts structured candidate dossiers and voting forms into role-specific hiring channels." },
  { step: "14", name: "Reference Verification", type: "Agent", desc: "Structures reference response checks for behavioral consistency and past ownership." },
  { step: "15", name: "Audit & Bias Ledger", type: "Audit", desc: "Records immutable logs of all agent decisions for enterprise compliance and EEOC safety." },
];

const CONNECTORS = [
  { name: "Greenhouse", category: "ATS", status: "Live Sync", desc: "Real-time candidate and requisition synchronization" },
  { name: "Lever", category: "ATS", status: "Live Sync", desc: "Two-way stage advancement and candidate tags" },
  { name: "Ashby", category: "ATS", status: "Live Sync", desc: "Modern hiring platform integration via webhooks" },
  { name: "Workday", category: "Enterprise", status: "Active", desc: "Enterprise HRIS job mapping and offer staging" },
  { name: "Slack", category: "Messaging", status: "Connected", desc: "Real-time channel notifications & hiring voting" },
  { name: "Google Calendar", category: "Calendar", status: "Connected", desc: "Automated interview slot reservation & Meet links" },
  { name: "Gmail", category: "Email", status: "OAuth Ready", desc: "Direct candidate outreach dispatch with threading" },
  { name: "GitHub", category: "Evidence", status: "Verified", desc: "Engineering code quality, PR diffs, and repo analysis" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-24 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        <div className="mx-auto max-w-5xl text-center">
          {/* Subtle Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs hover:border-neutral-300 transition-colors">
            <span className="size-2 rounded-full bg-[#ea4b71]" />
            <span className="font-semibold text-neutral-900">JobNinjas 2.0</span>
            <span className="text-neutral-400">·</span>
            <span>The Fair-Code AI Platform for Autonomous Hiring</span>
            <ChevronRight className="size-3 text-neutral-400" />
          </div>

          {/* Main Huge Typography Headline */}
          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] text-neutral-950 font-sans leading-[1.02]">
            Build the agent. <br className="hidden sm:inline" />
            <span className="text-neutral-900">Understand its hiring workflow.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            JobNinjas is the visual platform for autonomous recruiting agents you can actually follow. 
            Open any step, inspect the candidate evidence, and explain the hiring decision to anyone who runs it.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href={TRIAL_HREF}
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#ea4b71] hover:bg-[#df3860] px-7 text-sm font-semibold text-white shadow-xs transition-all hover:shadow-md active:scale-95 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/product"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-neutral-300/80 bg-white hover:bg-neutral-50 px-6 text-sm font-semibold text-neutral-800 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Explore Interactive Studio</span>
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-[12px] text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600" /> Instant demo sandbox</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600" /> Open API & Webhooks</span>
          </div>
        </div>

        {/* Hero Interactive Workflow Canvas Simulator */}
        <div className="mt-14 mx-auto max-w-6xl">
          <RoleWorkspace />
        </div>
      </section>

      {/* 2. Trusted By Bar */}
      <section className="border-y border-neutral-200/70 bg-white py-10 px-4">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-mono font-medium uppercase tracking-wider text-neutral-400">
            Trusted by modern hiring teams and engineering leaders to run high-conviction pipelines
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="font-mono text-sm font-bold tracking-tighter text-neutral-800">LINEAR</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-neutral-800">RAMP</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-neutral-800">VERCEL</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-neutral-800">RETOOL</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-neutral-800">GREENHOUSE</span>
            <span className="font-mono text-sm font-bold tracking-tighter text-neutral-800">ASHBY</span>
          </div>
        </div>
      </section>

      {/* 3. Social Proof Stats */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            <div className="text-center pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-mono tracking-tight">15</p>
              <p className="mt-1 text-xs font-medium text-neutral-500">Autonomous Specialized Agents</p>
            </div>
            <div className="text-center pt-4 md:pt-0 md:pl-8">
              <p className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-mono tracking-tight">100%</p>
              <p className="mt-1 text-xs font-medium text-neutral-500">Grounded Evidence Citations</p>
            </div>
            <div className="text-center pt-4 md:pt-0 md:pl-8">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#ea4b71] font-mono tracking-tight">&lt;45s</p>
              <p className="mt-1 text-xs font-medium text-neutral-500">Per-Candidate Stage Turnaround</p>
            </div>
            <div className="text-center pt-4 md:pt-0 md:pl-8">
              <p className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-mono tracking-tight">0</p>
              <p className="mt-1 text-xs font-medium text-neutral-500">Hallucinated Requirements</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The USB-C for your hiring stack (Ecosystem Connectors) */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-mono font-semibold text-neutral-700">
              <Network className="size-3 text-[#ea4b71]" /> CONNECTIVITY
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 font-sans">
              The USB-C for your hiring stack
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Connect JobNinjas to just about any tool you can think of. 20+ native integrations. Any ATS via Webhooks. Any agent or model via Ophelia OS and Model Context Protocol.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONNECTORS.map((c) => (
              <div 
                key={c.name}
                className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition-all hover:border-neutral-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    {c.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-700 border border-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {c.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#ea4b71] transition-colors">
                  {c.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. See + understand + trust your agents */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 font-sans">
              See + understand + trust your agents
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Connect any model, see every decision, and enforce human approval whenever an offer or rejection is on the line.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-5">
                <Compass className="size-5 text-[#ea4b71]" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Full visibility across agents</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Watch agents evaluate resumes live, or open any past run to inspect the exact prompt, candidate claims, and token traces all in the same visual board.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-5">
                <ShieldCheck className="size-5 text-[#ea4b71]" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Put rules around AI actions</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Use structured scorecards and strict decision gates. No automated rejections or outbound emails without explicit recruiter verification.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-5">
                <Lock className="size-5 text-[#ea4b71]" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Candidate data privacy first</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Candidate PII is never used for training foundation models. Full GDPR compliance, SOC2 Type II controls, and optional private VPC isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Built by recruiters + readable by anyone */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 font-sans">
              Built by recruiters + readable by anyone
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Create hiring pipelines anyone can follow with a visual builder and inspect raw prompts whenever you need deep control.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-5">
                <FileText className="size-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Documentation, built in</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                The visual pipeline is the documentation. No separate rubrics lost in Google Docs or forgotten hiring instructions between interviewers.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-5">
                <Zap className="size-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Recover in one step</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Spot discrepancies or missing candidate portfolio links at a glance. Re-run just the specific agent step without restarting the entire pipeline.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-5">
                <Layers className="size-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Every change, tracked</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Every scorecard modification, interviewer vote, and rubric refinement is versioned with complete audit logs and recruiter accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Complete 15-Agent Pipeline Showcase */}
      <section id="pipeline" className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ea4b71]">
                Complete Architectural Blueprint
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 font-sans">
                15 Specialized Autonomous Agents
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
              Every step outputs structured JSON evidence that flows deterministically into subsequent nodes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENT_PIPELINE.map((agent) => (
              <div
                key={agent.step}
                className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      STEP {agent.step}
                    </span>
                    <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono font-medium text-neutral-600">
                      {agent.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#ea4b71] transition-colors">
                    {agent.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                    {agent.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Grand n8n-Style CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-neutral-200 bg-white p-10 sm:p-16 text-center shadow-lg shadow-neutral-200/50">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ea4b71]/10 px-3 py-1 text-xs font-mono font-bold text-[#ea4b71]">
              <Sparkles className="size-3.5" /> READY IN SECONDS
            </span>
            <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 font-sans leading-tight">
              Build hiring workflows the way you actually think.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Ditch fragile spreadsheets and black-box AI tools. Step into the visual canvas designed for transparent, high-conviction hiring.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={TRIAL_HREF}
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#ea4b71] hover:bg-[#df3860] px-8 text-sm font-semibold text-white shadow-xs transition-all hover:shadow-md active:scale-95 cursor-pointer"
              >
                <span>Start Building Free</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 px-6 text-sm font-semibold text-neutral-800 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Browse Workflow Blueprints</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

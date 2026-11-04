import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";
import { 
  BookOpen, 
  Workflow, 
  Layers, 
  Mail, 
  ArrowRight, 
  ChevronRight, 
  Sparkles,
  FileCode,
  ShieldCheck
} from "lucide-react";

export const metadata: Metadata = pageSeo(
  "Resources & Guides",
  "Documentation, workflow guides, and architecture references for running autonomous AI hiring pipelines on JobNinjas.",
);

const LINKS = [
  {
    href: "/resources/docs",
    title: "How to Work a Role",
    category: "Getting Started Guide",
    icon: BookOpen,
    accent: "from-blue-500 to-indigo-600",
    body: "Create your requisition, attach job requirements, import candidate slates, and execute sequential agent runs.",
  },
  {
    href: "/templates",
    title: "15 Agent Node Catalog",
    category: "Technical Reference",
    icon: Workflow,
    accent: "from-[#ff6d5a] to-[#ff4732]",
    body: "Full contracts, input dependencies, and generated artifact specifications from JD Parser to Offer Letter Draft.",
  },
  {
    href: "/resources/case-studies",
    title: "Real Pipeline Blueprints",
    category: "Workflow Architecture",
    icon: Layers,
    accent: "from-purple-500 to-indigo-600",
    body: "Step-by-step walkthroughs of technical screens, executive search, and high-volume candidate calibration without gut bias.",
  },
  {
    href: "mailto:veereddy@jobninjas.org",
    title: "Talk to Engineering & Support",
    category: "Direct Inquiries",
    icon: Mail,
    accent: "from-emerald-500 to-teal-600",
    body: "Questions about custom agent integrations, Greenhouse Harvest webhook setup, or enterprise SOC2 compliance reviews.",
  },
];

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <main className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#ff6d5a]/15 via-[#7d52ff]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6d5a]/30 bg-[#ff6d5a]/10 px-3.5 py-1.5 text-xs font-semibold text-[#ff806f] mb-4">
            <BookOpen className="size-3.5 text-[#ff6d5a]" />
            <span>Developer & Recruiter Resources</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Everything you need to master AI hiring pipelines.
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            Browse architecture guides, agent contracts, and operational best practices for running high-velocity candidate evaluation.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="relative z-10 mt-14 grid gap-6 sm:grid-cols-2">
          {LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
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
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-[#ff7a68]">
                  <span>Open Resource</span>
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl border border-white/[0.1] bg-gradient-to-r from-[#121422] to-[#1a1c2e] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Ready to see the agents in action?</h3>
            <p className="mt-1 text-sm text-slate-400">Launch a live sandbox board pre-configured with realistic candidates and technical rubrics.</p>
          </div>
          <Link
            href={TRIAL_HREF}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6d5a] to-[#ff4732] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ff6d5a]/25 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Open Demo Workspace</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    </MarketingShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";
import { 
  Building2, 
  Rocket, 
  Briefcase, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Workflow, 
  Sparkles,
  ShieldCheck,
  Zap
} from "lucide-react";

export const metadata: Metadata = pageSeo(
  "Hiring Solutions by Team & Scale",
  "How fast-growing startups, enterprise talent organizations, and executive search agencies use JobNinjas to automate hiring workflows.",
);

const SOLUTIONS = [
  {
    href: "/solutions/startups",
    title: "High-Growth Startups",
    category: "Seed to Series B",
    icon: Rocket,
    tag: "High Velocity",
    accent: "from-[#ff6d5a] to-[#ff4732]",
    body: "Founders and lean talent teams screen hundreds of applicants in minutes. Deploy technical interview guides and hire bar-raisers without an army of recruiters.",
    features: [
      "Instant resume parsing & skill extraction",
      "Standardized 60-min technical interview guides",
      "Automated founder & recruiter alignment scorecards",
    ],
  },
  {
    href: "/solutions/enterprise",
    title: "Enterprise Talent Teams",
    category: "Mid-Market to Fortune 500",
    icon: Building2,
    tag: "SOC2 & Compliance",
    accent: "from-blue-500 to-indigo-600",
    body: "Greenhouse and Workday remain your system of record. JobNinjas is where open roles are actively worked, calibrated, and defended with quoted evidence.",
    features: [
      "Harvest v3 API bidirectional synchronization",
      "Human-in-the-loop governance approval gates",
      "Eliminates interviewer gut-feel bias with cited quotes",
    ],
  },
  {
    href: "/solutions/agencies",
    title: "Search Firms & Agencies",
    category: "Staffing & Executive Search",
    icon: Briefcase,
    tag: "Multi-Client",
    accent: "from-purple-500 to-indigo-600",
    body: "One visual workspace per client requisition. Deliver polished candidate scorecards, interview synthesis memos, and compensation recommendations directly to hiring managers.",
    features: [
      "Client-ready candidate presentation memos",
      "Candidate Concierge travel & on-site itineraries",
      "Custom compensation benchmarking and offer drafts",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <MarketingShell>
      <main className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#ff6d5a]/15 via-[#7d52ff]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6d5a]/30 bg-[#ff6d5a]/10 px-3.5 py-1.5 text-xs font-semibold text-[#ff806f] mb-4">
            <Sparkles className="size-3.5 text-[#ff6d5a]" />
            <span>Tailored Hiring Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The same visual canvas. Tailored for every organization.
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            Whether you are a solo founder hiring your first 10 engineers, or an enterprise scaling across global hubs, JobNinjas adapts to your hiring velocity.
          </p>
        </div>

        {/* Solutions Bento Grid */}
        <div className="relative z-10 mt-14 grid gap-8 md:grid-cols-3">
          {SOLUTIONS.map((item) => {
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
                      {item.tag}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <h2 className="text-xl font-bold text-white group-hover:text-[#ff806f] transition-colors mt-1">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.body}
                  </p>

                  <div className="my-6 border-t border-white/[0.06]" />

                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Key Workflows</p>
                  <ul className="space-y-2.5">
                    {item.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.08]">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff7a68] hover:text-[#ff9282] transition-colors"
                  >
                    <span>Explore {item.title} Blueprint</span>
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl border border-white/[0.1] bg-gradient-to-r from-[#121422] to-[#1a1c2e] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Ready to see how JobNinjas works for your team?</h3>
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

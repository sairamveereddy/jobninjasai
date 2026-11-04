import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Rocket, Building2, CheckCircle2, ChevronRight } from "lucide-react";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Recruiting Solutions by Organization Size",
  "Tailored autonomous recruiting workflows for fast-moving startups, scale-ups, and security-conscious enterprises.",
);

const SOLUTIONS = [
  {
    title: "Founding Teams & Early Startups",
    tagline: "Close high-conviction engineering talent without an internal recruiting department",
    desc: "When every single hire impacts your product velocity, you cannot afford keyword scanners that disqualify top builders. JobNinjas parses real GitHub PRs, evaluates code architecture, and structures high-signal interview questions directly from your codebase.",
    benefits: [
      "Zero ATS setup required — start with raw resumes and a Notion doc",
      "Grounded GitHub, PR diff, and AST syntax code verification",
      "Automated interview scheduling and video link synchronization",
      "Flat pricing per open requisition with no per-seat penalty",
    ],
    cta: "Launch Startup Pipeline",
  },
  {
    title: "High-Growth Scale-Ups",
    tagline: "Accelerate hiring velocity without lowering technical bars",
    desc: "Eliminate recruiter administrative bottlenecks. Synchronize inbound candidates across Greenhouse, Lever, and Ashby. Route qualified candidates into Slack channels for instant interviewer voting and review.",
    benefits: [
      "Bidirectional ATS synchronization with stage automations",
      "Human-in-the-loop decision gates before any offer or rejection",
      "Timestamped transcript scoring that cites candidate responses verbatim",
      "VIP travel concierge for onsite candidate experience via Ophelia OS",
    ],
    cta: "Scale Your Hiring Loop",
  },
  {
    title: "Enterprise & Security Leaders",
    tagline: "Total governance, private VPC deployment, and zero training on candidate PII",
    desc: "Deploy JobNinjas in your private AWS/GCP cloud environment. Enforce strict SAML SSO, immutable audit trails, and automated EEOC bias mitigation reporting.",
    benefits: [
      "Zero data retention on foundation models — candidate PII stays in your boundary",
      "Custom role-based access control (RBAC) and audit log exports",
      "Fine-tuned evaluation rubrics aligned to internal engineering levels",
      "Dedicated Technical Account Manager and 99.9% uptime SLA",
    ],
    cta: "Contact Enterprise Solutions",
  },
];

export default function SolutionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-mono font-semibold text-blue-700 border border-sky-200">
          <Sparkles className="size-3 text-blue-600" /> TAILORED ARCHITECTURE
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Designed for the way <br className="hidden sm:inline" />
          modern teams hire.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
          Whether you are making your first 5 engineering hires or coordinating 50 concurrent cross-functional requisitions, JobNinjas adapts to your team structure.
        </p>
      </div>

      <div className="mt-14 space-y-8">
        {SOLUTIONS.map((sol, idx) => (
          <div
            key={sol.title}
            className="flex flex-col lg:flex-row items-start justify-between gap-8 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs hover:border-sky-300 transition-all"
          >
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                Solution 0{idx + 1}
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
                {sol.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {sol.tagline}
              </p>
              <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed">
                {sol.desc}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sol.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto flex flex-col justify-center">
              <Link
                href={TRIAL_HREF}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-6 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>{sol.cta}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

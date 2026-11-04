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
    title: "Startups & Founding Teams",
    tagline: "Close founding engineers without a 10-person recruiting team",
    desc: "When every single hire impacts your company trajectory, you cannot afford resume keyword scanners that disqualify top talent. JobNinjas parses technical portfolios and structures high-signal interview questions directly from your GitHub repos.",
    benefits: [
      "Zero ATS setup required — start with raw resumes and a notion link",
      "Grounded GitHub, PR, and portfolio code verification",
      "Automated interview scheduling and video link synchronization",
      "Flat pricing per open requisition with no per-seat penalty",
    ],
    cta: "Launch Startup Pipeline",
  },
  {
    title: "High-Growth Scale-Ups",
    tagline: "Scale hiring velocity without compromising quality bars",
    desc: "Eliminate recruiter bottlenecks. Synchronize inbound candidates across Greenhouse, Lever, and Ashby. Route qualified candidates into Slack channels for instant interviewer voting and review.",
    benefits: [
      "Bidirectional ATS synchronization with stage automations",
      "Human-in-the-loop decision gates before any offer or rejection",
      "Timestamped transcript scoring that cites candidate responses verbatim",
      "VIP travel concierge for onsite candidate experience",
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
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-mono font-semibold text-neutral-700">
          <Sparkles className="size-3 text-[#ea4b71]" /> TAILORED ARCHITECTURE
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950">
          Designed for the way <br className="hidden sm:inline" />
          modern teams hire.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
          Whether you are making your first 5 engineering hires or coordinating 50 concurrent cross-functional requisitions, JobNinjas adapts to your team structure.
        </p>
      </div>

      <div className="mt-14 space-y-8">
        {SOLUTIONS.map((sol, idx) => (
          <div
            key={sol.title}
            className="flex flex-col lg:flex-row items-start justify-between gap-8 rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 shadow-xs hover:border-neutral-300 transition-all"
          >
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold text-[#ea4b71] uppercase tracking-wider">
                Solution 0{idx + 1}
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-neutral-950">
                {sol.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-neutral-700">
                {sol.tagline}
              </p>
              <p className="mt-4 text-xs sm:text-sm text-neutral-500 leading-relaxed">
                {sol.desc}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sol.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto flex flex-col justify-center">
              <Link
                href={TRIAL_HREF}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 hover:bg-black px-6 text-sm font-semibold text-white shadow-xs transition-all cursor-pointer"
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

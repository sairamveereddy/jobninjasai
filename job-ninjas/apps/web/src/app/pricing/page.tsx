import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, HelpCircle, Shield, Zap } from "lucide-react";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Transparent Pricing for Modern Hiring Teams",
  "Fair-code pricing for JobNinjas. Run autonomous AI recruiting agents on your requisitions without per-seat recruiter penalties.",
);

const TIERS = [
  {
    name: "Starter",
    badge: "Free Forever",
    price: "$0",
    period: "to open one active requisition",
    desc: "Perfect for founders or hiring managers validating autonomous AI agent pipelines on a single role.",
    cta: "Start Free",
    ctaHref: TRIAL_HREF,
    popular: false,
    features: [
      "1 active requisition at a time",
      "JD Parser, Resume Parser & Rubric builder",
      "Objective 0-100 scoring scorecard",
      "Advisory hiring recommendation",
      "Deterministic mock execution engine",
      "Community support",
    ],
  },
  {
    name: "Team Pro",
    badge: "Most Popular",
    price: "$49",
    period: "per open role / month",
    desc: "For growing teams running end-to-end multi-stage interview loops with real ATS and Slack integrations.",
    cta: "Launch Team Workspace",
    ctaHref: TRIAL_HREF,
    popular: true,
    features: [
      "Unlimited active requisitions",
      "All 15 Specialized Autonomous Agents",
      "Llama 3.3 70B & DeepSeek R1 model routing",
      "Greenhouse, Lever & Ashby 2-way sync",
      "Live Slack channel alerts & voting cards",
      "Google Calendar automatic slot scheduling",
      "Interview transcript scoring with timestamp citations",
      "VIP candidate flight & hotel concierge",
      "Shared team workspace & role transfer",
    ],
  },
  {
    name: "Enterprise",
    badge: "Custom Security",
    price: "Custom",
    period: "billed annually",
    desc: "For security-conscious enterprises requiring on-prem VPC deployment, custom models, and audit logs.",
    cta: "Contact Enterprise Team",
    ctaHref: "mailto:enterprise@jobninjas.ai",
    popular: false,
    features: [
      "Custom ATS integrations (Workday, SuccessFactors)",
      "Dedicated private VPC or self-hosted container",
      "Custom fine-tuned LLM evaluators & proprietary rubrics",
      "SSO SAML, LDAP, Okta, & advanced RBAC",
      "Full audit trail & EEOC bias compliance reports",
      "99.9% uptime SLA with dedicated TAM",
      "Automated NDA & reference checking workflows",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-mono font-semibold text-neutral-700">
          <Sparkles className="size-3 text-[#ea4b71]" /> FAIR-CODE PRICING
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950">
          Scale your hiring pipeline, <br className="hidden sm:inline" />
          not your per-seat software bill.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
          JobNinjas charges per active requisition, never per recruiter or hiring manager seat. 
          Invite your whole engineering and executive team without surprise surcharges.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-10 transition-all ${
              tier.popular
                ? "border-2 border-[#ea4b71] bg-white shadow-xl shadow-neutral-200/60 ring-1 ring-[#ea4b71]/20"
                : "border border-neutral-200/90 bg-white shadow-xs hover:border-neutral-300"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#ea4b71] px-4 py-1 text-[11px] font-bold text-white shadow-xs">
                {tier.badge}
              </span>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-950">{tier.name}</h3>
                {!tier.popular && (
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-mono text-neutral-600">
                    {tier.badge}
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-neutral-950 font-mono tracking-tight">
                  {tier.price}
                </span>
                <span className="text-xs font-medium text-neutral-500">{tier.period}</span>
              </div>

              <p className="mt-4 text-xs text-neutral-500 leading-relaxed min-h-[36px]">
                {tier.desc}
              </p>

              <div className="mt-8 border-t border-neutral-100 pt-6">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Included capabilities:
                </span>
                <ul className="mt-4 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-neutral-700">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href={tier.ctaHref}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                  tier.popular
                    ? "bg-[#ea4b71] hover:bg-[#df3860] text-white shadow-md shadow-[#ea4b71]/20 active:scale-95"
                    : "border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900"
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 text-center shadow-xs max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-neutral-950">Enterprise Data Residency & Compliance</h3>
        <p className="mt-2 text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-2xl mx-auto">
          Need private VPC hosting in EU, US, or APAC regions? All enterprise tiers include custom data retention, automated PII redaction, and SOC2 compliance audits.
        </p>
      </div>
    </div>
  );
}

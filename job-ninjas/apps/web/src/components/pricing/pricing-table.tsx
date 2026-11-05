"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap, 
  Check, 
  X, 
  HelpCircle, 
  CreditCard, 
  Lock, 
  SlidersHorizontal,
  ChevronDown,
  Building2,
  Calendar,
  Layers
} from "lucide-react";
import { TRIAL_HREF } from "@/lib/marketing/site";

export function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [checkoutTier, setCheckoutTier] = useState<string | null>(null);
  const [roleCount, setRoleCount] = useState<number>(3);
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);

  const plans = [
    {
      name: "Starter",
      badge: "Free Forever",
      price: "$0",
      period: "1 active role forever",
      desc: "For individual founders and hiring leads testing autonomous AI recruiting agents.",
      popular: false,
      cta: "Start Free",
      features: [
        "1 active role board",
        "Resume Screener Agent (PDF & Word)",
        "Automated 0-100 objective scorecards",
        "Deterministic candidate evidence citations",
        "Standard Llama 3.3 model evaluation",
        "Board sharing with Read-Only viewer mode",
      ],
    },
    {
      name: "Team Pro",
      badge: "Most Popular",
      price: isAnnual ? "$39" : "$49",
      period: isAnnual ? "per open role / mo, billed annually" : "per open role / month",
      desc: "For growing teams that need multi-agent loops, GitHub code audits, audio analysis, and live ATS sync.",
      popular: true,
      cta: "Subscribe to Pro",
      features: [
        "Unlimited active role boards",
        "All 5 Autonomous Agents (Resume, Code, Audio, Travel, Gate)",
        "GitHub AST code auditor & commit reviewer",
        "Interview audio transcript scorer with exact timestamp citations",
        "Ophelia OS VIP flight & hotel booking engine",
        "Greenhouse, Ashby, Lever & Slack 2-way sync",
        "Full board sharing with granular Viewer / Editor / Owner roles",
        "Priority Slack community & email support",
      ],
    },
    {
      name: "Enterprise",
      badge: "Custom Security",
      price: isAnnual ? "$199" : "$249",
      period: "per open role / mo (annual contract)",
      desc: "For high-compliance talent organizations requiring custom models, on-prem VPC, and EEOC bias audits.",
      popular: false,
      cta: "Contact Enterprise",
      features: [
        "Everything in Team Pro",
        "Workday & SuccessFactors enterprise HRIS connectors",
        "Dedicated private VPC or EU/US regional data residency",
        "Custom fine-tuned scoring models & proprietary rubrics",
        "Enterprise SAML SSO (Okta, Azure AD, Google Workspace)",
        "Automated EEOC zero-bias audit certification reports",
        "99.98% uptime SLA with dedicated Technical Account Manager",
      ],
    },
  ];

  const handleCheckout = (planName: string) => {
    if (planName === "Enterprise") {
      window.location.href = "mailto:enterprise@jobninjas.ai?subject=JobNinjas%20Enterprise%20Inquiry";
      return;
    }
    setCheckoutTier(planName);
  };

  const handleActivate = () => {
    if (checkoutTier) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("user_subscription", checkoutTier);
        window.localStorage.setItem("user_roles_quota", String(roleCount));
      }
      setSubscribedPlan(checkoutTier);
      setCheckoutTier(null);
    }
  };

  const calculateSubtotal = () => {
    if (checkoutTier === "Starter") return 0;
    const perRole = isAnnual ? 39 : 49;
    return roleCount * perRole;
  };

  return (
    <div className="w-full font-sans">
      
      {/* Active Subscription Banner if user already subscribed */}
      {subscribedPlan && (
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-xs text-emerald-900 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span className="font-bold">Active Subscription: {subscribedPlan} ({roleCount} Roles Capacity)</span>
          </div>
          <Link
            href="/roles"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 transition-colors"
          >
            Go to Role Boards
          </Link>
        </div>
      )}

      {/* Header and Annual Toggle */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-mono font-semibold text-blue-700 border border-sky-200">
          <Sparkles className="size-3 text-blue-600" /> TRANSPARENT REQUISITION PRICING
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Scale your hiring pipeline, <br className="hidden sm:inline" />
          not your per-seat software bill.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
          JobNinjas charges per active requisition, never per recruiter or hiring manager seat. 
          Invite your whole engineering and executive team with granular view/edit/own permissions.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              !isAnnual ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly Billing
          </button>

          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              isAnnual ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Annual Billing</span>
            <span className="rounded-full bg-emerald-500 text-white px-2 py-0.2 text-[10px] font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-10 transition-all ${
              tier.popular
                ? "border-2 border-blue-600 bg-white shadow-xl shadow-blue-100 ring-2 ring-blue-100"
                : "border border-slate-200 bg-white shadow-xs hover:border-slate-300"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 px-4 py-1 text-[11px] font-bold text-white shadow-sm">
                {tier.badge}
              </span>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                {!tier.popular && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-mono text-slate-600">
                    {tier.badge}
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {tier.price}
                </span>
                <span className="text-xs font-medium text-slate-500">{tier.period}</span>
              </div>

              <p className="mt-4 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                {tier.desc}
              </p>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Included capabilities:
                </span>
                <ul className="mt-4 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                type="button"
                onClick={() => handleCheckout(tier.name)}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                  tier.popular
                    ? "bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-md shadow-blue-500/25 active:scale-95"
                    : "border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 active:scale-95"
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Matrix Toggle */}
      <div className="mt-16 text-center">
        <button
          type="button"
          onClick={() => setShowMatrix(!showMatrix)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <SlidersHorizontal className="size-3.5 text-blue-600" />
          <span>{showMatrix ? "Hide Detailed Feature Comparison Matrix" : "View Full Side-by-Side Feature Comparison"}</span>
          <ChevronDown className={`size-3.5 transition-transform ${showMatrix ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Expandable Comparison Matrix */}
      {showMatrix && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm overflow-x-auto animate-in fade-in duration-200">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 font-mono uppercase text-[11px] text-slate-400">
              <tr>
                <th className="pb-4 font-bold">Platform Capability</th>
                <th className="pb-4 font-bold text-center">Starter</th>
                <th className="pb-4 font-bold text-center text-blue-600">Team Pro</th>
                <th className="pb-4 font-bold text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-semibold text-slate-800">Active Role Requisitions</td>
                <td className="py-3 text-center text-slate-600 font-mono">1 Active</td>
                <td className="py-3 text-center font-bold text-blue-600 font-mono">Unlimited</td>
                <td className="py-3 text-center text-slate-600 font-mono">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Resume Screener Agent</td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">GitHub Code & AST Reviewer Agent</td>
                <td className="py-3 text-center text-slate-300">—</td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Interview Audio Transcript Scorer</td>
                <td className="py-3 text-center text-slate-300">—</td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Ophelia VIP Travel & Hotel Concierge</td>
                <td className="py-3 text-center text-slate-300">—</td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Greenhouse & Ashby Two-Way ATS Sync</td>
                <td className="py-3 text-center text-slate-300">—</td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Slack Real-Time Voting & Alert Cards</td>
                <td className="py-3 text-center text-slate-300">—</td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Board Sharing: View / Edit / Own Roles</td>
                <td className="py-3 text-center text-slate-500 font-mono">View Only</td>
                <td className="py-3 text-center font-bold text-blue-600 font-mono">Full Granular</td>
                <td className="py-3 text-center font-bold text-slate-800 font-mono">Full Granular + SAML</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Zero-Training PII Privacy & Bias Audit</td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
                <td className="py-3 text-center"><Check className="size-4 text-emerald-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Dedicated Private VPC & SLA</td>
                <td className="py-3 text-center text-slate-300">—</td>
                <td className="py-3 text-center text-slate-300">—</td>
                <td className="py-3 text-center font-bold text-purple-700 font-mono">99.98% SLA</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Subscription Checkout Modal */}
      {checkoutTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="size-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Subscribe to {checkoutTier}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutTier(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  How many concurrent open requisitions does your team need?
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={roleCount}
                    onChange={(e) => setRoleCount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-sm text-slate-900 w-16 text-right">
                    {roleCount} {roleCount === 1 ? "role" : "roles"}
                  </span>
                </div>
              </div>

              {/* Subtotal Calculation Box */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Selected Tier:</span>
                  <span className="font-semibold text-slate-900">{checkoutTier}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Billing Cadence:</span>
                  <span className="font-semibold text-slate-900">{isAnnual ? "Annual (20% Off)" : "Monthly"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Rate per Open Requisition:</span>
                  <span className="font-semibold text-slate-900">${isAnnual ? "39" : "49"}/mo</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>Total Subscription:</span>
                  <span className="text-blue-700 font-mono text-base">${calculateSubtotal()}/month</span>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-xs text-blue-900 flex items-center gap-2">
                <Lock className="size-4 text-blue-600 shrink-0" />
                <span>14-day free sandbox trial included. No immediate charge today.</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCheckoutTier(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleActivate}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-semibold shadow-md shadow-blue-500/25 transition-all"
              >
                Confirm & Activate {checkoutTier}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

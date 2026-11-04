import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { FaqList } from "@/components/marketing/faq-list";
import { pageSeo, PLANS } from "@/lib/marketing/site";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Zap, HelpCircle } from "lucide-react";

export const metadata: Metadata = pageSeo(
  "Pricing",
  "Transparent pricing for JobNinjas AI recruiting platform. Starter is free for 1 role. Team is $49/mo flat with no per-seat fees.",
);

export default function PricingPage() {
  return (
    <MarketingShell>
      <main className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#ff6d5a]/15 via-[#7d52ff]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6d5a]/30 bg-[#ff6d5a]/10 px-3.5 py-1.5 text-xs font-semibold text-[#ff806f] mb-4">
            <Zap className="size-3.5 text-[#ff6d5a]" />
            <span>Fair & Predictable Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            One role to start. A flat plan when you scale.
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            Never pay per-seat recruiter penalties. Unlimited teammates, full access to 15 autonomous agents, and zero credit card required to start.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="relative z-10 mt-14 grid gap-8 lg:grid-cols-3 items-stretch">
          {PLANS.map((plan) => {
            const isFeatured = plan.featured;
            return (
              <article
                key={plan.name}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-200 backdrop-blur-xl ${
                  isFeatured
                    ? "border-2 border-[#ff6d5a] bg-gradient-to-b from-[#181a29] to-[#10121d] shadow-2xl shadow-[#ff6d5a]/20 scale-105 z-20"
                    : "border border-white/[0.1] bg-[#0e1017]/90 shadow-xl shadow-black/40 hover:border-white/20"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ff6d5a] to-[#ff4732] px-4 py-1 text-xs font-extrabold text-white uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white tracking-tight">{plan.name}</h2>
                    {isFeatured && <Sparkles className="size-4 text-[#ff7a68]" />}
                  </div>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[40px]">
                    {plan.blurb}
                  </p>

                  <div className="my-6 border-t border-white/[0.08]" />

                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Included Capabilities</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className={`size-4 shrink-0 mt-0.5 ${isFeatured ? "text-[#ff7a68]" : "text-emerald-400"}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    isFeatured
                      ? "bg-gradient-to-r from-[#ff6d5a] to-[#ff4732] text-white shadow-lg shadow-[#ff6d5a]/30 hover:brightness-110"
                      : "border border-white/20 bg-white/[0.06] text-white hover:bg-white/[0.1] hover:border-white/30"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </article>
            );
          })}
        </div>

        {/* Clear Rules & Guarantees */}
        <div className="mt-20 rounded-2xl border border-white/[0.1] bg-[#0c0d14]/80 p-8 backdrop-blur-md">
          <div className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-[#ff7a68] mb-3">
            <ShieldCheck className="size-4" />
            <span>The JobNinjas Honest Pricing Guarantee</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
            No tricks, no hidden seat penalties.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-400 leading-relaxed">
            <p>
              <strong>Starter is 100% free forever:</strong> Holds one active requisition. Once you fill or close the role, the slot immediately frees up for your next hiring search.
            </p>
            <p>
              <strong>Team is flat $49/mo for the workspace:</strong> Invite your entire hiring loop, recruiters, and engineering managers without paying an extra dollar per seat.
            </p>
            <p>
              <strong>Zero surprise API invoices:</strong> Llama 3.3 70B inference is included in your plan with intelligent rate caching and token windowing.
            </p>
            <p>
              <strong>You always make the call:</strong> Agents provide evidence, scorecards, and drafts. Human approval gates ensure no outreach or offer is dispatched without your sign-off.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <FaqList />
        </div>
      </main>
    </MarketingShell>
  );
}

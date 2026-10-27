import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { FaqList } from "@/components/marketing/faq-list";
import { pageSeo, PLANS } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Pricing",
  "Pricing for the JobNinjas OS for one open role. One requisition is free. Team is $49 a month for every open role and the full agent pipeline.",
);

export default function PricingPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">Pricing</p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[52px]">
            One role to start. A flat plan when you have more.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-[#b1b3b8]">
            Starter and Team are flat plans. Enterprise is scoped with your team.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-[8px] border p-6 ${
                plan.featured ? "border-[#5e6ad2] bg-[#5e6ad2]" : "border-white/[0.08] bg-[#111214]"
              }`}
            >
              <p className={`text-[12px] font-medium uppercase tracking-[0.14em] ${plan.featured ? "text-white" : "text-[#94969c]"}`}>
                {plan.name}
              </p>
              <p className="mt-4 text-[40px] font-medium tracking-[-0.02em]">{plan.price}</p>
              <p className={`mt-1 text-[13px] ${plan.featured ? "text-white" : "text-[#94969c]"}`}>{plan.period}</p>
              <p className={`mt-4 text-[14px] leading-relaxed ${plan.featured ? "text-white" : "text-[#b1b3b8]"}`}>{plan.blurb}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className={`text-[14px] ${plan.featured ? "text-white" : "text-[#b1b3b8]"}`}>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 inline-flex h-10 items-center justify-center rounded-[4px] text-[13px] font-medium ${
                  plan.featured ? "bg-white text-[#1c2148] hover:bg-white/90" : "bg-white/[0.06] text-white hover:bg-white/[0.1]"
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-20 max-w-3xl">
          <h2 className="text-[28px] font-medium tracking-[-0.02em]">Questions</h2>
          <div className="mt-6">
            <FaqList />
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}

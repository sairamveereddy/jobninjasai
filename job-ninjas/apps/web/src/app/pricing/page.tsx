import type { Metadata } from "next";
import { pageSeo } from "@/lib/marketing/site";
import { MarketingShell } from "@/components/marketing-layout";
import { PricingTable } from "@/components/pricing/pricing-table";

export const metadata: Metadata = pageSeo(
  "Transparent Requisition Pricing · JobNinjas",
  "Fair-code pricing for JobNinjas. Run autonomous AI recruiting agents on your requisitions without per-seat recruiter penalties.",
);

export default function PricingPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans">
        <PricingTable />

        {/* Enterprise Data Residency & Compliance Note */}
        <div className="mt-16 rounded-3xl border border-sky-100 bg-sky-50/50 p-8 sm:p-10 text-center shadow-xs max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-slate-900">Enterprise Data Residency & Compliance</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Need private VPC hosting in EU, US, or APAC regions? All enterprise tiers include custom data retention, automated PII redaction, and SOC2 Type II compliance audits.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}

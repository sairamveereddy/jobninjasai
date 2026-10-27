import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-layout";
import { pageSeo } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Terms",
  "Terms for using JobNinjas, the OS for one open role, including hiring agents and candidate data.",
);

export default function TermsPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <Link href="/" className="text-[13px] text-[#8b90d6] hover:text-white">
          ← Home
        </Link>
        <h1 className="mt-6 text-[36px] font-medium tracking-[-0.02em]">Terms and Conditions</h1>
        <p className="mt-3 text-[14px] text-[#94969c]">Last updated: October 27, 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[#b1b3b8]">
          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">1. Agreement to Terms</h2>
            <p>By accessing and using JobNinjas, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our service.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">2. Use of AI Agents</h2>
            <p>JobNinjas provides hiring agents for one open role. You are responsible for ensuring that your use of these agents complies with all applicable employment laws, anti-discrimination regulations, and hiring practices in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">3. Data Privacy</h2>
            <p>Your use of JobNinjas is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding candidate data and your personal information.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">4. User Responsibilities</h2>
            <p>You agree not to use the platform to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Process candidate data without proper consent</li>
              <li>Deploy agents for discriminatory hiring practices</li>
              <li>Interfere with or disrupt the service</li>
              <li>Attempt to bypass any security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">5. Intellectual Property</h2>
            <p>The platform, including its original content, features, AI models, and functionality, are owned by JobNinjas and are protected by international copyright, trademark, and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">6. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes. Your continued use of the service following the posting of any changes constitutes acceptance of those changes.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">7. Contact & Support</h2>
            <p>If you have any questions, require assistance, or need to report an issue, please contact us directly at <a href="mailto:veereddy@jobninjas.org" className="text-[#8b90d6] hover:underline">veereddy@jobninjas.org</a>.</p>
          </section>
        </div>
      </main>
    </MarketingShell>
  );
}

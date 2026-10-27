import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-layout";
import { pageSeo } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Privacy",
  "How JobNinjas, the OS for one open role, handles account information and candidate data.",
);

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <Link href="/" className="text-[13px] text-[#8b90d6] hover:text-white">
          ← Home
        </Link>
        <h1 className="mt-6 text-[36px] font-medium tracking-[-0.02em]">Privacy Policy</h1>
        <p className="mt-3 text-[14px] text-[#94969c]">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[#b1b3b8]">
          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when using JobNinjas, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Account information (name, email, company details)</li>
              <li>Workflow configurations and AI agent prompts</li>
              <li>Candidate data processed through our platform</li>
              <li>Usage data and interactions with our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide, maintain, and improve our AI hiring platform</li>
              <li>Process and analyze candidate profiles as directed by your workflows</li>
              <li>Communicate with you regarding service updates and support</li>
              <li>Ensure the security and integrity of our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">3. Candidate Data Processing</h2>
            <p>As a recruitment automation platform, we process candidate data on your behalf. You remain the data controller, and we act as the data processor. We do not use your candidates' personal data for our own purposes or to train our foundational AI models without explicit consent.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">4. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your data and candidate information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">5. Third-Party Services</h2>
            <p>We may use third-party service providers (such as OpenAI or Anthropic) to power our AI agents. These providers are bound by strict confidentiality and data protection agreements.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or need help, please contact us at <a href="mailto:veereddy@jobninjas.org" className="text-[#8b90d6] hover:underline">veereddy@jobninjas.org</a>.</p>
          </section>
        </div>
      </main>
    </MarketingShell>
  );
}

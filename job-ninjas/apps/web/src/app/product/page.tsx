import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { pageSeo, TRIAL_HREF } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Product",
  "JobNinjas is the OS for one open role. Candidates, resumes, transcripts, and agent output stay on that requisition.",
);

const PILLARS = [
  {
    href: "/product/canvas",
    title: "One board is one role",
    body: "The requisition holds the job description, the candidates, and their documents. The next job gets its own board.",
  },
  {
    href: "/product/resume-parser",
    title: "Agents with a job",
    body: "Resume Intelligence, Interview Planning, Interview Analysis, and Candidate Decision each take inputs and write outputs.",
  },
  {
    href: "/product/integrations",
    title: "Greenhouse comes in",
    body: "Import a Greenhouse slate onto the role. The ATS can stay the system of record.",
  },
];

export default function ProductPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">Product</p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[56px]">
            The OS for a single open role.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-[#b1b3b8]">
            JobNinjas is where a talent team runs one requisition. Candidates, resumes, transcripts, and agent output stay on that role.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={TRIAL_HREF}
              className="inline-flex h-11 items-center justify-center rounded-[4px] bg-[#5e6ad2] px-5 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-[#6d78d8]"
            >
              Try a role
            </Link>
            <Link
              href="/templates"
              className="inline-flex h-11 items-center justify-center rounded-[4px] border border-white/[0.15] px-5 text-[14px] font-medium text-white hover:bg-white/[0.04]"
            >
              See the agents
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {PILLARS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[8px] border border-white/[0.08] bg-[#111214] p-6 transition-colors hover:bg-[#1a1b1e]"
            >
              <h2 className="text-[18px] font-medium tracking-[-0.02em]">{item.title}</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#b1b3b8]">{item.body}</p>
            </Link>
          ))}
        </div>
      </main>
    </MarketingShell>
  );
}

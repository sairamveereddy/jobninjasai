import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Resources | JobNinjas",
  description: "How to work a role in JobNinjas, and what the product does not pretend to publish yet.",
};

const LINKS = [
  {
    href: "/resources/docs",
    title: "Work a role",
    body: "Create the requisition, add inputs, and run the agents in order.",
  },
  {
    href: "/templates",
    title: "Agent library",
    body: "The five agents on a role, with the inputs they read and the outputs they write.",
  },
  {
    href: "/resources/case-studies",
    title: "Workflows, not logos",
    body: "Screen a slate, run a loop, write a decision. No invented customer metrics.",
  },
  {
    href: "mailto:veereddy@jobninjas.org",
    title: "Ask a question",
    body: "Write us about a role, Greenhouse, or an enterprise security review.",
  },
];

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">Resources</p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[52px]">
            Learn the role. Skip the brochure.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-[#b1b3b8]">
            There is no newsletter and no canvas shortcut guide. Start with how a requisition actually runs.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {LINKS.map((item) => (
            <Link
              key={item.title}
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

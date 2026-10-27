import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";

import { pageSeo } from "@/lib/marketing/site";

export const metadata: Metadata = pageSeo(
  "Solutions",
  "How startups, enterprise talent teams, and agencies use JobNinjas, the OS for one open role.",
);

const SOLUTIONS = [
  {
    href: "/solutions/startups",
    title: "Startups",
    body: "A founder or a single recruiter runs each open job as its own board, with agents doing the first pass.",
  },
  {
    href: "/solutions/enterprise",
    title: "Enterprise",
    body: "Greenhouse stays the system of record. JobNinjas is the workspace where the role is actually worked.",
  },
  {
    href: "/solutions/agencies",
    title: "Agencies",
    body: "One board per client search, with resumes, the interview plan, and a decision memo in the same place.",
  },
];

export default function SolutionsPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">Solutions</p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[52px]">
            The same role board, three kinds of team.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-[#b1b3b8]">
            We are not publishing customer quotes. These are the ways the product is meant to be used.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {SOLUTIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[8px] border border-white/[0.08] bg-[#111214] p-6 transition-colors hover:bg-[#1a1b1e]"
            >
              <h2 className="text-[20px] font-medium tracking-[-0.02em]">{item.title}</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#b1b3b8]">{item.body}</p>
              <p className="mt-5 text-[13px] text-[#8b90d6]">Open this solution</p>
            </Link>
          ))}
        </div>
      </main>
    </MarketingShell>
  );
}

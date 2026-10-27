import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { AGENTS, TRIAL_HREF } from "@/lib/marketing/site";

export const metadata: Metadata = {
  title: "Agents | JobNinjas",
  description: "The hiring agents on a JobNinjas role: what they read, and what they write back.",
};

export default function AgentTemplatesPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8b90d6]">Agents</p>
          <h1 className="mt-3 text-[40px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[52px]">
            Five agents. One pipeline. Every candidate.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-[#b1b3b8]">
            These are the agents on a role board. They are not a menu of bots you scatter across a canvas. Each one consumes the previous step and writes a document the team can read.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {AGENTS.map((agent, index) => (
            <article key={agent.name} className="rounded-[8px] border border-white/[0.08] bg-[#111214] p-6">
              <p className="text-[12px] tabular-nums text-[#707277]">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 text-[20px] font-medium tracking-[-0.02em]">{agent.name}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#b1b3b8]">{agent.summary}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#707277]">Inputs</p>
                  <ul className="mt-2 space-y-1">
                    {agent.inputs.map((item) => (
                      <li key={item} className="text-[13px] text-[#b1b3b8]">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#707277]">Outputs</p>
                  <ul className="mt-2 space-y-1">
                    {agent.outputs.map((item) => (
                      <li key={item} className="text-[13px] text-white">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Link
          href={TRIAL_HREF}
          className="mt-10 inline-flex h-11 items-center justify-center rounded-[4px] bg-[#5e6ad2] px-5 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-[#6d78d8]"
        >
          Run them on a role
        </Link>
      </main>
    </MarketingShell>
  );
}

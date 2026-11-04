import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-layout";
import { AGENTS, pageSeo, TRIAL_HREF } from "@/lib/marketing/site";
import { 
  ArrowRight, 
  Cpu, 
  Workflow, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Play, 
  Terminal,
  Zap,
  ChevronRight
} from "lucide-react";

export const metadata: Metadata = pageSeo(
  "Workflow Templates & Agent Catalog",
  "Browse pre-built autonomous agent pipelines for technical screening, interview scoring, and offer decisions on JobNinjas.",
);

export default function AgentTemplatesPage() {
  return (
    <MarketingShell>
      <main className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#ff6d5a]/15 via-[#7d52ff]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6d5a]/30 bg-[#ff6d5a]/10 px-3.5 py-1.5 text-xs font-semibold text-[#ff806f] mb-4">
            <Workflow className="size-3.5 text-[#ff6d5a]" />
            <span>Agent Catalog & Pipeline Templates</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            15 specialized agents. Infinite workflow possibilities.
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            Every agent is a modular building block with documented input contracts, strict artifact outputs, and grounded LLM reasoning. Drag, wire, and execute on any open requisition.
          </p>
        </div>

        {/* Workflow Gallery Grid */}
        <div className="relative z-10 mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, index) => (
            <article
              key={agent.name}
              className="group relative rounded-2xl border border-white/[0.1] bg-[#0e1017]/90 p-6 backdrop-blur-md shadow-xl shadow-black/40 hover:border-[#ff6d5a]/40 hover:bg-[#121420] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#ff6d5a]/15 text-[#ff7a68] border border-[#ff6d5a]/30">
                    Node #{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-[#ff806f] transition-colors tracking-tight">
                  {agent.name}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {agent.summary}
                </p>

                <div className="mt-5 space-y-3 pt-4 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Consumes Input</span>
                    <ul className="mt-1 space-y-1">
                      {agent.inputs.map((item) => (
                        <li key={item} className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                          <span className="size-1 rounded-full bg-slate-500" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Produces Artifact</span>
                    <ul className="mt-1 space-y-1">
                      {agent.outputs.map((item) => (
                        <li key={item} className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                          <span className="size-1 rounded-full bg-emerald-400" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <Link
                  href={TRIAL_HREF}
                  className="text-xs font-semibold text-[#ff7a68] hover:text-[#ff9282] flex items-center gap-1 transition-colors"
                >
                  <span>Wire into role canvas</span>
                  <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="text-[10.5px] font-mono text-slate-500">Llama 3.3 70B</span>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 rounded-2xl border border-white/[0.1] bg-gradient-to-r from-[#121422] to-[#1a1c2e] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Need a custom agent for your hiring loop?</h3>
            <p className="mt-1 text-sm text-slate-400">Add proprietary coding assessments, HackerRank webhooks, or custom evaluation prompts via our agent SDK.</p>
          </div>
          <Link
            href={TRIAL_HREF}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6d5a] to-[#ff4732] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ff6d5a]/25 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Open Role Canvas Free</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    </MarketingShell>
  );
}
